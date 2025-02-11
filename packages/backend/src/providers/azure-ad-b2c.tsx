import type { OIDCConfig, OIDCUserConfig } from "@sse-auth/types/provider";

export interface AzureADB2CProfile {
  exp: number;
  nbf: number;
  ver: string;
  iss: string;
  sub: string;
  aud: string;
  iat: number;
  auth_time: number;
  oid: string;
  country: string;
  name: string;
  postalCode: string;
  emails: string[];
  tfp: string;
  preferred_username: string;
}

const AzureIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 59.2 47.3"
    className="-ml-1 size-3.5"
  >
    <path
      fill="#0072c6"
      d="M32.4 0 14.9 15.1 0 42h13.4zm2.3 3.5-7.5 21 14.3 18-27.7 4.8h45.4z"
    />
  </svg>
);

export default function AzureADB2C(
  options: OIDCUserConfig<AzureADB2CProfile>
): OIDCConfig<AzureADB2CProfile> {
  return {
    id: "azure-ad-b2c",
    name: "Azure AD B2C",
    type: "oidc",
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name ?? profile.preferred_username,
        email: profile?.emails?.[0],
        image: null,
      };
    },
    options,
    style: {
      icon: <AzureIcon />,
    },
  };
}

export { AzureADB2C, AzureIcon };
