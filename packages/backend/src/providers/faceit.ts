import type { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/provider";

export default function FACEIT(
  options: OAuthUserConfig<Record<string, any>>
): OAuthConfig<Record<string, any>> {
  return {
    id: "faceit",
    name: "FACEIT",
    type: "oauth",
    authorization: "https://accounts.faceit.com/accounts?redirect_popup=true",
    // @ts-expect-error - TODO fix this
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${options.clientId}:${options.clientSecret}`
      ).toString("base64")}`,
    },
    token: "https://api.faceit.com/auth/v1/oauth/token",
    userinfo: "https://api.faceit.com/auth/v1/resources/userinfo",
    profile(profile) {
      return {
        id: profile.guid,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      };
    },
    options,
  };
}

export { FACEIT }