import type { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/oauth";

/**
 * The returned user profile from Webex when using the profile callback.
 *
 * Please refer to {@link https://developer.webex.com/docs/api/v1/people/get-my-own-details People - Get My Own Details}
 * on Webex Developer portal for additional fields. Returned fields may vary depending on the user's role, the OAuth
 * integration's scope, and the organization the OAuth integration belongs to.
 */
export interface WebexProfile extends Record<string, any> {
  id: string;
  emails: string[];
  displayName?: string;
  avatar?: string;
}

export default function Webex<P extends WebexProfile>(
  config: OAuthUserConfig<P> & { apiBaseUrl?: string }
): OAuthConfig<P> {
  const apiBaseUrl = config?.apiBaseUrl ?? "https://webexapis.com/v1";

  return {
    id: "webex",
    name: "Webex",
    type: "oauth",
    authorization: {
      url: `${apiBaseUrl}/authorize`,
      params: { scope: "spark:kms spark:people_read" },
    },
    token: `${apiBaseUrl}/access_token`,
    userinfo: `${apiBaseUrl}/people/me`,
    profile(profile) {
      return {
        id: profile.id,
        email: profile.emails[0],
        name: profile.displayName,
        image: profile.avatar,
      };
    },
    options: config,
  };
}

export { Webex }
