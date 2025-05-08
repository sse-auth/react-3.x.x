import type { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/provider";

export interface SimpleLoginProfile {
  id: number;
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  avatar_url: string | undefined;
  client: string;
}

export default function SimpleLogin<P extends SimpleLoginProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "simplelogin",
    name: "SimpleLogin",
    type: "oidc",
    issuer: "https://app.simplelogin.io",
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.avatar_url,
      };
    },
    // style: { brandColor: "#e3156a" },
    options,
  };
}

export { SimpleLogin }
