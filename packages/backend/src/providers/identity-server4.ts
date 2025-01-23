import type { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/provider";

export default function IdentityServer4(
  options: OAuthUserConfig<Record<string, any>>
): OAuthConfig<Record<string, any>> {
  return {
    id: "identity-server4",
    name: "IdentityServer4",
    type: "oidc",
    options,
  };
}

export { IdentityServer4 }