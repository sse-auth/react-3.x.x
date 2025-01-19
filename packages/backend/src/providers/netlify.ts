import type { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/oauth";

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
    // style: {
    //   brandColor: "#32e6e2",
    // },
    options: config,
  };
}

export { Netlify }
