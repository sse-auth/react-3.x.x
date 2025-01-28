/**
 * Base parameters.
 *
 * OTP parameters:
 * - `digits=6`: The number of digits for the one-time password. Used when
 *   generating one-time passwords.
 *
 * Secret parameters:
 *
 * - `secret`: Required. The shared secret as a Buffer or string. Used when
 *   generating and validating one-time passwords.
 * - `encoding=ascii`: The string encoding for the string secret. Used if
 *   the shared secret is a string. Ignored if shared secret is a buffer.
 *
 * Cryptographic parameters:
 * - `algorithm=sha1`: The hash algorithm. Used when generating one-time
 *   passwords. For maximum compatibility, use the default of `sha1`.
 *
 * Provider parameters:
 * - `label`: The label to display in client apps, e.g. email address. Used
 *   when generating Google Authenticator compatible URLs.
 * - `issuer`: The issuer to display in client apps, e.g. website name. Used
 *   when generating Google Authenticator compatible URLs.
 */
export interface BaseParams {
  secret: Buffer | string;
  encoding?: "ascii" | "hex" | "base32" | "base64" | string;
  digits?: number;
  window?: number;
  algorithm?: "sha1" | "sha256" | "sha512" | string;
  label?: string;
  issuer?: string;
}

/**
 * HOTP parameters.
 *
 * HOTP parameters:
 * - `window=1`: The validation window. Used when validating hash-based
 *   one-time passwords. A one-time password is valid if it represents a
 *   counter value within `[counter, counter + window)`, where
 *   `[counter` is the inclusive minimum value accepted and
 *   `counter + window)` is the exclusive maximum value accepted.
 */
export interface HOTPParams extends BaseParams {
  counter: number;
}

/**
 * TOTP parameters.
 *
 * TOTP parameters:
 * - `window=1`: The validation window. Used when validating time-based
 *   one-time passwords. A one-time password is valid if it represents a
 *   time step value within `[counter - window, counter + window)`, where
 *   `[counter - window` is the inclusive minimum server value accepted and
 *   `counter + window)` is the exclusive maximum server value accepted.
 * - `time=() => Date.now()/1000`: A function returning the current number
 *   of seconds since the UNIX epoch.
 * - `epoch=0`: The time offset in seconds since the UNIX epoch to use.
 * - `period=30`: The time period. Used to divide the current time into
 *   time steps.
 */
export interface TOTPParams extends BaseParams {
  time?: Date | number | (() => Date | number);
  epoch?: number;
  period?: number;
}

// Algorithm for createHmac
export type Algorithm =
  | "rmd160"
  | "ripemd160"
  | "md5"
  | "sha"
  | "sha1"
  | "sha224"
  | "sha256"
  | "sha384"
  | "sha512";

export interface ParsedUrlQuery extends NodeJS.Dict<string | string[]> {}
export interface ParsedUrlQueryInput
  extends NodeJS.Dict<
    | string
    | number
    | boolean
    | readonly string[]
    | readonly number[]
    | readonly boolean[]
    | null
  > {}

// Input to `url.format`
export interface UrlObject {
  auth?: string | null | undefined;
  hash?: string | null | undefined;
  host?: string | null | undefined;
  hostname?: string | null | undefined;
  href?: string | null | undefined;
  pathname?: string | null | undefined;
  protocol?: string | null | undefined;
  search?: string | null | undefined;
  slashes?: boolean | null | undefined;
  port?: string | number | null | undefined;
  query?: string | null | ParsedUrlQueryInput | undefined;
}

// Output of `url.parse`
export interface Url {
  auth: string | null;
  hash: string | null;
  host: string | null;
  hostname: string | null;
  href: string;
  path: string | null;
  pathname: string | null;
  protocol: string | null;
  search: string | null;
  slashes: boolean | null;
  port: string | null;
  query: string | null | ParsedUrlQuery;
}
// interface UrlWithParsedQuery extends Url {
//   query: ParsedUrlQuery;
// }
// interface UrlWithStringQuery extends Url {
//   query: string | null;
// }
// interface FileUrlToPathOptions {
//   /**
//    * `true` if the `path` should be return as a windows filepath, `false` for posix, and `undefined` for the system default.
//    * @default undefined
//    * @since v22.1.0
//    */
//   windows?: boolean | undefined;
// }
// interface PathToFileUrlOptions {
//   /**
//    * `true` if the `path` should be return as a windows filepath, `false` for posix, and `undefined` for the system default.
//    * @default undefined
//    * @since v22.1.0
//    */
//   windows?: boolean | undefined;
// }
