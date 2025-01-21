import { Cookie, SerializeOptions } from "./cookie";
import type { TokenEndpointResponse, AuthorizationDetails } from "oauth4webapi";
import { ProviderType } from "./provider";

export type { AuthorizationDetails };

export type Awaitable<T> = T | PromiseLike<T>;
export type Awaited<T> = T extends Promise<infer U> ? U : T;

export type SemverString =
  | `v${number}`
  | `v${number}.${number}`
  | `v${number}.${number}.${number}`;

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

export interface Theme {
  colorScheme?: "auto" | "dark" | "light";
  logo?: string;
  brandColor?: string;
  buttonText?: string;
}

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

/** @internal */
export interface RequestInternal {
  url: URL;
  method: "GET" | "POST";
  cookies?: Partial<Record<string, string>>;
  headers?: Record<string, any>;
  query?: Record<string, any>;
  body?: Record<string, any>;
  action: AuthAction;
  providerId?: string;
  error?: string;
}

// Should only be used by frameworks
export interface ResponseInternal<
  Body extends string | Record<string, any> | any[] | null = any
> {
  status?: number;
  headers?: Headers | HeadersInit;
  body?: Body;
  redirect?: string;
  cookies?: Cookie[];
}

/**
 * Supported actions by Auth.js. Each action map to a REST API endpoint.
 * Some actions have a `GET` and `POST` variant, depending on if the action
 * changes the state of the server.
 *
 * - **`"callback"`**:
 *   - **`GET`**: Handles the callback from an [OAuth provider](https://authjs.dev/reference/core/providers#oauth2configprofile).
 *   - **`POST`**: Handles the callback from a [Credentials provider](https://authjs.dev/getting-started/providers/credentials#credentialsconfigcredentialsinputs).
 * - **`"csrf"`**: Returns the raw CSRF token, which is saved in a cookie (encrypted).
 * It is used for CSRF protection, implementing the [double submit cookie](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#double-submit-cookie) technique.
 * :::note
 * Some frameworks have built-in CSRF protection and can therefore disable this action. In this case, the corresponding endpoint will return a 404 response. Read more at [`skipCSRFCheck`](https://authjs.dev/reference/core#skipcsrfcheck).
 * _⚠ We don't recommend manually disabling CSRF protection, unless you know what you're doing._
 * :::
 * - **`"error"`**: Renders the built-in error page.
 * - **`"providers"`**: Returns a client-safe list of all configured providers.
 * - **`"session"`**:
 *   - **`GET`**: Returns the user's session if it exists, otherwise `null`.
 *   - **`POST`**: Updates the user's session and returns the updated session.
 * - **`"signin"`**:
 *   - **`GET`**: Renders the built-in sign-in page.
 *   - **`POST`**: Initiates the sign-in flow.
 * - **`"signout"`**:
 *   - **`GET`**: Renders the built-in sign-out page.
 *   - **`POST`**: Initiates the sign-out flow. This will invalidate the user's session (deleting the cookie, and if there is a session in the database, it will be deleted as well).
 * - **`"verify-request"`**: Renders the built-in verification request page.
 * - **`"webauthn-options"`**:
 *   - **`GET`**: Returns the options for the WebAuthn authentication and registration flows.
 */
export type AuthAction =
  | "callback"
  | "csrf"
  | "error"
  | "providers"
  | "session"
  | "signin"
  | "signout"
  | "verify-request";
