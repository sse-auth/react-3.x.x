import type { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/provider";
import { Reddit as RedditIcon } from "@sse-auth/icons";

export default function Reddit(
  config: OAuthUserConfig<Record<string, any>>
): OAuthConfig<Record<string, any>> {
  return {
    id: "reddit",
    name: "Reddit",
    type: "oauth",
    authorization: "https://www.reddit.com/api/v1/authorize?scope=identity",
    token: "https://www.reddit.com/api/v1/access_token",
    userinfo: "https://oauth.reddit.com/api/v1/me",
    checks: ["state"],
    style: {
      icon: {
        dark: <RedditIcon />,
        light: <RedditIcon />,
      },
    },
    options: config,
  };
}

export { Reddit };
