import type { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/provider";
import { Freshbooks as FreshbooksIcon } from "@sse-auth/icons";

export default function Freshbooks(
  options: OAuthUserConfig<Record<string, any>>
): OAuthConfig<Record<string, any>> {
  return {
    id: "freshbooks",
    name: "Freshbooks",
    type: "oauth",
    authorization: "https://auth.freshbooks.com/service/auth/oauth/authorize",
    token: "https://api.freshbooks.com/auth/oauth/token",
    userinfo: "https://api.freshbooks.com/auth/api/v1/users/me",
    async profile(profile) {
      return {
        id: profile.response.id,
        name: `${profile.response.first_name} ${profile.response.last_name}`,
        email: profile.response.email,
        image: null,
      };
    },
    style: {
      icon: {
        dark: <FreshbooksIcon />,
        light: <FreshbooksIcon />,
      },
    },
    options,
  };
}

export { Freshbooks, FreshbooksIcon };
