import type { OAuthConfig, OAuthUserConfig } from '@sse-auth/types/provider';
import { Instagram as InstagramIcon } from '@sse-auth/icons';

export default function Instagram(
  config: OAuthUserConfig<Record<string, any>>
): OAuthConfig<Record<string, any>> {
  return {
    id: 'instagram',
    name: 'Instagram',
    type: 'oauth',
    authorization: 'https://api.instagram.com/oauth/authorize?scope=user_profile',
    token: 'https://api.instagram.com/oauth/access_token',
    userinfo: 'https://graph.instagram.com/me?fields=id,username,account_type,name',
    client: {
      token_endpoint_auth_method: 'client_secret_post',
    },
    async profile(profile) {
      return {
        id: profile.id,
        name: profile.username,
        email: null,
        image: null,
      };
    },
    options: config,
    style: {
      icon: {
        dark: <InstagramIcon />,
        light: <InstagramIcon />,
      },
    },
  };
}

export { Instagram, InstagramIcon };
