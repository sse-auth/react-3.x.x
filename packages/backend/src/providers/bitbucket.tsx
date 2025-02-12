import { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/provider";

type LiteralUnion<T extends U, U = string> = T | (U & Record<never, never>);

/**
 * @see https://developer.atlassian.com/cloud/bitbucket/rest/api-group-users/#api-user-get
 */
export interface BitbucketProfile {
  display_name: string;
  links: Record<
    LiteralUnion<
      "self" | "avatar" | "repositories" | "snippets" | "html" | "hooks"
    >,
    { href?: string }
  >;
  created_on: string;
  type: string;
  uuid: string;
  has_2fa_enabled: boolean | null;
  username: string;
  is_staff: boolean;
  account_id: string;
  nickname: string;
  account_status: string;
  location: string | null;
}

const BitBucketIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Bitbucket"
    role="img"
    viewBox="0 0 512 512"
    className="-ml-1 size-4"
  >
    <rect width="512" height="512" rx="15%" fill="#ffffff" />
    <path
      fill="#2684ff"
      d="M422 130a10 10 0 00-9.9-11.7H100.5a10 10 0 00-10 11.7L136 409a10 10 0 009.9 8.4h221c5 0 9.2-3.5 10 -8.4L422 130zM291 316.8h-69.3l-18.7-98h104.8z"
    />
    <path
      fill="url(#a)"
      d="M59.632 25.2H40.94l-3.1 18.3h-13v18.9H52c1 0 1.7-.7 1.8-1.6l5.8-35.6z"
      transform="translate(89.8 85) scale(5.3285)"
    />
    <linearGradient
      id="a"
      x2="1"
      gradientTransform="rotate(141 22.239 22.239) scale(31.4)"
      gradientUnits="userSpaceOnUse"
    >
      <stop offset="0" stop-color="#0052cc" />
      <stop offset="1" stop-color="#2684ff" />
    </linearGradient>
  </svg>
);

export default function BitBucket(
  options: OAuthUserConfig<BitbucketProfile>
): OAuthConfig<BitbucketProfile> {
  return {
    id: "bitbucket",
    name: "Bitbucket",
    type: "oauth",
    authorization: {
      url: "https://bitbucket.org/site/oauth2/authorize",
      params: {
        scope: "account",
      },
    },
    token: "https://bitbucket.org/site/oauth2/access_token",
    userinfo: "https://api.bitbucket.org/2.0/user",
    profile(profile) {
      return {
        name: profile.display_name ?? profile.username,
        id: profile.account_id,
        image: profile.links.avatar?.href,
      };
    },
    options,
    style: { icon: <BitBucketIcon /> },
  };
}

export { BitBucket, BitBucketIcon };
