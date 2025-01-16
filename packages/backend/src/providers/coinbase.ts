import type { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/oauth";

export default function Coinbase(
  options: OAuthUserConfig<Record<string, any>>
): OAuthConfig<Record<string, any>> {
  return {
    id: "coinbase",
    name: "Coinbase",
    type: "oauth",
    authorization:
      "https://login.coinbase.com/oauth2/auth?scope=wallet:user:email+wallet:user:read",
    token: "https://login.coinbase.com/oauth2/token",
    userinfo: "https://api.coinbase.com/v2/user",
    profile(profile) {
      return {
        id: profile.data.id,
        name: profile.data.name,
        email: profile.data.email,
        image: profile.data.avatar_url,
      };
    },
    options,
  };
}

export { Coinbase }