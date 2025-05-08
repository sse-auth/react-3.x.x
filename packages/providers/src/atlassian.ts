import type { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/provider";

/** The returned user profile from Atlassian when using the profile callback. */
export interface AtlassianProfile extends Record<string, any> {
  /**
   * The user's atlassian account ID
   */
  account_id: string;
  /**
   * The user name
   */
  name: string;
  /**
   * The user's email
   */
  email: string;
  /**
   * The user's profile picture
   */
  picture: string;
}

export default function Atlassian(
  options: OAuthUserConfig<AtlassianProfile>
): OAuthConfig<AtlassianProfile> {
  return {
    id: "atlassian",
    name: "Atlassian",
    type: "oauth",
    authorization: {
      url: "https://auth.atlassian.com/authorize",
      params: { audience: "api.atlassian.com", scope: "read:me" },
    },
    token: "https://auth.atlassian.com/oauth/token",
    userinfo: "https://api.atlassian.com/me",
    profile(profile) {
      return {
        id: profile.account_id,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      };
    },
    checks: ["state"],
    options,
  };
}

export { Atlassian };
