import type { OIDCConfig, OIDCUserConfig } from "@sse-auth/types/oauth";

export interface PingProfile extends Record<string, any> {
  iss: string;
  sub: string;
  aud: string;
  iat: number;
  exp: number;
  acr: string;
  amr: [string];
  auth_time: number;
  at_hash: string;
  sid: string;
  preferred_username: string;
  given_name: string;
  picture: string;
  updated_at: number;
  name: string;
  family_name: string;
  email: string;
  env: string;
  org: string;
  "p1.region": string;
}

export default function PingId(
  options: OIDCUserConfig<PingProfile>
): OIDCConfig<PingProfile> {
  return {
    id: "ping-id",
    name: "Ping Identity",
    type: "oidc",
    options,
  };
}

export { PingId }
