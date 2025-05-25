import type { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/provider";
import { WordPressDark, WordPressLight } from "@sse-auth/icons";

export default function WordPress(
  config: OAuthUserConfig<Record<string, any>>
): OAuthConfig<Record<string, any>> {
  return {
    id: "wordpress",
    name: "WordPress.com",
    type: "oauth",
    authorization:
      "https://public-api.wordpress.com/oauth2/authorize?scope=auth",
    token: "https://public-api.wordpress.com/oauth2/token",
    userinfo: "https://public-api.wordpress.com/rest/v1/me",
    profile(profile) {
      return {
        id: profile.ID,
        name: profile.display_name,
        email: profile.email,
        image: profile.avatar_URL,
      };
    },
    style: {
      icon: {
        light: <WordPressLight />,
        dark: <WordPressDark />,
      },
    },
    options: config,
  };
}

export { WordPress };
