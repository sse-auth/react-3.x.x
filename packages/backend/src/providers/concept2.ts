import type { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/provider";

export interface Concept2Profile extends Record<string, any> {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  gender: string;
  dob: string;
  email: string;
  country: string;
  profile_image: string;
  age_restricted: boolean;
  email_permission: boolean | null;
  max_heart_rate: number | null;
  weight: number | null;
  logbook_privacy: string | null;
}

export default function Concept2(
  options: OAuthUserConfig<Concept2Profile>
): OAuthConfig<Concept2Profile> {
  return {
    id: "concept2",
    name: "Concept2",
    type: "oauth",
    authorization: {
      url: "https://log.concept2.com/oauth/authorize",
      params: {
        scope: "user:read,results:write",
      },
    },
    token: "https://log.concept2.com/oauth/access_token",
    userinfo: "https://log.concept2.com/api/users/me",
    profile(profile) {
      return {
        id: profile.data.id,
        name: profile.data.username,
        email: profile.data.email,
        image: profile.data.profile_image,
      };
    },
    options,
  };
}

export { Concept2 }
