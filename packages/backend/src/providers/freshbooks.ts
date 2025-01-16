import type { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/oauth";

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
    // style: {
    //   bg: "#0075dd",
    //   text: "#fff",
    // },
    options,
  };
}

export { Freshbooks }