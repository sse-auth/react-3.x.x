import type { OAuthConfig, OAuthUserConfig } from '@sse-auth/types/provider';
import { Spotify as SpotifyIcon } from '@sse-auth/icons';

export interface SpotifyImage {
  url: string;
}

export interface SpotifyProfile extends Record<string, any> {
  id: string;
  display_name: string;
  email: string;
  images: SpotifyImage[];
}

export default function Spotify<P extends SpotifyProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: 'spotify',
    name: 'Spotify',
    type: 'oauth',
    authorization: 'https://accounts.spotify.com/authorize?scope=user-read-email',
    token: 'https://accounts.spotify.com/api/token',
    userinfo: 'https://api.spotify.com/v1/me',
    profile(profile) {
      return {
        id: profile.id,
        name: profile.display_name,
        email: profile.email,
        image: profile.images?.[0]?.url,
      };
    },
    style: {
      icon: {
        dark: <SpotifyIcon />,
        light: <SpotifyIcon />,
      },
    },
    options,
  };
}

export { Spotify };
