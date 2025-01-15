import { SerializeOptions } from "./cookie";
import { Client, PrivateKey, TokenEndpointResponse } from "oauth4webapi";
import { customFetch, conformInternal } from "./symbol";

export type Awaitable<T> = T | PromiseLike<T>;
type IssuerMetadata = any;
type PartialIssuer = Partial<Pick<IssuerMetadata, "jwks_endpoint" | "issuer">>;
type UrlParams = Record<string, unknown>;
type AuthorizationParameters = any;
type CallbackParamsType = any;
export type Awaited<T> = T extends Promise<infer U> ? U : T;
export type ProviderType = "oauth" | "email" | "oidc" | "credentials";

export type SemverString =
  | `v${number}`
  | `v${number}.${number}`
  | `v${number}.${number}.${number}`;

/**
 * JSON Object
 */
export type JsonObject = { [Key in string]?: JsonValue };
/**
 * JSON Array
 */
export type JsonArray = JsonValue[];
/**
 * JSON Primitives
 */
export type JsonPrimitive = string | number | boolean | null;
/**
 * JSON Values
 */
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

export interface AuthorizationDetails {
  readonly type: string;
  readonly locations?: string[];
  readonly actions?: string[];
  readonly datatypes?: string[];
  readonly privileges?: string[];
  readonly identifier?: string;

  readonly [parameter: string]: JsonValue | undefined;
}

/**
 * Different tokens returned by OAuth Providers.
 * Some of them are available with different casing,
 * but they refer to the same value.
 */
export type TokenSet = Partial<TokenEndpointResponse> & {
  /**
   * Date of when the `access_token` expires in seconds.
   * This value is calculated from the `expires_in` value.
   *
   * @see https://www.ietf.org/rfc/rfc6749.html#section-4.2.2
   */
  expires_at?: number;
};

/**
 * Usually contains information about the provider being used
 * and also extends `TokenSet`, which is different tokens returned by OAuth Providers.
 */
export interface Account extends Partial<TokenEndpointResponse> {
  /** Provider's id for this account. E.g. "google". See the full list at https://authjs.dev/reference/core/providers */
  provider: string;
  /**
   * This value depends on the type of the provider being used to create the account.
   * - oauth/oidc: The OAuth account's id, returned from the `profile()` callback.
   * - email: The user's email address.
   * - credentials: `id` returned from the `authorize()` callback
   */
  providerAccountId: string;
  /** Provider's type for this account */
  type: ProviderType;
  /**
   * id of the user this account belongs to
   *
   * @see https://authjs.dev/reference/core/adapters#adapteruser
   */
  userId?: string;
  /**
   * Calculated value based on {@link TokenEndpointResponse.expires_in}.
   *
   * It is the absolute timestamp (in seconds) when the {@link TokenEndpointResponse.access_token} expires.
   *
   * This value can be used for implementing token rotation together with {@link TokenEndpointResponse.refresh_token}.
   *
   * @see https://authjs.dev/guides/refresh-token-rotation#database-strategy
   * @see https://www.rfc-editor.org/rfc/rfc6749#section-5.1
   */
  expires_at?: number;
}

/**
 * The user info returned from your OAuth provider.
 *
 * @see https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
 */
export interface Profile {
  id?: string | null;
  sub?: string | null;
  name?: string | null;
  given_name?: string | null;
  family_name?: string | null;
  middle_name?: string | null;
  nickname?: string | null;
  preferred_username?: string | null;
  profile?: string | null;
  picture?: string | null | any;
  website?: string | null;
  email?: string | null;
  email_verified?: boolean | null;
  gender?: string | null;
  birthdate?: string | null;
  zoneinfo?: string | null;
  locale?: string | null;
  phone_number?: string | null;
  updated_at?: Date | string | number | null;
  address?: {
    formatted?: string | null;
    street_address?: string | null;
    locality?: string | null;
    region?: string | null;
    postal_code?: string | null;
    country?: string | null;
  } | null;
  [claim: string]: unknown;
}

type ISODateString = string;
export interface DefaultSession {
  user?: User;
  expires: ISODateString;
}

/** The active session of the logged in user. */
export interface Session extends DefaultSession {}

/**
 * The shape of the returned object in the OAuth providers' `profile` callback,
 * available in the `jwt` and `session` callbacks,
 * or the second parameter of the `session` callback, when using a database.
 */
export interface User {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

/**
 * A webauthn authenticator.
 * Represents an entity capable of authenticating the account it references,
 * and contains the auhtenticator's credentials and related information.
 *
 * @see https://www.w3.org/TR/webauthn/#authenticator
 */
export interface Authenticator {
  /**
   * ID of the user this authenticator belongs to.
   */
  userId?: string;
  /**
   * The provider account ID connected to the authenticator.
   */
  providerAccountId: string;
  /**
   * Number of times the authenticator has been used.
   */
  counter: number;
  /**
   * Whether the client authenticator backed up the credential.
   */
  credentialBackedUp: boolean;
  /**
   * Base64 encoded credential ID.
   */
  credentialID: string;
  /**
   * Base64 encoded credential public key.
   */
  credentialPublicKey: string;
  /**
   * Concatenated transport flags.
   */
  transports?: string | null;
  /**
   * Device type of the authenticator.
   */
  credentialDeviceType: string;
}

/** [Documentation](https://authjs.dev/reference/core#cookies) */
export interface CookieOption {
  name: string;
  options: SerializeOptions;
}

/** [Documentation](https://authjs.dev/reference/core#cookies) */
export interface CookiesOptions {
  sessionToken: Partial<CookieOption>;
  callbackUrl: Partial<CookieOption>;
  csrfToken: Partial<CookieOption>;
  pkceCodeVerifier: Partial<CookieOption>;
  state: Partial<CookieOption>;
  nonce: Partial<CookieOption>;
  webauthnChallenge: Partial<CookieOption>;
}

interface OAuthProviderButtonStyles {
  logo: SVGAElement | string;
}

export interface CommonProviderOptions {
  /**
   * Uniquely identifies the provider in {@link AuthConfig.providers}
   * It's also part of the URL
   */
  id: string;
  /**
   * The provider name used on the default sign-in page's sign-in button.
   * For example if it's "Google", the corresponding button will say:
   * "Sign in with Google"
   */
  name: string;
  /** See {@link ProviderType} */
  type: ProviderType;
}

export interface Theme {
  colorScheme?: "auto" | "dark" | "light";
  logo?: string;
  brandColor?: string;
  buttonText?: string;
}

type EndpointRequest<C, R, P> = (
  context: C & {
    /** Provider is passed for convenience, and also contains the `callbackUrl`. */
    provider: OAuthConfigInternal<P>;
  }
) => Awaitable<R> | void;

/** Gives granular control of the request to the given endpoint */
interface AdvancedEndpointHandler<P extends UrlParams, C, R> {
  /** Endpoint URL. Can contain parameters. Optionally, you can use `params` */
  url?: string;
  /** These will be prepended to the `url` */
  params?: P;
  /**
   * Control the corresponding OAuth endpoint request completely.
   * Useful if your provider relies on some custom behaviour
   * or it diverges from the OAuth spec.
   *
   * - ⚠ **This is an advanced option.**
   * You should **try to avoid using advanced options** unless you are very comfortable using them.
   */
  request?: EndpointRequest<C, R, P>;
  /** @internal */
  conform?: (response: Response) => Awaitable<Response | undefined>;
  clientPrivateKey?: CryptoKey | PrivateKey;
}

/**
 * Either an URL (containing all the parameters) or an object with more granular control.
 * @internal
 */
export type EndpointHandler<
  P extends UrlParams,
  C = any,
  R = any
> = AdvancedEndpointHandler<P, C, R>;

type AuthorizationEndpointHandler = EndpointHandler<AuthorizationParameters>;

type TokenEndpointHandler = EndpointHandler<
  UrlParams,
  {
    /**
     * Parameters extracted from the request to the `/api/auth/callback/:providerId` endpoint.
     * Contains params like `state`.
     */
    params: CallbackParamsType;
    /**
     * When using this custom flow, make sure to do all the necessary security checks.
     * This object contains parameters you have to match against the request to make sure it is valid.
     */
    // checks: OAuthChecks
  },
  {
    tokens: TokenSet;
  }
>;

export type UserinfoEndpointHandler = EndpointHandler<
  UrlParams,
  { tokens: TokenSet },
  Profile
>;

export type AccountCallback = (tokens: TokenSet) => TokenSet | undefined | void;

export type ProfileCallback<Profile> = (
  profile: Profile,
  tokens: TokenSet
) => Awaitable<User>;

export interface OAuth2Config<Profile>
  extends CommonProviderOptions,
    PartialIssuer {
  /**
   * Identifies the provider when you want to sign in to
   * a specific provider.
   *
   * @example
   * ```ts
   * signIn('github') // "github" is the provider ID
   * ```
   */
  id: string;
  /** The name of the provider. shown on the default sign in page. */
  name: string;
  /**
   * OpenID Connect (OIDC) compliant providers can configure
   * this instead of `authorize`/`token`/`userinfo` options
   * without further configuration needed in most cases.
   * You can still use the `authorize`/`token`/`userinfo`
   * options for advanced control.
   *
   * [Authorization Server Metadata](https://datatracker.ietf.org/doc/html/rfc8414#section-3)
   */
  wellknown?: string;
  issuer?: string;
  /**
   * The login process will be initiated by sending the user to this URL.
   *
   * [Authorization endpoint](https://datatracker.ietf.org/doc/html/rfc6749#section-3.1)
   */
  authorization?: string | AuthorizationEndpointHandler;
  token?: string | TokenEndpointHandler;
  userinfo?: string | UserinfoEndpointHandler;
  type: "oauth";
  /**
   * Receives the full {@link Profile} returned by the OAuth provider, and returns a subset.
   * It is used to create the user in the database.
   *
   * Defaults to: `id`, `email`, `name`, `image`
   *
   * @see [Database Adapter: User model](https://authjs.dev/reference/core/adapters#user)
   */
  profile?: ProfileCallback<Profile>;
  /**
   * Receives the full {@link TokenSet} returned by the OAuth provider, and returns a subset.
   * It is used to create the account associated with a user in the database.
   *
   * :::note
   * You need to adjust your database's [Account model](https://authjs.dev/reference/core/adapters#account) to match the returned properties.
   * Check out the documentation of your [database adapter](https://authjs.dev/reference/core/adapters) for more information.
   * :::
   *
   * Defaults to: `access_token`, `id_token`, `refresh_token`, `expires_at`, `scope`, `token_type`, `session_state`
   *
   * @example
   * ```ts
   * import GitHub from "@auth/core/providers/github"
   * // ...
   * GitHub({
   *   account(account) {
   *     // https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/refreshing-user-access-tokens#refreshing-a-user-access-token-with-a-refresh-token
   *     const refresh_token_expires_at =
   *       Math.floor(Date.now() / 1000) + Number(account.refresh_token_expires_in)
   *     return {
   *       access_token: account.access_token,
   *       expires_at: account.expires_at,
   *       refresh_token: account.refresh_token,
   *       refresh_token_expires_at
   *     }
   *   }
   * })
   * ```
   *
   * @see [Database Adapter: Account model](https://authjs.dev/reference/core/adapters#account)
   * @see https://openid.net/specs/openid-connect-core-1_0.html#TokenResponse
   * @see https://www.ietf.org/rfc/rfc6749.html#section-5.1
   */
  account?: AccountCallback;
  /**
   * The CSRF protection performed on the callback endpoint.
   * @default ["pkce"]
   *
   * @note When `redirectProxyUrl` or {@link AuthConfig.redirectProxyUrl} is set,
   * `"state"` will be added to checks automatically.
   *
   * [RFC 7636 - Proof Key for Code Exchange by OAuth Public Clients (PKCE)](https://www.rfc-editor.org/rfc/rfc7636.html#section-4) |
   * [RFC 6749 - The OAuth 2.0 Authorization Framework](https://www.rfc-editor.org/rfc/rfc6749.html#section-4.1.1) |
   * [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html#IDToken) |
   */
  checks?: Array<"pkce" | "state" | "none">;
  clientId?: string;
  clientSecret?: string;
  /**
   * Pass overrides to the underlying OAuth library.
   * See [`oauth4webapi` client](https://github.com/panva/oauth4webapi/blob/main/docs/interfaces/Client.md) for details.
   */
  client?: Partial<Client & { token_endpoint_auth_method: string }>;
  style?: OAuthProviderButtonStyles;
  /**
   * Normally, when you sign in with an OAuth provider and another account
   * with the same email address already exists,
   * the accounts are not linked automatically.
   *
   * Automatic account linking on sign in is not secure
   * between arbitrary providers and is disabled by default.
   * Learn more in our [Security FAQ](https://authjs.dev/concepts#security).
   *
   * However, it may be desirable to allow automatic account linking if you trust that the provider involved has securely verified the email address
   * associated with the account. Set `allowDangerousEmailAccountLinking: true`
   * to enable automatic account linking.
   */
  allowDangerousEmailAccountLinking?: boolean;
  redirectProxyUrl?: string;
  /** @see {customFetch} */
  [customFetch]?: typeof fetch;
  /**
   * The options provided by the user.
   * We will perform a deep-merge of these values
   * with the default configuration.
   *
   * @internal
   */
  /** @see {conformInternal} */
  [conformInternal]?: true;
  options?: OAuthUserConfig<Profile>;
}

/**
 * Extension of the {@link OAuth2Config}.
 *
 * @see https://openid.net/specs/openid-connect-core-1_0.html
 */
export interface OIDCConfig<Profile>
  extends Omit<OAuth2Config<Profile>, "type" | "checks"> {
  type: "oidc";
  checks?: Array<
    NonNullable<OAuth2Config<Profile>["checks"]>[number] | "nonce"
  >;
  /**
   * If set to `false`, the `userinfo_endpoint` will be fetched for the user data.
   * @note An `id_token` is still required to be returned during the authorization flow.
   */
  idToken?: boolean;
}

export type OAuthConfig<Profile> = OAuth2Config<Profile> | OIDCConfig<Profile>;
export type OAuthEndpointType = "authorization" | "token" | "userinfo";

export type OAuthUserConfig<Profile> = Omit<
  Partial<OAuthConfig<Profile>>,
  "options" | "type"
>;

export type OIDCUserConfig<Profile> = Omit<
  Partial<OIDCConfig<Profile>>,
  "options" | "type"
>;

export type OAuthConfigInternal<Profile> = Omit<
  OAuthConfig<Profile>,
  OAuthEndpointType | "redirectProxyUrl"
> & {
  authorization?: { url: URL };
  token?: {
    url: URL;
    request?: TokenEndpointHandler["request"];
    clientPrivateKey?: CryptoKey | PrivateKey;
    /**
     * @internal
     * @deprecated
     */
    conform?: TokenEndpointHandler["conform"];
  };
  userinfo?: { url: URL; request?: UserinfoEndpointHandler["request"] };
  /**
   * Reconstructed from {@link OAuth2Config.redirectProxyUrl},
   * adding the callback action and provider id onto the URL.
   *
   * If defined, it is favoured over {@link OAuthConfigInternal.callbackUrl} in the authorization request.
   *
   * When {@link InternalOptions.isOnRedirectProxy} is set, the actual value is saved in the decoded `state.origin` parameter.
   *
   * @example `"https://auth.example.com/api/auth/callback/:provider"`
   *
   */
  redirectProxyUrl?: OAuth2Config<Profile>["redirectProxyUrl"];
} & Pick<
    Required<OAuthConfig<Profile>>,
    "clientId" | "profile" | "account" | "checks"
  >;

export type OIDCConfigInternal<Profile> = OAuthConfigInternal<Profile> & {
  checks: OIDCConfig<Profile>["checks"];
  idToken: OIDCConfig<Profile>["idToken"];
};

type GetTokenParamsBase = {
  secret?: JWTDecodeParams["secret"];
  salt?: JWTDecodeParams["salt"];
};

export interface GetTokenParams<R extends boolean = false>
  extends GetTokenParamsBase {
  /** The request containing the JWT either in the cookies or in the `Authorization` header. */
  req: Request | { headers: Headers | Record<string, string> };
  /**
   * Use secure prefix for cookie name, unless URL in `NEXTAUTH_URL` is http://
   * or not set (e.g. development or test instance) case use unprefixed name
   */
  secureCookie?: boolean;
  /** If the JWT is in the cookie, what name `getToken()` should look for. */
  cookieName?: string;
  /**
   * `getToken()` will return the raw JWT if this is set to `true`
   *
   * @default false
   */
  raw?: R;
  decode?: JWTOptions["decode"];
  logger?: Console;
}

export interface DefaultJWT extends Record<string, unknown> {
  name?: string | null;
  email?: string | null;
  picture?: string | null;
  sub?: string;
  iat?: number;
  exp?: number;
  jti?: string;
}

/**
 * Returned by the `jwt` callback when using JWT sessions
 *
 * [`jwt` callback](https://authjs.dev/reference/core/types#jwt)
 */
export interface JWT extends Record<string, unknown>, DefaultJWT {}

export interface JWTEncodeParams<Payload = JWT> {
  /**
   * The maximum age of the Auth.js issued JWT in seconds.
   *
   * @default 30 * 24 * 60 * 60 // 30 days
   */
  maxAge?: number;
  /** Used in combination with `secret`, to derive the encryption secret for JWTs. */
  salt: string;
  /** Used in combination with `salt`, to derive the encryption secret for JWTs. */
  secret: string | string[];
  /** The JWT payload. */
  token?: Payload;
}

export interface JWTDecodeParams {
  /** Used in combination with `secret`, to derive the encryption secret for JWTs. */
  salt: string;
  /**
   * Used in combination with `salt`, to derive the encryption secret for JWTs.
   *
   * @note
   * You can also pass an array of secrets, in which case the first secret that successfully
   * decrypts the JWT will be used. This is useful for rotating secrets without invalidating existing sessions.
   * The newer secret should be added to the start of the array, which will be used for all new sessions.
   */
  secret: string | string[];
  /** The Auth.js issued JWT to be decoded */
  token?: string;
}

export interface JWTOptions {
  /**
   * The secret used to encode/decode the Auth.js issued JWT.
   * It can be an array of secrets, in which case the first secret that successfully
   * decrypts the JWT will be used. This is useful for rotating secrets without invalidating existing sessions.
   * @internal
   */
  secret: string | string[];
  /**
   * The maximum age of the Auth.js issued JWT in seconds.
   *
   * @default 30 * 24 * 60 * 60 // 30 days
   */
  maxAge: number;
  /** Override this method to control the Auth.js issued JWT encoding. */
  encode: (params: JWTEncodeParams) => Awaitable<string>;
  /** Override this method to control the Auth.js issued JWT decoding. */
  decode: (params: JWTDecodeParams) => Awaitable<JWT | null>;
}
