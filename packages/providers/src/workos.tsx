import type { OAuthConfig, OAuthUserConfig } from '@sse-auth/types/provider';
import { WorkOS as WorkOSIcon } from '@sse-auth/icons';

/**
 * - {@link https://workos.com/docs/reference/sso/profile | The returned profile object}
 */
export interface WorkOSProfile extends Record<string, any> {
  object: string;
  id: string;
  organization_id: string;
  connection_id: string;
  connection_type: string;
  idp_id: string;
  email: string;
  first_name: string;
  last_name: string;
  raw_attributes: {
    id: string;
    email: string;
    lastName: string;
    firstName: string;
    picture: string;
  };
}

export default function WorkOS<P extends WorkOSProfile>(
  options: OAuthUserConfig<P> & { connection?: string }
): OAuthConfig<P> {
  const { issuer = 'https://api.workos.com/', connection = '' } = options;

  const connectionParams = new URLSearchParams({ connection });

  return {
    id: 'workos',
    name: 'WorkOS',
    type: 'oauth',
    authorization: `${issuer}sso/authorize?${connectionParams}`,
    token: `${issuer}sso/token`,
    client: {
      token_endpoint_auth_method: 'client_secret_post',
    },
    userinfo: `${issuer}sso/profile`,
    profile(profile) {
      return {
        id: profile.id,
        name: `${profile.first_name} ${profile.last_name}`,
        email: profile.email,
        image: profile.raw_attributes.picture ?? null,
      };
    },
    style: {
      icon: {
        dark: <WorkOSIcon />,
        light: <WorkOSIcon />,
      },
    },
    options,
  };
}

export { WorkOS };
