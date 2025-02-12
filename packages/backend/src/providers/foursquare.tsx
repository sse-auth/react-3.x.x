import type { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/provider";

const FoursquareIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 275.9 275.9"
    className="-ml-1 size-5"
  >
    <style></style>
    <rect width="275.4" height="275.6" x=".1" y=".3" />
    <g>
      <path
        d="M69.2 50.1H121v8.5H77.8v23.8h38.4v8.5H77.8v34.4h-8.6V50.1z"
        style={{ fill: "#fff" }}
      />
      <path
        d="m67.7 198.8 8.4-1.9c1.5 10.4 8.7 16.6 20.4 16.6 10.5 0 18.8-4.9 18.8-12.9 0-5.7-4.2-10.5-20.6-15.4-18.6-5.3-24.8-12.1-24.8-22.1 0-12.9 10.4-19.8 25.5-19.8 16.9 0 24.4 8.6 27 20.4l-8.4 1.9c-2.1-9.7-8.7-13.8-18.9-13.8-9.6 0-16.4 3.6-16.4 10.5 0 5.6 4.4 9.9 19.6 14.7 18.1 5.6 25.9 11.7 25.9 23.3 0 14.4-12.1 21.9-27.5 21.9-16.1-.1-27.1-8.4-29-23.4z"
        style={{ fill: "#fff" }}
      />
      <path
        d="M134.5 182.9c0-22.3 14.6-39.7 37-39.7 22.3 0 36.7 17.5 36.7 39.7 0 11.1-3.7 20.7-9.9 27.7 3 3 5.9 6 8.8 9.2l-6.2 6-9.2-9.5a36.6 36.6 0 0 1-20.2 5.8c-21.6 0-37-16.5-37-39.2zm50.7 27a222 222 0 0 0-8.8-8.1l6-6.1c3.2 2.8 6.4 5.7 9.4 8.6a33.1 33.1 0 0 0 7.2-21.5c0-17.6-10.7-31-27.5-31s-27.6 13.4-27.6 31c0 18.1 11.7 30.8 27.6 30.8 5.1 0 9.7-1.2 13.7-3.7z"
        style={{ fill: "#fff" }}
      />
    </g>
  </svg>
);

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
    style: { icon: <FoursquareIcon /> },
    options,
  };
}

export { Foursquare, FoursquareIcon };
