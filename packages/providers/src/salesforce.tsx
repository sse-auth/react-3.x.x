import type { OIDCConfig, OIDCUserConfig } from "@sse-auth/types/provider";
import { Salesforce as SalesforceIcon } from "@sse-auth/icons";

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
    style: {
      icon: {
        dark: <SalesforceIcon />,
        light: <SalesforceIcon />,
      },
    },
    options,
  };
}

export { Salesforce };
