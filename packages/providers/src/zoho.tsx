import type { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/provider";
import { Zoho as ZohoIcon } from "@sse-auth/icons";

export default function Zoho(
  config: OAuthUserConfig<Record<string, any>>
): OAuthConfig<Record<string, any>> {
  return {
    id: "zoho",
    name: "Zoho",
    type: "oauth",
    authorization:
      "https://accounts.zoho.com/oauth/v2/auth?scope=AaaServer.profile.Read",
    token: "https://accounts.zoho.com/oauth/v2/token",
    userinfo: "https://accounts.zoho.com/oauth/user/info",
    profile(profile) {
      return {
        id: profile.ZUID,
        name: `${profile.First_Name} ${profile.Last_Name}`,
        email: profile.Email,
        image: null,
      };
    },
    style: {
      icon: {
        dark: <ZohoIcon />,
        light: <ZohoIcon />,
      },
    },
    options: config,
  };
}

export { Zoho };
