import type { OAuthConfig, OAuthUserConfig } from '@sse-auth/types/provider';
import { MediumDark, MediumLight } from '@sse-auth/icons';

export default function Medium(
  config: OAuthUserConfig<Record<string, any>>
): OAuthConfig<Record<string, any>> {
  return {
    id: 'medium',
    name: 'Medium',
    type: 'oauth',
    authorization: 'https://medium.com/m/oauth/authorize?scope=basicProfile',
    token: 'https://api.medium.com/v1/tokens',
    userinfo: 'https://api.medium.com/v1/me',
    profile(profile) {
      return {
        id: profile.data.id,
        name: profile.data.name,
        email: null,
        image: profile.data.imageUrl,
      };
    },
    style: {
      icon: {
        dark: <MediumDark />,
        light: <MediumLight />,
      },
    },
    options: config,
  };
}

export { Medium };
