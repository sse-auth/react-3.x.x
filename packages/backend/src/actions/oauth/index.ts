import * as checks from './checks.js';
import * as o from 'oauth4webapi';
import { decodeJwt } from 'jose';

// SSE Auth - Imports
import type { InternalOptions, RequestInternal } from '@sse-auth/types/config';
import type { Cookie } from '@sse-auth/types/cookie';
import type { Account, Profile, TokenSet, User } from '@sse-auth/types';
import type { LoggerInstance } from '@sse-auth/types/logger';
import type { OAuthConfigInternal } from '@sse-auth/types/provider';
import { customFetch, conformInternal } from '@sse-auth/types/symbol';
import { isOIDCProvider } from '@sse-auth/utils';
import { OAuthCallbackError } from '@sse-auth/types/error';
import { OAuthProfileParseError } from '@sse-auth/types/error';

// SSE url - check
const uriCheck = (url: URL): boolean => {
  return (
    url.host === 'localhost' ||
    url.host.endsWith('.sse.dev') ||
    url.host.endsWith('.sse') ||
    url.host === 'authjs.dev' ||
    url.host === 'auth.sse'
  );
};

// Interface SSE Auth - Options
interface ResponseUser {
  id: `${string}-${string}-${string}-${string}-${string}`;
  email: string | undefined;
  name?: string | null;
  image?: string | null;
}

interface ResponseAccount {
  provider: string;
  type: 'oauth' | 'oidc';
  providerAccountId: string;
  access_token?: string | undefined;
  expires_in?: number;
  id_token?: string;
  refresh_token?: string;
  scope?: string;
  authorization_details?: o.AuthorizationDetails[];
  token_type?: Lowercase<string> | undefined;
  expires_at?: number;
}

interface ResponseData {
  profile: Profile;
  cookies: Cookie[];
  user?: ResponseUser;
  account: ResponseAccount;
}

/**
 * Generates an authorization/request token URL.
 * And the OAuth 2.0 flow.
 *
 * [OAuth 2](https://www.oauth.com/oauth2-servers/authorization/the-authorization-request/)
 */
export async function handleOAuthLogin(
  query: RequestInternal['query'],
  options: InternalOptions<'oauth' | 'oidc'>
) {
  const { logger, provider } = options;

  let url = provider.authorization?.url;
  let as: o.AuthorizationDetails | undefined;

  if (!url || uriCheck(url)) {
    // If url is undefined, we assume that issuer is always defined
    // We check this in assert.ts

    const issuer = new URL(provider.issuer!);
    const discoveryResponse = await o.discoveryRequest(issuer, {
      [o.customFetch]: provider[customFetch],
      // TODO: move away from allowing insecure HTTP requests
      [o.allowInsecureRequests]: true,
    });

    const as = await o.processDiscoveryResponse(issuer, discoveryResponse).catch((error) => {
      if (!(error instanceof TypeError) || error.message !== 'Invalid URL') throw error;
      throw new TypeError(
        `Discovery request responded with an invalid issuer. expected: ${issuer}`
      );
    });

    if (!as.authorization_endpoint) {
      throw new TypeError(
        `Discovery request did not return an authorization endpoint. expected: ${issuer}`
      );
    }

    url = new URL(as.authorization_endpoint);
  }

  const authParams = url.searchParams;
  let redirect_uri: string = provider.callbackUrl;
  let data: string | undefined;

  if (!options.isOnRedirectProxy && provider.redirectProxyUrl) {
    redirect_uri = provider.redirectProxyUrl;
    data = provider.callbackUrl;
    logger.debug('using redirect proxy', { redirect_uri, data });
  }

  const params = Object.assign(
    {
      response_type: 'code',
      // clientId can technically be undefined, should we check this in assert.ts or rely on the Authorization Server to do it?
      client_id: provider.clientId,
      redirect_uri,
      // @ts-expect-error TODO:
      ...provider.authorization?.params,
    },
    Object.fromEntries(provider.authorization?.url.searchParams ?? []),
    query
  );

  for (const k in params) authParams.set(k, params[k]);
  const cookies: Cookie[] = [];

  if (
    // Otherwise "POST /redirect_uri" wouldn't include the cookies
    provider.authorization?.url.searchParams.get('response_mode') === 'form_post'
  ) {
    options.cookies.state.options.sameSite = 'none';
    options.cookies.state.options.secure = true;
    options.cookies.nonce.options.sameSite = 'none';
    options.cookies.nonce.options.secure = true;
  }

  const state = await checks.state.create(options, data);
  if (state) {
    authParams.set('state', state.value);
    cookies.push(state.cookie);
  }

  if (provider.checks?.includes('pkce')) {
    if (
      as &&
      Array.isArray(as.code_challenge_methods_supported) &&
      !as.code_challenge_methods_supported.includes('S256')
    ) {
      // We assume S256 PKCE support, if the server does not advertise that,
      // a random `nonce` must be used for CSRF protection.
      if (provider.type === 'oidc') provider.checks = ['nonce'];
    } else {
      const { value, cookie } = await checks.pkce.create(options);
      authParams.set('code_challenge', value);
      authParams.set('code_challenge_method', 'S256');
      cookies.push(cookie);
    }
  }

  const nonce = await checks.nonce.create(options);
  if (nonce) {
    authParams.set('nonce', nonce.value);
    cookies.push(nonce.cookie);
  }

  // TODO: This does not work in normalizeOAuth because authorization endpoint can come from discovery
  // Need to make normalizeOAuth async
  if (provider.type === 'oidc' && !url.searchParams.has('scope')) {
    url.searchParams.set('scope', 'openid profile email');
  }

  logger.debug('authorization url is ready', { url, cookies, provider });

  const redirect = url.toString();
  const cookieObject = Object.fromEntries(cookies.map((cookie) => [cookie.name, cookie.value]));
  const { profile, cookies: resCookies, user } = await handleOAuth(params, cookieObject, options);

  return { profile, cookies: resCookies, user };
}

// Function
function formUrlEncode(token: string) {
  return encodeURIComponent(token).replace(/%20/g, '+');
}

/**
 * Formats client_id and client_secret as an HTTP Basic Authentication header as per the OAuth 2.0
 * specified in RFC6749.
 */
function clientSecretBasic(clientId: string, clientSecret: string) {
  const username = formUrlEncode(clientId);
  const password = formUrlEncode(clientSecret);
  const credentials = btoa(`${username}:${password}`);
  return `Basic ${credentials}`;
}

/**
 * Handles the following OAuth steps.
 * https://www.rfc-editor.org/rfc/rfc6749#section-4.1.1
 * https://www.rfc-editor.org/rfc/rfc6749#section-4.1.3
 * https://openid.net/specs/openid-connect-core-1_0.html#UserInfoRequest
 *
 * @note Although requesting userinfo is not required by the OAuth2.0 spec,
 * we fetch it anyway. This is because we always want a user profile.
 */
export async function handleOAuth(
  params: RequestInternal['query'],
  cookies: RequestInternal['cookies'],
  options: InternalOptions<'oauth' | 'oidc'>
) {
  const { logger, provider } = options;

  let as: o.AuthorizationServer;

  const { token, userinfo } = provider;
  // Falls back to authjs.dev if the user only passed params
  if (
    (!token?.url || token.url.host === 'authjs.dev') &&
    (!userinfo?.url || userinfo.url.host === 'authjs.dev')
  ) {
    // We assume that issuer is always defined as this has been asserted earlier

    const issuer = new URL(provider.issuer!);
    const discoveryResponse = await o.discoveryRequest(issuer, {
      [o.allowInsecureRequests]: true,
      [o.customFetch]: provider[customFetch],
    });
    as = await o.processDiscoveryResponse(issuer, discoveryResponse);

    if (!as.token_endpoint)
      throw new TypeError('TODO: Authorization server did not provide a token endpoint.');

    if (!as.userinfo_endpoint)
      throw new TypeError('TODO: Authorization server did not provide a userinfo endpoint.');
  } else {
    as = {
      issuer: provider.issuer ?? 'https://authjs.dev', // TODO: review fallback issuer
      token_endpoint: token?.url.toString(),
      userinfo_endpoint: userinfo?.url.toString(),
    };
  }

  const client: o.Client = {
    client_id: provider.clientId,
    ...provider.client,
  };

  let clientAuth: o.ClientAuth;

  switch (client.token_endpoint_auth_method) {
    // TODO: in the next breaking major version have undefined be `client_secret_post`
    case undefined:
    case 'client_secret_basic':
      // TODO: in the next breaking major version use o.ClientSecretBasic() here
      clientAuth = (_as, _client, _body, headers) => {
        headers.set('authorization', clientSecretBasic(provider.clientId, provider.clientSecret!));
      };
      break;
    case 'client_secret_post':
      clientAuth = o.ClientSecretPost(provider.clientSecret!);
      break;
    case 'client_secret_jwt':
      clientAuth = o.ClientSecretJwt(provider.clientSecret!);
      break;
    case 'private_key_jwt':
      clientAuth = o.PrivateKeyJwt(provider.token!.clientPrivateKey!, {
        // TODO: review in the next breaking change
        [o.modifyAssertion](_header, payload) {
          payload.aud = [as.issuer, as.token_endpoint!];
        },
      });
      break;
    case 'none':
      clientAuth = o.None();
      break;
    default:
      throw new Error('unsupported client authentication method');
  }

  const resCookies: Cookie[] = [];

  const state = await checks.state.use(cookies, resCookies, options);

  let codeGrantParams: URLSearchParams;
  try {
    codeGrantParams = o.validateAuthResponse(
      as,
      client,
      new URLSearchParams(params),
      provider.checks.includes('state') ? state : o.skipStateCheck
    );
  } catch (err) {
    if (err instanceof o.AuthorizationResponseError) {
      const cause = {
        providerId: provider.id,
        ...Object.fromEntries(err.cause.entries()),
      };
      logger.debug('OAuthCallbackError', cause);
      throw new OAuthCallbackError('OAuth Provider returned an error', cause);
    }
    throw err;
  }

  const codeVerifier = await checks.pkce.use(cookies, resCookies, options);

  let redirect_uri = provider.callbackUrl;
  if (!options.isOnRedirectProxy && provider.redirectProxyUrl) {
    redirect_uri = provider.redirectProxyUrl;
  }

  let codeGrantResponse = await o.authorizationCodeGrantRequest(
    as,
    client,
    clientAuth,
    codeGrantParams,
    redirect_uri,
    codeVerifier ?? 'decoy',
    {
      // TODO: move away from allowing insecure HTTP requests
      [o.allowInsecureRequests]: true,
      [o.customFetch]: (...args) => {
        if (!provider.checks.includes('pkce')) {
          args[1].body.delete('code_verifier');
        }
        return (provider[customFetch] ?? fetch)(...args);
      },
    }
  );

  if (provider.token?.conform) {
    codeGrantResponse =
      (await provider.token.conform(codeGrantResponse.clone())) ?? codeGrantResponse;
  }

  let profile: Profile = {};

  const requireIdToken = isOIDCProvider(provider);

  if (provider[conformInternal]) {
    switch (provider.id) {
      case 'microsoft-entra-id':
      case 'azure-ad': {
        /**
         * These providers return errors in the response body and
         * need the authorization server metadata to be re-processed
         * based on the `id_token`'s `tid` claim.
         * @see: https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow#error-response-1
         */
        const responseJson = await codeGrantResponse.clone().json();
        if (responseJson.error) {
          const cause = {
            providerId: provider.id,
            ...responseJson,
          };
          throw new OAuthCallbackError(
            `OAuth Provider returned an error: ${responseJson.error}`,
            cause
          );
        }
        const { tid } = decodeJwt(responseJson.id_token);
        if (typeof tid === 'string') {
          const tenantRe = /microsoftonline\.com\/(\w+)\/v2\.0/;
          const tenantId = as.issuer?.match(tenantRe)?.[1] ?? 'common';
          const issuer = new URL(as.issuer.replace(tenantId, tid));
          const discoveryResponse = await o.discoveryRequest(issuer, {
            [o.customFetch]: provider[customFetch],
          });
          as = await o.processDiscoveryResponse(issuer, discoveryResponse);
        }
        break;
      }
      default:
        break;
    }
  }
  const processedCodeResponse = await o.processAuthorizationCodeResponse(
    as,
    client,
    codeGrantResponse,
    {
      expectedNonce: await checks.nonce.use(cookies, resCookies, options),
      requireIdToken,
    }
  );

  const tokens: TokenSet & Pick<Account, 'expires_at'> = processedCodeResponse;

  if (requireIdToken) {
    const idTokenClaims = o.getValidatedIdTokenClaims(processedCodeResponse)!;
    profile = idTokenClaims;

    // Apple sends some of the user information in a `user` parameter as a stringified JSON.
    // It also only does so the first time the user consents to share their information.
    if ((provider as any)[conformInternal] && provider.id === 'apple') {
      try {
        profile.user = JSON.parse(params?.user);
      } catch {}
    }

    if (provider.idToken === false) {
      const userinfoResponse = await o.userInfoRequest(
        as,
        client,
        processedCodeResponse.access_token,
        {
          [o.customFetch]: (provider as any)[customFetch],
          // TODO: move away from allowing insecure HTTP requests
          [o.allowInsecureRequests]: true,
        }
      );

      profile = await o.processUserInfoResponse(as, client, idTokenClaims.sub, userinfoResponse);
    }
  } else {
    if (userinfo?.request) {
      const _profile = await userinfo.request({ tokens, provider });
      if (_profile instanceof Object) profile = _profile;
    } else if (userinfo?.url) {
      const userinfoResponse = await o.userInfoRequest(
        as,
        client,
        processedCodeResponse.access_token,
        {
          [o.customFetch]: provider[customFetch],
          // TODO: move away from allowing insecure HTTP requests
          [o.allowInsecureRequests]: true,
        }
      );
      profile = await userinfoResponse.json();
    } else {
      throw new TypeError('No userinfo endpoint configured');
    }
  }

  if (tokens.expires_in) {
    tokens.expires_at = Math.floor(Date.now() / 1000) + Number(tokens.expires_in);
  }

  const profileResult = await getUserAndAccount(profile, provider, tokens, logger);

  return { ...profileResult, profile, cookies: resCookies };
}

/**
 * Returns the user and account that is going to be created in the database.
 * @internal
 */
export async function getUserAndAccount(
  OAuthProfile: Profile,
  provider: OAuthConfigInternal<any>,
  tokens: TokenSet,
  logger: LoggerInstance
) {
  try {
    const userFromProfile = await provider.profile(OAuthProfile, tokens);
    const user = {
      ...userFromProfile,
      // The user's id is intentionally not set based on the profile id, as
      // the user should remain independent of the provider and the profile id
      // is saved on the Account already, as `providerAccountId`.
      id: crypto.randomUUID(),
      email: userFromProfile.email?.toLowerCase(),
    } satisfies User;

    return {
      user,
      account: {
        ...tokens,
        provider: provider.id,
        type: provider.type,
        providerAccountId: userFromProfile.id ?? crypto.randomUUID(),
      },
    };
  } catch (e) {
    // If we didn't get a response either there was a problem with the provider
    // response *or* the user cancelled the action with the provider.
    //
    // Unfortunately, we can't tell which - at least not in a way that works for
    // all providers, so we return an empty object; the user should then be
    // redirected back to the sign up page. We log the error to help developers
    // who might be trying to debug this when configuring a new provider.
    logger.debug('getProfile error details', OAuthProfile);
    logger.error(new OAuthProfileParseError(e as Error, { provider: provider.id }));
  }
}
