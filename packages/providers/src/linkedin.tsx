import type { OIDCConfig, OIDCUserConfig } from '@sse-auth/types/provider';
import { Linkedin as LinkedinIcon } from '@sse-auth/icons';

/** @see https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin-v2#response-body-schema */
export interface LinkedInProfile extends Record<string, any> {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
  email: string;
  email_verified: boolean;
}

export default function LinkedIn<P extends LinkedInProfile>(
  options: OIDCUserConfig<P>
): OIDCConfig<P> {
  return {
    id: 'linkedin',
    name: 'LinkedIn',
    type: 'oidc',
    client: { token_endpoint_auth_method: 'client_secret_post' },
    issuer: 'https://www.linkedin.com/oauth',
    checks: ['state'],
    style: {
      icon: {
        dark: <LinkedinIcon />,
        light: <LinkedinIcon />,
      },
    },
    options,
  };
}

export { LinkedIn };
