import type { OAuthConfig, OAuthUserConfig } from '@sse-auth/types/provider';
import { Onelogin as OneLoginIcon } from '@sse-auth/icons';

export default function OneLogin(
  config: OAuthUserConfig<Record<string, any>>
): OAuthConfig<Record<string, any>> {
  return {
    id: 'onelogin',
    name: 'OneLogin',
    type: 'oidc',
    wellKnown: `${config.issuer}/oidc/2/.well-known/openid-configuration`,
    style: {
      icon: {
        dark: <OneLoginIcon />,
        light: <OneLoginIcon />,
      },
    },
    options: config,
  };
}

export { OneLogin };
