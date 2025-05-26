import type { OIDCConfig, OIDCUserConfig } from '@sse-auth/types/provider';
import { Kinde as KindeIcon } from '@sse-auth/icons';

/** The returned user profile from Kinde when using the profile callback. [Reference](https://kinde.com/api/docs/#get-user-profile). */
export interface KindeProfile extends Record<string, any> {
  /** The user's given name. */
  first_name: string;
  /** The user's unique identifier. */
  id: string;
  /** The user's family name. */
  last_name: string;
  /** URL pointing to the user's profile picture. */
  picture: string;
  /** The user's email address. */
  preferred_email: string;
  /** The user's identifier from a previous system. */
  provided_id: string;
  /** The user's username. */
  username: string;
}

export default function Kinde(config: OIDCUserConfig<KindeProfile>): OIDCConfig<KindeProfile> {
  return {
    id: 'kinde',
    name: 'Kinde',
    type: 'oidc',
    style: {
      icon: {
        dark: <KindeIcon />,
        light: <KindeIcon />,
      },
    },
    options: config,
    checks: ['state', 'pkce'],
  };
}

export { Kinde };
