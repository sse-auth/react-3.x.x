import { OAuthConfig } from "@sse-auth/types/provider";

interface BitlyEmail {
  email: string;
  is_primary: boolean;
  is_verified: boolean;
}

export interface BitlyProfile {
  login: string;
  name: string;
  is_active: boolean;
  created: string;
  modified: string;
  is_sso_user: boolean;
  emails: BitlyEmail[];
  is_2fa_enabled: boolean;
  default_group_guid: string;
}

export default function Bitly(
  options: OAuthConfig<BitlyProfile>
): OAuthConfig<BitlyProfile> {
  return {
    id: "bitly",
    name: "Bitly",
    type: "oauth",
    authorization: "https://bitly.com/oauth/authorize",
    token: "https://api-ssl.bitly.com/v4/oauth/access_token",
    userinfo: "https://api-ssl.bitly.com/v4/user",
    profile(profile) {
      const primaryEmail =
        profile.emails.find((email) => email.is_primary)?.email ||
        profile.emails[0].email;

      return {
        id: profile.login,
        name: profile.name,
        email: primaryEmail,
        image: null,
      };
    },
    options,
  };
}

export { Bitly };
