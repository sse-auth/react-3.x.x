import { EmailConfig } from "./providers/email";

export type Awaitable<T> = T | PromiseLike<T>;
export type Awaited<T> = T extends Promise<infer U> ? U : T;

type IssuerMetadata = any;
type PartialIssuer = Partial<Pick<IssuerMetadata, "jwks_endpoint" | "issuer">>;
// type UrlParams = Record<string, unknown>;

interface OAuthProviderButtonStyles {
  logo: SVGAElement | string;
}

export type ProviderType = "oauth" | "email";

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

export type SemverString =
  | `v${number}`
  | `v${number}.${number}`
  | `v${number}.${number}.${number}`;

interface EndpointHandler {
  url?: string;
  params?: Record<string, string>;
}

interface AuthorizationEndpointHandler extends EndpointHandler {}

interface TokenEndpointHandler extends EndpointHandler {
  headers?: Headers | Record<string, string>;
}

interface UserEndpointHandler extends EndpointHandler {
  headers?: Headers | Record<string, string>;
}

// export type AccountCallback = (tokens: )

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
  authorization?: string | AuthorizationEndpointHandler;
  token?: string | TokenEndpointHandler;
  userinfo?: string | UserEndpointHandler;
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
  //   account?: AccountCallback;
  clientId?: string;
  clientSecret?: string;
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
  redirectProxyUrl?: AuthConfig["redirectProxyUrl"];
  options?: OAuthUserConfig<Profile>;
  style?: OAuthProviderButtonStyles;
}

/**
 * Extension of the {@link OAuth2Config}.
 *
 * @see https://openid.net/specs/openid-connect-core-1_0.html
 */
export interface OIDCConfig<Profile>
  extends Omit<OAuth2Config<Profile>, "type" | "checks"> {
  type: "oidc";
  /**
   * If set to `false`, the `userinfo_endpoint` will be fetched for the user data.
   * @note An `id_token` is still required to be returned during the authorization flow.
   */
  idToken?: boolean;
}

export type OAuthConfig<Profile> = OAuth2Config<Profile> | OIDCConfig<Profile>;

export type OAuthUserConfig<Profile> = Omit<
  Partial<OAuthConfig<Profile>>,
  "options" | "type"
>;

export type OIDCUserConfig<Profile> = Omit<
  Partial<OIDCConfig<Profile>>,
  "options" | "type"
>;

export interface AuthConfig {
  /**
   * List of authentication providers for signing in
   * (e.g. Google, Facebook, Twitter, GitHub, Email, etc) in any order.
   * This can be one of the built-in providers or an object with a custom provider.
   *
   * @default []
   */
  providers: Provider[];
  /**
   * A random string used to hash tokens, sign cookies and generate cryptographic keys.
   *
   * To generate a random string, you can use the Auth.js CLI: `npx auth secret`
   *
   * @note
   * You can also pass an array of secrets, in which case the first secret that successfully
   * decrypts the JWT will be used. This is useful for rotating secrets without invalidating existing sessions.
   * The newer secret should be added to the start of the array, which will be used for all new sessions.
   *
   */
  secret?: string | string[];
  /**
   * Configure your session like if you want to use JWT or a database,
   * how long until an idle session expires, or to throttle write operations in case you are using a database.
   */
  session?: {
    /**
     * Choose how you want to save the user session.
     * The default is `"jwt"`, an encrypted JWT (JWE) in the session cookie.
     *
     * If you use an `adapter` however, we default it to `"database"` instead.
     * You can still force a JWT session by explicitly defining `"jwt"`.
     *
     * When using `"database"`, the session cookie will only contain a `sessionToken` value,
     * which is used to look up the session in the database.
     *
     * [Documentation](https://authjs.dev/reference/core#authconfig#session) | [Adapter](https://authjs.dev/reference/core#authconfig#adapter) | [About JSON Web Tokens](https://authjs.dev/concepts/session-strategies#jwt-session)
     */
    strategy?: "jwt" | "database";
    /**
     * Relative time from now in seconds when to expire the session
     *
     * @default 2592000 // 30 days
     */
    maxAge?: number;
    /**
     * How often the session should be updated in seconds.
     * If set to `0`, session is updated every time.
     *
     * @default 86400 // 1 day
     */
    updateAge?: number;
    /**
     * Generate a custom session token for database-based sessions.
     * By default, a random UUID or string is generated depending on the Node.js version.
     * However, you can specify your own custom string (such as CUID) to be used.
     *
     * @default `randomUUID` or `randomBytes.toHex` depending on the Node.js version
     */
    generateSessionToken?: () => string;
  };
  /** Changes the theme of built-in {@link AuthConfig.pages}. */
  theme?: Theme;
  /**
   * When set to `true` then all cookies set by NextAuth.js will only be accessible from HTTPS URLs.
   * This option defaults to `false` on URLs that start with `http://` (e.g. http://localhost:3000) for developer convenience.
   * You can manually set this option to `false` to disable this security feature and allow cookies
   * to be accessible from non-secured URLs (this is not recommended).
   *
   * - ⚠ **This is an advanced option.** Advanced options are passed the same way as basic options,
   * but **may have complex implications** or side effects.
   * You should **try to avoid using advanced options** unless you are very comfortable using them.
   *
   * The default is `false` HTTP and `true` for HTTPS sites.
   */
  useSecureCookies?: boolean;
  /**
   * When set, during an OAuth sign-in flow,
   * the `redirect_uri` of the authorization request
   * will be set based on this value.
   *
   * This is useful if your OAuth Provider only supports a single `redirect_uri`
   * or you want to use OAuth on preview URLs (like Vercel), where you don't know the final deployment URL beforehand.
   *
   * The url needs to include the full path up to where Auth.js is initialized.
   *
   * @note This will auto-enable the `state` {@link OAuth2Config.checks} on the provider.
   *
   * @example
   * ```
   * "https://authjs.example.com/api/auth"
   * ```
   *
   * You can also override this individually for each provider.
   *
   * @example
   * ```ts
   * GitHub({
   *   ...
   *   redirectProxyUrl: "https://github.example.com/api/auth"
   * })
   * ```
   *
   * @default `AUTH_REDIRECT_PROXY_URL` environment variable
   *
   * See also: [Guide: Securing a Preview Deployment](https://authjs.dev/getting-started/deployment#securing-a-preview-deployment)
   */
  redirectProxyUrl?: string;
  /**
   * The base path of the Auth.js API endpoints.
   *
   * @default "/api/auth" in "next-auth"; "/auth" with all other frameworks
   */
  basePath?: string;
}

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

export interface TokenEndpointResponse {
  readonly access_token: string;
  readonly expires_in?: number;
  readonly id_token?: string;
  readonly refresh_token?: string;
  readonly scope?: string;
  readonly authorization_details?: AuthorizationDetails[];
  /**
   * NOTE: because the value is case insensitive it is always returned lowercased
   */
  readonly token_type: "bearer" | "dpop" | Lowercase<string>;

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

// export type OAuthProviders = "github";

interface InternalProviderOptions {
  /** Used to deep merge user-provided config with the default config
   */
  options?: Record<string, unknown>;
}

/**
 * Must be a supported authentication provider config:
 * - {@link OAuthConfig}
 * - {@link EmailConfigInternal}
 * - {@link CredentialsConfigInternal}
 *
 * For more information, see the guides:
 *
 * @see [OAuth/OIDC guide](https://authjs.dev/guides/providers/custom-provider)
 * @see [Email (Passwordless) guide](https://authjs.dev/guides/providers/email)
 * @see [Credentials guide](https://authjs.dev/guides/providers/credentials)
 */
export type Provider<P extends Profile = any> = (
  | ((OIDCConfig<P> | OAuth2Config<P> | EmailConfig) & InternalProviderOptions)
  | ((
      ...args: any
    ) => (OAuth2Config<P> | OIDCConfig<P> | EmailConfig) &
      InternalProviderOptions)
) &
  InternalProviderOptions;
