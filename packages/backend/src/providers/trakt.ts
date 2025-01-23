import type { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/provider";

export interface TraktUser extends Record<string, any> {
  username: string;
  private: boolean;
  name: string;
  vip: boolean;
  vip_ep: boolean;
  ids: { slug: string };
  joined_at: string;
  location: string | null;
  about: string | null;
  gender: string | null;
  age: number | null;
  images: { avatar: { full: string } };
}

export default function Trakt<P extends TraktUser>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "trakt",
    name: "Trakt",
    type: "oauth",
    authorization: "https://trakt.tv/oauth/authorize?scope=",
    token: "https://api.trakt.tv/oauth/token",
    userinfo: {
      url: "https://api.trakt.tv/users/me?extended=full",
      async request({ tokens, provider }) {
        return await fetch(provider.userinfo?.url as URL, {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
            "trakt-api-version": "2",
            "trakt-api-key": provider.clientId,
          },
        }).then(async (res) => await res.json());
      },
    },
    profile(profile) {
      return {
        id: profile.ids.slug,
        name: profile.name,
        email: null, // trakt does not provide user emails
        image: profile.images.avatar.full, // trakt does not allow hotlinking
      };
    },
    // style: { bg: "#ED2224", text: "#fff" },
    options,
  };
}

export { Trakt }
