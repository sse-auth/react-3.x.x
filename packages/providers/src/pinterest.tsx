import type { OAuthConfig, OAuthUserConfig } from '@sse-auth/types/provider';
import { Pinterest as PinterestIcon } from '@sse-auth/icons';

export interface PinterestProfile extends Record<string, any> {
  account_type: 'BUSINESS' | 'PINNER';
  profile_image: string;
  website_url: string;
  username: string;
}

export default function PinterestProvider<P extends PinterestProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: 'pinterest',
    name: 'Pinterest',
    type: 'oauth',
    authorization: {
      url: 'https://www.pinterest.com/oauth',
      params: { scope: 'user_accounts:read' },
    },
    token: 'https://api.pinterest.com/v5/oauth/token',
    userinfo: 'https://api.pinterest.com/v5/user_account',
    profile({ username, profile_image }) {
      return {
        id: username,
        name: username,
        image: profile_image,
        email: null,
      };
    },
    style: {
      icon: {
        dark: <PinterestIcon />,
        light: <PinterestIcon />,
      },
    },
    options,
  };
}

export { PinterestProvider };
