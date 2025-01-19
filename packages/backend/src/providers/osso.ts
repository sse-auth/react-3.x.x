import type { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/oauth";

export default function Osso(
  config: OAuthUserConfig<Record<string, any>>
): OAuthConfig<Record<string, any>> {
  return {
    id: "osso",
    name: "Osso",
    type: "oauth",
    authorization: `${config.issuer}oauth/authorize`,
    token: `${config.issuer}oauth/token`,
    userinfo: `${config.issuer}oauth/me`,
    options: config,
  };
}

export { Osso }
