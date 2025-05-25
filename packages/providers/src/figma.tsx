import { OAuth2Config, OAuthUserConfig } from "@sse-auth/types/provider";
import { Figma as FigmaIcon } from "@sse-auth/icons";

/**
 * @see https://www.figma.com/developers/api#users-types
 */
interface FigmaProfile {
  id: string;
  email: string;
  handle: string;
  img_url: string;
}

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
    style: {
      icon: {
        dark: <FigmaIcon />,
        light: <FigmaIcon />,
      },
    },
    options,
  };
}

export { Figma, FigmaIcon };
