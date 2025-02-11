import type { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/provider";

/** @see [Get the authenticated user](https://clickup.com/api/clickupreference/operation/GetAuthorizedUser/)*/
export interface ClickUpProfile {
  user: {
    id: number;
    username: string;
    color: string;
    profilePicture: string;
  };
}

interface SVGComponentProps extends React.SVGProps<SVGSVGElement> {}
const ClickUpIcon: React.FC<SVGComponentProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    className="-ml-1 size-3.5"
    fill="none"
    viewBox="0 0 185 185"
    {...props}
  >
    <g filter="url(#a)">
      <rect width={125} height={125} x={30} y={20} fill="#fff" rx={62.5} />
      <rect width={125} height={125} x={30} y={20} fill="#fff" rx={62.5} />
      <path
        fill="url(#b)"
        fillRule="evenodd"
        d="m55.9 105.7 13.5-10.3c7.2 9.3 14.8 13.7 23.3 13.7 8.4 0 15.9-4.3 22.7-13.6l13.7 10c-9.9 13.5-22.2 20.6-36.4 20.6s-26.6-7-36.8-20.4Z"
        clipRule="evenodd"
      />
      <path
        fill="url(#c)"
        fillRule="evenodd"
        d="m92.6 60.7-24 20.7-11.1-12.9 35.2-30.3 35 30.4-11.2 12.8-23.9-20.7Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <linearGradient
        id="b"
        x1={55.9}
        x2={129.1}
        y1={116.3}
        y2={116.3}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#8930FD" />
        <stop offset={1} stopColor="#49CCF9" />
      </linearGradient>
      <linearGradient
        id="c"
        x1={57.5}
        x2={127.6}
        y1={67.6}
        y2={67.6}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF02F0" />
        <stop offset={1} stopColor="#FFC800" />
      </linearGradient>
      <filter
        id="a"
        width={185}
        height={185}
        x={0}
        y={0}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy={10} />
        <feGaussianBlur stdDeviation={15} />
        <feColorMatrix values="0 0 0 0 0.0627451 0 0 0 0 0.117647 0 0 0 0 0.211765 0 0 0 0.1 0" />
        <feBlend in2="BackgroundImageFix" result="effect1_dropShadow" />
        <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
      </filter>
    </defs>
  </svg>
);

export default function ClickUp(
  config: OAuthUserConfig<ClickUpProfile>
): OAuthConfig<ClickUpProfile> {
  return {
    id: "click-up",
    name: "ClickUp",
    type: "oauth",
    authorization: "https://app.clickup.com/api",
    token: "https://api.clickup.com/api/v2/oauth/token",
    userinfo: "https://api.clickup.com/api/v2/user",
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    checks: ["state"],
    profile: (profile: ClickUpProfile) => {
      return {
        id: profile.user.id.toString(),
        name: profile.user.username,
        profilePicture: profile.user.profilePicture,
        color: profile.user.color,
      };
    },
    options: config,
    style: {
      icon: <ClickUpIcon />
    }
  };
}

export { ClickUp, ClickUpIcon };
