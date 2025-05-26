import type { OAuthConfig, OAuthUserConfig } from '@sse-auth/types/provider';
import { Cognito as CognitoIcon } from '@sse-auth/icons';

export interface CognitoProfile extends Record<string, any> {
  sub: string;
  name: string;
  email: string;
  picture: string;
}

export default function Cognito<P extends CognitoProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: 'cognito',
    name: 'Cognito',
    type: 'oidc',
    options,
    style: {
      icon: {
        dark: <CognitoIcon />,
        light: <CognitoIcon />,
      },
    },
  };
}

export { Cognito, CognitoIcon };
