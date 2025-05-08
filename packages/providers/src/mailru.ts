import type { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/provider";

export default function Mailru(
  config: OAuthUserConfig<Record<string, any>>
): OAuthConfig<Record<string, any>> {
  return {
    id: "mailru",
    name: "Mail.ru",
    type: "oauth",
    authorization: "https://oauth.mail.ru/login?scope=userinfo",
    token: "https://oauth.mail.ru/token",
    userinfo: "https://oauth.mail.ru/userinfo",
    options: config,
  };
}

export { Mailru }
