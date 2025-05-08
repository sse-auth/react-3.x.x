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

const FacebookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid"
    viewBox="0 0 256 256"
    className="-ml-1 size-4"
  >
    <path
      fill="#1877F2"
      d="M256 128a128 128 0 1 0-148 126.4V165H75.5v-37H108V99.8c0-32 19.1-49.8 48.3-49.8 14 0 28.7 2.5 28.7 2.5V84h-16.1c-16 0-20.9 9.9-20.9 20v24h35.5l-5.7 37H148v89.4A128 128 0 0 0 256 128"
    />
    <path
      fill="#FFFFFF"
      d="m177.8 165 5.7-37H148v-24c0-10.1 5-20 20.9-20H185V52.5S170.4 50 156.3 50C127.1 50 108 67.7 108 99.8V128H75.5v37H108v89.4a129 129 0 0 0 40 0V165h29.8"
    />
  </svg>
);

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
    style: { icon: <FacebookIcon /> },
    options,
  };
}

export { Facebook, FacebookIcon };
