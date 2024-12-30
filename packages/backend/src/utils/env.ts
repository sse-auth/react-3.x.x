import { AuthConfig } from "../types";

export function setEnvDefaults(envObject: any, config: AuthConfig) {
  config.providers = config.providers.map((provider) => {
    const { id } = typeof provider === "function" ? provider({}) : provider;
    const ID = id.toUpperCase().replace(/-/g, "_");
    const clientId = envObject[`SSE_AUTH_${ID}_ID`];
    const clientSecret = envObject[`SSE_AUTH_${ID}_SECRET`];
    const issuer = envObject[`SSE_AUTH_${ID}_ISSUER`];
    const apiKey = envObject[`SSE_AUTH_${ID}_KEY`];
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
    }
    return finalProvider;
  });
}
