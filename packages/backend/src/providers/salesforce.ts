import type { OIDCConfig, OIDCUserConfig } from "@sse-auth/types/provider";

export interface SalesforceProfile extends Record<string, any> {
  sub: string;
  nickname: string;
  email: string;
  picture: string;
}

export default function Salesforce(
  options: OIDCUserConfig<SalesforceProfile>
): OIDCConfig<SalesforceProfile> {
  return {
    id: "salesforce",
    name: "Salesforce",
    type: "oidc",
    issuer: "https://login.salesforce.com",
    idToken: false,
    checks: ["pkce", "state", "nonce"],
    // style: { bg: "#00a1e0" },
    options,
  };
}

export { Salesforce }
