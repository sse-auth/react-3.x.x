import type { OAuthConfig, OAuthUserConfig } from '@sse-auth/types/provider';
import { Dropbox as DropboxIcon } from '@sse-auth/icons';

export default function Dropbox(
  options: OAuthUserConfig<Record<string, any>>
): OAuthConfig<Record<string, any>> {
  return {
    id: 'dropbox',
    name: 'Dropbox',
    type: 'oauth',
    authorization: {
      url: 'https://www.dropbox.com/oauth2/authorize',
      params: {
        token_access_type: 'offline',
        scope: 'account_info.read',
      },
    },
    token: 'https://api.dropboxapi.com/oauth2/token',
    userinfo: {
      url: 'https://api.dropboxapi.com/2/users/get_current_account',
      async request({ tokens, provider }) {
        return await fetch(provider.userinfo?.url as URL, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        }).then(async (res) => await res.json());
      },
    },
    profile(profile) {
      return {
        id: profile.account_id,
        name: profile.name.display_name,
        email: profile.email,
        image: profile.profile_photo_url,
      };
    },
    style: {
      icon: {
        dark: <DropboxIcon />,
        light: <DropboxIcon />,
      },
    },
    options,
  };
}

export { Dropbox, DropboxIcon };
