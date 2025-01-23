import type { AuthConfig } from "@sse-auth/types/config";
import type { AuthAction } from "@sse-auth/types";

/**
 *  Set default env variables on the config object
 * @param suppressWarnings intended for framework authors.
 */
export function setEnvDefaults(
  envObject: any,
  config: AuthConfig,
  suppressBasePathWarning = false
) {
  try {
    const url = envObject.SSE_AUTH_URL;
    if (url) {
      if (config.basePath) {
        // Warn if basePath is set and the URL is different
      } else {
        config.basePath = new URL(url).pathname;
      }
    }
  } catch {
    // Catching and swallowing potential URL parsing errors, we'll fall
    // back to `/auth` below.
  } finally {
    config.basePath ??= "/auth";
  }

  if (!config.secret?.length) {
    config.secret = [];
    const secret = envObject.SSE_AUTH_SECRET;
    if (secret) config.secret.push(secret);
    for (const i of [1, 2, 3]) {
      const secret = envObject[`SSE_AUTH_SECRET_${i}`];
      if (secret) config.secret.unshift(secret);
    }
  }

  config.redirectProxyUrl ??= envObject.SSE_AUTH_REDIRECT_PROXY_URL;

  config.providers = config.providers.map((provider) => {
    const { id } = typeof provider === "function" ? provider({}) : provider;
    const ID = id.toUpperCase().replace(/-/g, "_");
    const clientId = envObject[`SSE_AUTH_${ID}_CLIENT_ID`];
    const clientSecret = envObject[`SSE_AUTH_${ID}_CLIENT_SECRET`];
    const issuer = envObject[`SSE_AUTH_${ID}_ISSUER`];
    const apiKey = envObject[`SSE_AUTH_${ID}_API_KEY`];
    // const domain = envObject[`SSE_AUTH_${ID}_DOMAIN`];
    const finalProvider =
      typeof provider === "function"
        ? provider({ clientId, clientSecret, issuer, apiKey })
        : provider;

    if (finalProvider.type === "oauth" || finalProvider.type === "oidc") {
      finalProvider.clientId ??= clientId;
      finalProvider.clientSecret ??= clientSecret;
      finalProvider.issuer ??= issuer;
    } else if (finalProvider.type === "email") {
      finalProvider.apiKey ??= apiKey;
      // finalProvider.domain ??= domain;
    }
    return finalProvider;
  });
}
