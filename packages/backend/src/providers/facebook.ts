import type { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/provider";

interface FacebookPictureData {
  url: string;
}

interface FacebookPicture {
  data: FacebookPictureData;
}

export interface FacebookProfile extends Record<string, any> {
  id: string;
  picture: FacebookPicture;
}

export default function Facebook<P extends FacebookProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "facebook",
    name: "Facebook",
    type: "oauth",
    authorization: {
      url: "https://www.facebook.com/v19.0/dialog/oauth",
      params: {
        scope: "email",
      },
    },
    token: "https://graph.facebook.com/oauth/access_token",
    userinfo: {
      // https://developers.facebook.com/docs/graph-api/reference/user/#fields
      url: "https://graph.facebook.com/me?fields=id,name,email,picture",
      async request({ tokens, provider }) {
        return await fetch(provider.userinfo?.url as URL, {
          headers: { Authorization: `Bearer ${tokens.access_token}` },
        }).then(async (res) => await res.json());
      },
    },
    profile(profile: P) {
      return {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        image: profile.picture.data.url,
      };
    },
    // style: { bg: "#006aff", text: "#fff" },
    options,
  };
}

export { Facebook }