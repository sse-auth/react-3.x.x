import type { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/oauth";

export interface LineProfile extends Record<string, any> {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  iat: number;
  amr: string[];
  name: string;
  picture: string;
  user: any;
}

export default function LINE<P extends LineProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "line",
    name: "LINE",
    type: "oidc",
    issuer: "https://access.line.me",
    client: {
      id_token_signed_response_alg: "HS256",
    },
    // style: { bg: "#00C300", text: "#fff" },
    options,
  };
}

export { LINE }