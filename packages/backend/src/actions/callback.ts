import type {
  InternalOptions,
  RequestInternal,
  ResponseInternal,
} from "@sse-auth/types/config";
import type { Cookie } from "@sse-auth/types/cookie";
import {
  AccessDenied,
  AuthError,
  CallbackRouteError,
  CredentialsSignin,
  InvalidProvider,
  Verification,
} from "@sse-auth/types/error";
import type { SessionStore } from "../utils/cookie.js";
import { state } from "./checks.js";
import { handleOAuth } from "./oauth.js";
import { handleLoginOrRegister } from "./handle-login.js";
import type { AdapterSession } from "@sse-auth/types/adapter";
import { createHash } from "../utils/web.js";
import type { Account, Authenticator, User } from "@sse-auth/types";
import {
  assertInternalOptionsWebAuthn,
  verifyAuthenticate,
  verifyRegister,
} from "../utils/webauthn-utils.js";

/** Handle callbacks from login services */
export async function callback(
  request: RequestInternal,
  options: InternalOptions,
  sessionStore: SessionStore,
  cookies: Cookie[]
): Promise<ResponseInternal> {
  if (!options.provider)
    throw new InvalidProvider("Callback route called without provider");
  const { query, body, method, headers } = request;
  const {
    provider,
    adapter,
    url,
    callbackUrl,
    pages,
    jwt,
    events,
    callbacks,
    session: { strategy: sessionStrategy, maxAge: sessionMaxAge },
    logger,
  } = options;

  const useJwtSession = sessionStrategy === "jwt";

  try {
    if (provider.type === "oauth" || provider.type === "oidc") {
      // Use body if the response mode is set to form_post. For all other cases, use query
      const params =
        provider.authorization?.url.searchParams.get("response_mode") ===
        "form_post"
          ? body
          : query;

      // If we have a state and we are on a redirect proxy, we try to parse it
      // and see if it contains a valid origin to redirect to. If it does, we
      // redirect the user to that origin with the original state.
      if (options.isOnRedirectProxy && params?.state) {
        // NOTE: We rely on the state being encrypted using a shared secret
        // between the proxy and the original server.
        const parsedState = await state.decode(params.state, options);
        const shouldRedirect =
          parsedState?.origin &&
          new URL(parsedState.origin).origin !== options.url.origin;
        if (shouldRedirect) {
          const proxyRedirect = `${parsedState.origin}?${new URLSearchParams(
            params
          )}`;
          logger.debug("Proxy redirecting to", proxyRedirect);
          return { redirect: proxyRedirect, cookies };
        }
      }

      const authorizationResult = await handleOAuth(
        params,
        request.cookies,
        options
      );

      if (authorizationResult.cookies.length) {
        cookies.push(...authorizationResult.cookies);
      }

      logger.debug("authorization result", authorizationResult);

      const {
        user: userFromProvider,
        account,
        profile: OAuthProfile,
      } = authorizationResult;

      // If we don't have a profile object then either something went wrong
      // or the user cancelled signing in. We don't know which, so we just
      // direct the user to the signin page for now. We could do something
      // else in future.
      // TODO: Handle user cancelling signin
      if (!userFromProvider || !account || !OAuthProfile) {
        return { redirect: `${url}/signin`, cookies };
      }

      // Check if user is allowed to sign in
      // Attempt to get Profile from OAuth provider details before invoking
      // signIn callback - but if no user object is returned, that is fine
      // (that just means it's a new user signing in for the first time).
      let userByAccount;
      if (adapter) {
        const { getUserByAccount } = adapter;
        userByAccount = await getUserByAccount({
          providerAccountId: account.providerAccountId,
          provider: provider.id,
        });
      }

      const redirect = await handleAuthorized(
        {
          user: userByAccount ?? userFromProvider,
          account,
          profile: OAuthProfile,
        },
        options
      );
      if (redirect) return { redirect, cookies };

      const { user, session, isNewUser } = await handleLoginOrRegister(
        sessionStore.value,
        userFromProvider,
        account,
        options
      );

      if (useJwtSession) {
        const defaultToken = {
          name: user.name,
          email: user.email,
          picture:
            typeof user.image === "string"
              ? user.image
              : (user.image as string | null | undefined),
          sub: user.id?.toString(),
        };
        const token = await callbacks.jwt({
          token: defaultToken,
          user,
          account,
          profile: OAuthProfile,
          isNewUser,
          trigger: isNewUser ? "signUp" : "signIn",
        });

        // Clear cookies if token is null
        if (token === null) {
          cookies.push(...sessionStore.clean());
        } else {
          const salt = options.cookies.sessionToken.name;
          // Encode token
          const newToken = await jwt.encode({ ...jwt, token, salt });

          // Set cookie expiry date
          const cookieExpires = new Date();
          cookieExpires.setTime(cookieExpires.getTime() + sessionMaxAge * 1000);

          const sessionCookies = sessionStore.chunk(newToken, {
            expires: cookieExpires,
          });
          cookies.push(...sessionCookies);
        }
      } else {
        // Save Session Token in cookie
        cookies.push({
          name: options.cookies.sessionToken.name,
          value: (session as AdapterSession).sessionToken,
          options: {
            ...options.cookies.sessionToken.options,
            expires: (session as AdapterSession).expires,
          },
        });
      }

      await events.signIn?.({
        user,
        account,
        profile: OAuthProfile,
        isNewUser,
      });

      // Handle first logins on new accounts
      // e.g. option to send users to a new account landing page on initial login
      // Note that the callback URL is preserved, so the journey can still be resumed
      if (isNewUser && pages.newUser) {
        return {
          redirect: `${pages.newUser}${
            pages.newUser.includes("?") ? "&" : "?"
          }${new URLSearchParams({ callbackUrl })}`,
          cookies,
        };
      }

      return { redirect: callbackUrl, cookies };
    } else if (provider.type === "email") {
      const paramToken = query?.token as string | undefined;
      const paramIdentifier = query?.email as string | undefined;

      if (!paramToken) {
        const e = new TypeError(
          "Missing token. The sign-in URL was manually opened without token or the link was not sent correctly in the email.",
          { cause: { hasToken: !!paramToken } }
        );
        e.name = "Configuration";
        throw e;
      }

      const secret = provider.secret ?? options.secret;
      // @ts-expect-error -- Verified in `assertConfig`.
      const invite = await adapter.useVerificationToken({
        // @ts-expect-error User-land adapters might decide to omit the identifier during lookup
        identifier: paramIdentifier, // TODO: Drop this requirement for lookup in official adapters too
        token: await createHash(`${paramToken}${secret}`),
      });

      const hasInvite = !!invite;
      const expired = hasInvite && invite.expires.valueOf() < Date.now();
      const invalidInvite =
        !hasInvite ||
        expired ||
        // The user might have configured the link to not contain the identifier
        // so we only compare if it exists
        (paramIdentifier && invite.identifier !== paramIdentifier);
      if (invalidInvite) throw new Verification({ hasInvite, expired });

      const { identifier } = invite;
      const user = (await adapter!.getUserByEmail(identifier)) ?? {
        id: crypto.randomUUID(),
        email: identifier,
        emailVerified: null,
      };

      const account: Account = {
        providerAccountId: user.email,
        userId: user.id,
        type: "email" as const,
        provider: provider.id,
      };

      const redirect = await handleAuthorized({ user, account }, options);
      if (redirect) return { redirect, cookies };

      // Sign user in
      const {
        user: loggedInUser,
        session,
        isNewUser,
      } = await handleLoginOrRegister(
        sessionStore.value,
        user,
        account,
        options
      );

      if (useJwtSession) {
        const defaultToken = {
          name: loggedInUser.name,
          email: loggedInUser.email,
          picture:
            typeof user.image === "string"
              ? user.image
              : (user.image as string | null | undefined),
          sub: loggedInUser.id?.toString(),
        };
        const token = await callbacks.jwt({
          token: defaultToken,
          user: loggedInUser,
          account,
          isNewUser,
          trigger: isNewUser ? "signUp" : "signIn",
        });

        // Clear cookies if token is null
        if (token === null) {
          cookies.push(...sessionStore.clean());
        } else {
          const salt = options.cookies.sessionToken.name;
          // Encode token
          const newToken = await jwt.encode({ ...jwt, token, salt });

          // Set cookie expiry date
          const cookieExpires = new Date();
          cookieExpires.setTime(cookieExpires.getTime() + sessionMaxAge * 1000);

          const sessionCookies = sessionStore.chunk(newToken, {
            expires: cookieExpires,
          });
          cookies.push(...sessionCookies);
        }
      } else {
        // Save Session Token in cookie
        cookies.push({
          name: options.cookies.sessionToken.name,
          value: (session as AdapterSession).sessionToken,
          options: {
            ...options.cookies.sessionToken.options,
            expires: (session as AdapterSession).expires,
          },
        });
      }

      await events.signIn?.({ user: loggedInUser, account, isNewUser });

      // Handle first logins on new accounts
      // e.g. option to send users to a new account landing page on initial login
      // Note that the callback URL is preserved, so the journey can still be resumed
      if (isNewUser && pages.newUser) {
        return {
          redirect: `${pages.newUser}${
            pages.newUser.includes("?") ? "&" : "?"
          }${new URLSearchParams({ callbackUrl })}`,
          cookies,
        };
      }

      // Callback URL is already verified at this point, so safe to use if specified
      return { redirect: callbackUrl, cookies };
    } else if (provider.type === "credentials" && method === "POST") {
      const credentials = body ?? {};

      // TODO: Forward the original request as is, instead of reconstructing it
      Object.entries(query ?? {}).forEach(([k, v]) =>
        url.searchParams.set(k, v)
      );
      const userFromAuthorize = await provider.authorize(
        credentials,
        // prettier-ignore
        new Request(url, { headers, method, body: JSON.stringify(body) })
      );
      const user = userFromAuthorize;

      if (!user) throw new CredentialsSignin();
      else user.id = user.id?.toString() ?? crypto.randomUUID();

      const account = {
        providerAccountId: user.id,
        type: "credentials",
        provider: provider.id,
      } satisfies Account;

      const redirect = await handleAuthorized(
        { user, account, credentials },
        options
      );
      if (redirect) return { redirect, cookies };

      const defaultToken = {
        name: user.name,
        email: user.email,
        picture: user.image,
        sub: user.id,
      };

      const token = await callbacks.jwt({
        token: defaultToken,
        user,
        account,
        isNewUser: false,
        trigger: "signIn",
      });

      // Clear cookies if token is null
      if (token === null) {
        cookies.push(...sessionStore.clean());
      } else {
        const salt = options.cookies.sessionToken.name;
        // Encode token
        const newToken = await jwt.encode({ ...jwt, token, salt });

        // Set cookie expiry date
        const cookieExpires = new Date();
        cookieExpires.setTime(cookieExpires.getTime() + sessionMaxAge * 1000);

        const sessionCookies = sessionStore.chunk(newToken, {
          expires: cookieExpires,
        });

        cookies.push(...sessionCookies);
      }

      await events.signIn?.({ user, account });

      return { redirect: callbackUrl, cookies };
    } else if (provider.type === "webauthn" && method === "POST") {
      // Get callback action from request. It should be either "authenticate" or "register"
      const action = request.body?.action;
      if (
        typeof action !== "string" ||
        (action !== "authenticate" && action !== "register")
      ) {
        throw new AuthError("Invalid action parameter");
      }
      // Return an error if the adapter is missing or if the provider
      // is not a webauthn provider.
      const localOptions = assertInternalOptionsWebAuthn(options);

      // Verify request to get user, account and authenticator
      let user: User;
      let account: Account;
      let authenticator: Authenticator | undefined;
      switch (action) {
        case "authenticate": {
          const verified = await verifyAuthenticate(
            localOptions,
            request,
            cookies
          );

          user = verified.user;
          account = verified.account;

          break;
        }
        case "register": {
          const verified = await verifyRegister(options, request, cookies);

          user = verified.user;
          account = verified.account;
          authenticator = verified.authenticator;

          break;
        }
      }

      // Check if user is allowed to sign in
      await handleAuthorized({ user, account }, options);

      // Sign user in, creating them and their account if needed
      const {
        user: loggedInUser,
        isNewUser,
        session,
        account: currentAccount,
      } = await handleLoginOrRegister(
        sessionStore.value,
        user,
        account,
        options
      );

      if (!currentAccount) {
        // This is mostly for type checking. It should never actually happen.
        throw new AuthError("Error creating or finding account");
      }

      // Create new authenticator if needed
      if (authenticator && loggedInUser.id) {
        await localOptions.adapter.createAuthenticator({
          ...authenticator,
          userId: loggedInUser.id,
        });
      }

      // Do the session registering dance
      if (useJwtSession) {
        const defaultToken = {
          name: loggedInUser.name,
          email: loggedInUser.email,
          picture: loggedInUser.image as string | null | undefined,
          sub: loggedInUser.id?.toString(),
        };
        const token = await callbacks.jwt({
          token: defaultToken,
          user: loggedInUser,
          account: currentAccount,
          isNewUser,
          trigger: isNewUser ? "signUp" : "signIn",
        });

        // Clear cookies if token is null
        if (token === null) {
          cookies.push(...sessionStore.clean());
        } else {
          const salt = options.cookies.sessionToken.name;
          // Encode token
          const newToken = await jwt.encode({ ...jwt, token, salt });

          // Set cookie expiry date
          const cookieExpires = new Date();
          cookieExpires.setTime(cookieExpires.getTime() + sessionMaxAge * 1000);

          const sessionCookies = sessionStore.chunk(newToken, {
            expires: cookieExpires,
          });
          cookies.push(...sessionCookies);
        }
      } else {
        // Save Session Token in cookie
        cookies.push({
          name: options.cookies.sessionToken.name,
          value: (session as AdapterSession).sessionToken,
          options: {
            ...options.cookies.sessionToken.options,
            expires: (session as AdapterSession).expires,
          },
        });
      }

      await events.signIn?.({
        user: loggedInUser,
        account: currentAccount,
        isNewUser,
      });

      // Handle first logins on new accounts
      // e.g. option to send users to a new account landing page on initial login
      // Note that the callback URL is preserved, so the journey can still be resumed
      if (isNewUser && pages.newUser) {
        return {
          redirect: `${pages.newUser}${
            pages.newUser.includes("?") ? "&" : "?"
          }${new URLSearchParams({ callbackUrl })}`,
          cookies,
        };
      }

      // Callback URL is already verified at this point, so safe to use if specified
      return { redirect: callbackUrl, cookies };
    }

    throw new InvalidProvider(
      `Callback for provider type (${provider.type}) is not supported`
    );
  } catch (e) {
    if (e instanceof AuthError) throw e;
    const error = new CallbackRouteError(e as Error, { provider: provider.id });
    logger.debug("callback route error details", { method, query, body });
    throw error;
  }
}

async function handleAuthorized(
  params: Parameters<InternalOptions["callbacks"]["signIn"]>[0],
  config: InternalOptions
): Promise<string | undefined> {
  let authorized;
  const { signIn, redirect } = config.callbacks;
  try {
    authorized = await signIn(params);
  } catch (e) {
    if (e instanceof AuthError) throw e;
    throw new AccessDenied(e as Error);
  }
  if (!authorized) throw new AccessDenied("AccessDenied");
  if (typeof authorized !== "string") return;
  return await redirect({ url: authorized, baseUrl: config.url.origin });
}
