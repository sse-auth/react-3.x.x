import type { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/oauth";

export default function Foursquare(
  options: OAuthUserConfig<Record<string, any>> & { apiVersion?: string }
): OAuthConfig<Record<string, any>> {
  const { apiVersion = "20230131" } = options;
  return {
    id: "foursquare",
    name: "Foursquare",
    type: "oauth",
    authorization: "https://foursquare.com/oauth2/authenticate",
    token: "https://foursquare.com/oauth2/access_token",
    userinfo: {
      url: `https://api.foursquare.com/v2/users/self?v=${apiVersion}`,
      async request({ tokens, provider }) {
        if (!provider.userinfo) return;

        const url = new URL(provider.userinfo.url);
        url.searchParams.append("oauth_token", tokens.access_token!);
        return fetch(url).then((res) => res.json());
      },
    },
    profile({ response: { user: profile } }) {
      return {
        id: profile.id,
        name: `${profile.firstName} ${profile.lastName}`,
        email: profile.contact.email,
        image: profile.photo
          ? `${profile.photo.prefix}original${profile.photo.suffix}`
          : null,
      };
    },
    // style: {
    //   bg: "#000",
    //   text: "#fff",
    // },
    options,
  };
}

export { Foursquare }