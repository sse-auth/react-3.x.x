import type { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/provider";
import { IdentityServer4 as IdentityServer4Icon } from "@sse-auth/icons";

export default function IdentityServer4(
  options: OAuthUserConfig<Record<string, any>>
): OAuthConfig<Record<string, any>> {
  return {
    id: "identity-server4",
    name: "IdentityServer4",
    type: "oidc",
    style: {
      icon: {
        dark: <IdentityServer4Icon />,
        light: <IdentityServer4Icon />,
      },
    },
    options,
  };
}

export { IdentityServer4 };
