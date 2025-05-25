import type { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/provider";
import { Netlify as NetlifyIcon } from "@sse-auth/icons";

export default function Netlify(
  config: OAuthUserConfig<Record<string, any>>
): OAuthConfig<Record<string, any>> {
  return {
    id: "netlify",
    name: "Netlify",
    type: "oauth",
    authorization: "https://app.netlify.com/authorize?scope",
    token: "https://api.netlify.com/oauth/token",
    userinfo: "https://api.netlify.com/api/v1/user",
    profile(profile) {
      return {
        id: profile.id,
        name: profile.full_name,
        email: profile.email,
        image: profile.avatar_url,
      };
    },
    style: {
      icon: {
        dark: <NetlifyIcon />,
        light: <NetlifyIcon />,
      },
    },
    options: config,
  };
}

export { Netlify };
