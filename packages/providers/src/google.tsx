import type { OAuthConfig, OAuthUserConfig } from '@sse-auth/types/provider';
import { Google as GoogleIcon } from '@sse-auth/icons';

export interface GoogleProfile extends Record<string, any> {
  aud: string;
  azp: string;
  email: string;
  email_verified: boolean;
  exp: number;
  family_name?: string;
  given_name: string;
  hd?: string;
  iat: number;
  iss: string;
  jti?: string;
  locale?: string;
  name: string;
  nbf?: number;
  picture: string;
  sub: string;
}

export default function Google<P extends GoogleProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: 'google',
    name: 'Google',
    type: 'oidc',
    issuer: 'https://accounts.google.com',
    style: {
      icon: {
        dark: <GoogleIcon />,
        light: <GoogleIcon />,
      },
    },
    options,
  };
}

export { Google, GoogleIcon };
