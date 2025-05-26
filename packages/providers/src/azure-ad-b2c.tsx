import type { OIDCConfig, OIDCUserConfig } from '@sse-auth/types/provider';
import { Azure as AzureIcon } from '@sse-auth/icons';

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

export default function AzureADB2C(
  options: OIDCUserConfig<AzureADB2CProfile>
): OIDCConfig<AzureADB2CProfile> {
  return {
    id: 'azure-ad-b2c',
    name: 'Azure AD B2C',
    type: 'oidc',
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
      icon: {
        dark: <AzureIcon />,
        light: <AzureIcon />,
      },
    },
  };
}

export { AzureADB2C, AzureIcon };
