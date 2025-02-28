import type { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/provider";

const BoxIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="-ml-1 size-4"
    viewBox="0 0 444.9 245.4"
  >
    <g fill="#0075C9">
      <path d="M239 72.4c-33 0-61.8 18.6-76.3 46A86.4 86.4 0 0 0 34.6 89.6V16.9A17.3 17.3 0 0 0 0 17v143.4a86.4 86.4 0 0 0 162.7 39 86.4 86.4 0 1 0 76.3-127zM86.4 210.6a51.8 51.8 0 1 1 0-103.6 51.8 51.8 0 0 1 0 103.6zm152.6 0a51.8 51.8 0 1 1 0-103.6 51.8 51.8 0 0 1 0 103.6z" />
      <path d="m441.7 218-44.3-59 44.3-59.2A17.3 17.3 0 0 0 414 79l-38.2 51-38.2-51A17.3 17.3 0 0 0 310 99.7l44.2 59.2L310 218a17.3 17.3 0 0 0 27.6 20.8l38.2-51 38.2 51a17.3 17.3 0 0 0 27.6-20.8z" />
    </g>
  </svg>
);

export default function Box(
  options: OAuthUserConfig<Record<string, any>>
): OAuthConfig<Record<string, any>> {
  return {
    id: "box",
    name: "Box",
    type: "oauth",
    authorization: "https://account.box.com/api/oauth2/authorize",
    token: "https://api.box.com/oauth2/token",
    userinfo: "https://api.box.com/2.0/users/me",
    profile(profile) {
      return {
        id: profile.id,
        name: profile.name,
        email: profile.login,
        image: profile.avatar_url,
      };
    },
    options,
    style: { icon: <BoxIcon /> },
  };
}

export { Box, BoxIcon };
