import type { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/provider";
import { Mailru as MailruIcon } from "@sse-auth/icons";

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
    style: {
      icon: {
        dark: <MailruIcon />,
        light: <MailruIcon />,
      },
    },
    options: config,
  };
}

export { Mailru };
