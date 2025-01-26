import { defaultCookies } from "./cookie.js";
import {
  AuthError,
  DuplicateConditionalUI,
  ExperimentalFeatureNotEnabled,
  InvalidCallbackUrl,
  InvalidEndpoints,
  MissingAdapter,
  MissingAdapterMethods,
  MissingAuthorize,
  MissingSecret,
  MissingWebAuthnAutocomplete,
  UnsupportedStrategy,
  UntrustedHost,
} from "@sse-auth/types/error";
import type { SemverString } from "@sse-auth/types";
import { Adapter } from "@sse-auth/types/adapter";
import { AuthConfig, RequestInternal } from "@sse-auth/types/config";

export type WarningCode =
  | "debug-enabled"
  | "csrf-disabled"
  | "experimental-webauthn"
  | "env-url-basepath-redundant"
  | "env-url-basepath-mismatch";

type ConfigError =
  | InvalidCallbackUrl
  | InvalidEndpoints
  | MissingAdapter
  | MissingAdapterMethods
  | MissingAuthorize
  | MissingSecret
  | UnsupportedStrategy;

let warned = false;

function isValidHttpUrl(url: string, baseUrl: string) {
  try {
    return /^https?:/.test(
      new URL(url, url.startsWith("/") ? baseUrl : undefined).protocol
    );
  } catch {
    return false;
  }
}

function isSemverString(version: string): version is SemverString {
  return /^v\d+(?:\.\d+){0,2}$/.test(version);
}

let hasCredentials = false;
let hasEmail = false;

const emailMethods: (keyof Adapter)[] = [
  "createVerificationToken",
  "useVerificationToken",
  "getUserByEmail",
];

const sessionMethods: (keyof Adapter)[] = [
  "createUser",
  "getUser",
  "getUserByEmail",
  "getUserByAccount",
  "updateUser",
  "linkAccount",
  "createSession",
  "getSessionAndUser",
  "updateSession",
  "deleteSession",
];

const webauthnMethods: (keyof Adapter)[] = [
  "createUser",
  "getUser",
  "linkAccount",
  "getAccount",
  "getAuthenticator",
  "createAuthenticator",
  "listAuthenticatorsByUserId",
  "updateAuthenticatorCounter",
];

/**
 * Verify that the user configured Auth.js correctly.
 * Good place to mention deprecations as well.
 *
 * This is invoked before the init method, so default values are not available yet.
 */
export function assertConfig(
  request: RequestInternal,
  options: AuthConfig
): ConfigError | WarningCode[] {
  const { url } = request;

  const warnings: WarningCode[] = [];

  if (!warned && options.debug) warnings.push("debug-enabled");

  if (!options.trustHost) {
    return new UntrustedHost(`Host must be trusted. URL was: ${request.url}`);
  }

  if (!options.secret?.length) {
    return new MissingSecret("Please define a `secret`");
  }

  const callbackUrlParam = request.query?.callbackUrl as string | undefined;

  if (callbackUrlParam && !isValidHttpUrl(callbackUrlParam, url.origin)) {
    return new InvalidCallbackUrl(
      `Invalid callback URL. Received: ${callbackUrlParam}`
    );
  }

  const { callbackUrl: defaultCallbackUrl } = defaultCookies(
    options.useSecureCookies ?? url.protocol === "https:"
  );
  const callbackUrlCookie =
    request.cookies?.[
      options.cookies?.callbackUrl?.name ?? defaultCallbackUrl.name
    ];

  if (callbackUrlCookie && !isValidHttpUrl(callbackUrlCookie, url.origin)) {
    return new InvalidCallbackUrl(
      `Invalid callback URL. Received: ${callbackUrlCookie}`
    );
  }

  // Keep track of webauthn providers that use conditional UI
  let hasConditionalUIProvider = false;

  for (const p of options.providers) {
    const provider = typeof p === "function" ? p() : p;
    if (
      (provider.type === "oauth" || provider.type === "oidc") &&
      !(provider.issuer ?? provider.options?.issuer)
    ) {
      const { authorization: a, token: t, userinfo: u } = provider;

      let key;
      if (typeof a !== "string" && !a?.url) key = "authorization";
      else if (typeof t !== "string" && !t?.url) key = "token";
      else if (typeof u !== "string" && !u?.url) key = "userinfo";

      if (key) {
        return new InvalidEndpoints(
          `Provider "${provider.id}" is missing both \`issuer\` and \`${key}\` endpoint config. At least one of them is required`
        );
      }
    }

    if (provider.type === "credentials") hasCredentials = true;
    else if (provider.type === "email") hasEmail = true;
  }

  if (hasCredentials) {
    const dbStrategy = options.session?.strategy === "database";
    const onlyCredentials = !options.providers.some(
      (p) => (typeof p === "function" ? p() : p).type !== "credentials"
    );
    if (dbStrategy && onlyCredentials) {
      return new UnsupportedStrategy(
        "Signing in with credentials only supported if JWT strategy is enabled"
      );
    }

    const credentialsNoAuthorize = options.providers.some((p) => {
      const provider = typeof p === "function" ? p() : p;
      return provider.type === "credentials" && !provider.authorize;
    });
    if (credentialsNoAuthorize) {
      return new MissingAuthorize(
        "Must define an authorize() handler to use credentials authentication provider"
      );
    }
  }

  const { adapter, session } = options;

  const requiredMethods: (keyof Adapter)[] = [];

  if (
    hasEmail ||
    session?.strategy === "database" ||
    (!session?.strategy && adapter)
  ) {
    if (hasEmail) {
      if (!adapter)
        return new MissingAdapter("Email login requires an adapter");
      requiredMethods.push(...emailMethods);
    } else {
      if (!adapter)
        return new MissingAdapter("Database session requires an adapter");
      requiredMethods.push(...sessionMethods);
    }
  }

  if (adapter) {
    const missing = requiredMethods.filter((m) => !(m in adapter));

    if (missing.length) {
      return new MissingAdapterMethods(
        `Required adapter methods were missing: ${missing.join(", ")}`
      );
    }
  }

  if (!warned) warned = true;

  return warnings;
}
