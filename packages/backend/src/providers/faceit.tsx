import type { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/provider";

const FaceItIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="29.3 101.1 451.7 357.9"
    className="-ml-1 size-4"
  >
    <path
      fill="#fd5a00"
      d="M481 104.8c0-1.8-1.9-3.7-1.9-3.7-1.8 0-1.8 0-3.7 1.9-37.5 58.1-76.8 116.2-114.3 176.2H34.9c-3.7 0-5.6 5.6-1.8 7.5a29062.2 29062.2 0 0 1 440.4 170.4c3.7 1.9 7.5-1.9 7.5-3.7z"
    />
    <path
      fill="#ff690a"
      d="M481 104.8c0-1.8-1.9-3.7-1.9-3.7-1.8 0-1.8 0-3.7 1.9-37.5 58.1-76.8 116.2-114.3 176.2l119.9 1.2z"
    />
  </svg>
);

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
    style: { icon: <FaceItIcon /> }
  };
}

export { FACEIT, FaceItIcon }