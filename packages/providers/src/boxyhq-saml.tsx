import type { OAuthConfig, OAuthUserConfig } from '@sse-auth/types/provider';
import { BoxyhqSaml as BoxyHQIcon } from '@sse-auth/icons';

export interface BoxyHQSAMLProfile extends Record<string, any> {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export default function SAMLJackson<P extends BoxyHQSAMLProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: 'boxyhq-saml',
    name: 'BoxyHQ SAML',
    type: 'oauth',
    authorization: {
      url: `${options.issuer}/api/oauth/authorize`,
      params: { provider: 'saml' },
    },
    token: `${options.issuer}/api/oauth/token`,
    userinfo: `${options.issuer}/api/oauth/userinfo`,
    profile(profile) {
      return {
        id: profile.id,
        email: profile.email,
        name: [profile.firstName, profile.lastName].filter(Boolean).join(' '),
        image: null,
      };
    },
    options,
    style: {
      icon: {
        dark: <BoxyHQIcon />,
        light: <BoxyHQIcon />,
      },
    },
  };
}

export { SAMLJackson, BoxyHQIcon };
