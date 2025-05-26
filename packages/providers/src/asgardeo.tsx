import type { OIDCConfig, OIDCUserConfig } from '@sse-auth/types/provider';
import { Asgardeo as AsgardeoIcon } from '@sse-auth/icons';

/** The returned user profile from Asgardeo when using the profile callback. */
export interface AsgardeoProfile extends Record<string, any> {
  /**
   * The user Asgardeo account ID
   */
  sub: string;
  /**
   * The user name
   */
  given_name: string;
  /**
   * The user email
   */
  email: string;
  /**
   * The user profile picture
   */
  picture: string;
}

export default function Asgardeo(
  config: OIDCUserConfig<AsgardeoProfile>
): OIDCConfig<AsgardeoProfile> {
  return {
    id: 'asgardeo',
    name: 'Asgardeo',
    type: 'oidc',
    wellKnown: `${config?.issuer}/oauth2/token/.well-known/openid-configuration`,
    options: config,
    style: {
      icon: {
        dark: <AsgardeoIcon />,
        light: <AsgardeoIcon />,
      },
    },
  };
}

export { Asgardeo, AsgardeoIcon };
