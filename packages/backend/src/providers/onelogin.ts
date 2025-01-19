import type { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/oauth";

export default function OneLogin(
  config: OAuthUserConfig<Record<string, any>>
): OAuthConfig<Record<string, any>> {
  return {
    id: "onelogin",
    name: "OneLogin",
    type: "oidc",
    wellKnown: `${config.issuer}/oidc/2/.well-known/openid-configuration`,
    options: config,
  };
}

export { OneLogin }
