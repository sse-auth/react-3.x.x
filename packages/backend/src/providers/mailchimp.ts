import type { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/oauth";

export default function Mailchimp(
  config: OAuthUserConfig<Record<string, any>>
): OAuthConfig<Record<string, any>> {
  return {
    id: "mailchimp",
    name: "Mailchimp",
    type: "oauth",
    authorization: "https://login.mailchimp.com/oauth2/authorize",
    token: "https://login.mailchimp.com/oauth2/token",
    userinfo: "https://login.mailchimp.com/oauth2/metadata",
    profile(profile) {
      return {
        id: profile.login.login_id,
        name: profile.accountname,
        email: profile.login.email,
        image: null,
      };
    },
    // style: {
    //   bg: "#000",
    //   text: "#fff",
    // },
    options: config,
  };
}

export { Mailchimp }
