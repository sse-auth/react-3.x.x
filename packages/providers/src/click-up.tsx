import type { OAuthConfig, OAuthUserConfig } from '@sse-auth/types/provider';
import { ClickupDarkWatermark, ClickupLightWatermark } from '@sse-auth/icons';

/** @see [Get the authenticated user](https://clickup.com/api/clickupreference/operation/GetAuthorizedUser/)*/
export interface ClickUpProfile {
  user: {
    id: number;
    username: string;
    color: string;
    profilePicture: string;
  };
}

export default function ClickUp(
  config: OAuthUserConfig<ClickUpProfile>
): OAuthConfig<ClickUpProfile> {
  return {
    id: 'click-up',
    name: 'ClickUp',
    type: 'oauth',
    authorization: 'https://app.clickup.com/api',
    token: 'https://api.clickup.com/api/v2/oauth/token',
    userinfo: 'https://api.clickup.com/api/v2/user',
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    checks: ['state'],
    profile: (profile: ClickUpProfile) => {
      return {
        id: profile.user.id.toString(),
        name: profile.user.username,
        profilePicture: profile.user.profilePicture,
        color: profile.user.color,
      };
    },
    options: config,
    style: {
      icon: {
        dark: <ClickupDarkWatermark />,
        light: <ClickupLightWatermark />,
      },
    },
  };
}

export { ClickUp };
