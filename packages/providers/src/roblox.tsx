import type { OIDCConfig, OIDCUserConfig } from '@sse-auth/types/provider';
import { RobloxDark, RobloxLight } from '@sse-auth/icons';

/**
 * Corresponds to the user structure documented here:
 * https://create.roblox.com/docs/cloud/reference/oauth2 (Example User with Profile Scope)
 */
export interface RobloxProfile extends Record<string, any> {
  /* Roblox user id */
  sub: string;

  /* Roblox display name */
  name: string;

  /* Roblox display name */
  nickname: string;

  /* Roblox username */
  preferred_username: string;

  /* Creation time of the Roblox account as a Unix timestamp. */
  created_at: number;

  /* Roblox account profile URL */
  profile: string;

  /* Roblox avatar headshot image. Can be null if the avatar headshot image hasn't yet been generated or has been moderated */
  picture: string | null;
}

export default function Roblox(options: OIDCUserConfig<RobloxProfile>): OIDCConfig<RobloxProfile> {
  return {
    id: 'roblox',
    name: 'Roblox',
    type: 'oidc',
    authorization: { params: { scope: 'openid profile' } },
    issuer: 'https://apis.roblox.com/oauth/',
    checks: ['pkce', 'state'],
    style: {
      icon: {
        dark: <RobloxDark />,
        light: <RobloxLight />,
      },
    },
    options,
  };
}

export { Roblox };
