import type { OAuthConfig, OAuthUserConfig } from '@sse-auth/types/provider';
import { UnitedEffects as UnitedEffectsIcon } from '@sse-auth/icons';

export interface UnitedEffectsProfile extends Record<string, any> {
  sub: string;
  email: string;
}

export default function UnitedEffects<P extends UnitedEffectsProfile>(
  options: OAuthUserConfig<P> & { issuer: string }
): OAuthConfig<P> {
  return {
    id: 'united-effects',
    name: 'United Effects',
    type: 'oidc',
    authorization: {
      params: { scope: 'openid email profile', resource: options.issuer },
    },
    style: {
      icon: {
        dark: <UnitedEffectsIcon />,
        light: <UnitedEffectsIcon />,
      },
    },
    options,
  };
}

export { UnitedEffects };
