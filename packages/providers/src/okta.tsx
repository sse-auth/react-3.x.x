import type { OAuthConfig, OAuthUserConfig } from '@sse-auth/types/provider';
import { OktaDark, OktaLight } from '@sse-auth/icons';

export interface OktaProfile extends Record<string, any> {
  iss: string;
  ver: string;
  sub: string;
  aud: string;
  iat: string;
  exp: string;
  jti: string;
  auth_time: string;
  amr: string;
  idp: string;
  nonce: string;
  name: string;
  nickname: string;
  preferred_username: string;
  given_name: string;
  middle_name: string;
  family_name: string;
  email: string;
  email_verified: string;
  profile: string;
  zoneinfo: string;
  locale: string;
  address: string;
  phone_number: string;
  picture: string;
  website: string;
  gender: string;
  birthdate: string;
  updated_at: string;
  at_hash: string;
  c_hash: string;
}

export default function Okta<P extends OktaProfile>(options: OAuthUserConfig<P>): OAuthConfig<P> {
  return {
    id: 'okta',
    name: 'Okta',
    type: 'oidc',
    checks: ['pkce', 'state'],
    style: {
      icon: {
        dark: <OktaDark />,
        light: <OktaLight />,
      },
    },
    options,
  };
}

export { Okta };
