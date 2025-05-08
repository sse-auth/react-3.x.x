import { OAuth2Config, OAuthUserConfig } from "@sse-auth/types/provider";

/**
 * @see https://www.figma.com/developers/api#users-types
 */
interface FigmaProfile {
  id: string;
  email: string;
  handle: string;
  img_url: string;
}

const FigmaIcon = () => (
  <svg
    className="-ml-1 size-4"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    id="figma"
  >
    <path
      fill="#0ACF83"
      d="M8 24c2.208 0 4-1.792 4-4v-4H8c-2.208 0-4 1.792-4 4s1.792 4 4 4z"
    ></path>
    <path
      fill="#A259FF"
      d="M4 12c0-2.208 1.792-4 4-4h4v8H8c-2.208 0-4-1.792-4-4z"
    ></path>
    <path
      fill="#F24E1E"
      d="M4 4c0-2.208 1.792-4 4-4h4v8H8C5.792 8 4 6.208 4 4z"
    ></path>
    <path
      fill="#FF7262"
      d="M12 0h4c2.208 0 4 1.792 4 4s-1.792 4-4 4h-4V0z"
    ></path>
    <path
      fill="#1ABCFE"
      d="M20 12c0 2.208-1.792 4-4 4s-4-1.792-4-4 1.792-4 4-4 4 1.792 4 4z"
    ></path>
  </svg>
);

export default function Figma(
  options: OAuthUserConfig<FigmaProfile>
): OAuth2Config<FigmaProfile> {
  return {
    id: "figma",
    name: "Figma",
    type: "oauth",
    authorization: {
      url: "https://www.figma.com/oauth",
      params: {
        scope: "files:read",
      },
    },
    checks: ["state"],
    token: "https://api.figma.com/v1/oauth/token",
    userinfo: "https://api.figma.com/v1/me",
    profile(profile) {
      return {
        name: profile.handle,
        email: profile.email,
        id: profile.id,
        image: profile.img_url,
      };
    },
    style: { icon: <FigmaIcon /> },
    options,
  };
}

export { Figma, FigmaIcon };
