import type { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/oauth";

export interface DuendeISUser extends Record<string, any> {
  email: string;
  id: string;
  name: string;
  verified: boolean;
}

export default function DuendeIdentityServer6<P extends DuendeISUser>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "duende-identity-server6",
    name: "DuendeIdentityServer6",
    type: "oidc",
    options,
  };
}

export { DuendeIdentityServer6 }