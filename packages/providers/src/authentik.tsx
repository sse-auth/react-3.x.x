import type { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/provider";
import { Authentik as AuthentikIcon } from "@sse-auth/icons";

export interface AuthentikProfile extends Record<string, any> {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  iat: number;
  auth_time: number;
  acr: string;
  c_hash: string;
  nonce: string;
  at_hash: string;
  email: string;
  email_verified: boolean;
  name: string;
  given_name: string;
  family_name: string;
  preferred_username: string;
  nickname: string;
  groups: string[];
}

export default function Authentik<P extends AuthentikProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "authentik",
    name: "Authentik",
    type: "oidc",
    options,
    style: {
      icon: {
        dark: <AuthentikIcon />,
        light: <AuthentikIcon />,
      },
    },
  };
}

export { Authentik, AuthentikIcon };
