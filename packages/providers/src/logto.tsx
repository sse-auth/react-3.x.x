import { OIDCConfig, OIDCUserConfig } from '@sse-auth/types/provider';
import { LogtoDark, LogtoLight } from '@sse-auth/icons';

/** The returned user profile from Logto when using the profile callback. [Reference](https://docs.logto.io/quick-starts/next-auth#scopes-and-claims). */
export interface LogtoProfile {
  /** The user's unique ID */
  sub: string;
  /** The user's name */
  name: string;
  /** The user's username */
  username: string;
  /** The user's picture */
  picture: string;
  /** The user's email */
  email: string;
  /** A boolean indicating if the user's email is verified */
  email_verified: boolean;
  /** The user's phone number */
  phone_number: string;
  /** A boolean indicating if the user's phone number is verified */
  phone_number_verified: boolean;
  /** The user's address */
  address: string;
  /** Custom fields */
  custom_data: object;
  /** The linked identities of the user */
  identities: object;
  /** The linked SSO identities of the user */
  sso_identities: object[];
  /** The organization IDs the user belongs to */
  organizations: string[];
  /** The organization data the user belongs to */
  organization_data: object[];
  /** The organization roles the user belongs to with the format of organization_id:/role_name */
  organization_roles: string[];
  /** The user's custom attributes */
  [claim: string]: unknown;
}

export default function Logto(options: OIDCUserConfig<LogtoProfile>): OIDCConfig<LogtoProfile> {
  return {
    id: 'logto',
    name: 'Logto',
    type: 'oidc',
    authorization: {
      params: {
        scope: 'offline_access openid email profile',
      },
    },
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name ?? profile.username,
        email: profile.email,
        image: profile.picture,
      };
    },
    options,
    style: {
      icon: {
        dark: <LogtoDark />,
        light: <LogtoLight />,
      },
    },
  };
}

export { Logto };
