import type { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/provider";

export interface CognitoProfile extends Record<string, any> {
  sub: string;
  name: string;
  email: string;
  picture: string;
}

const CognitoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid"
    viewBox="0 0 256 299"
    className="-ml-1 size-4"
  >
    <path
      fill="#7A3E65"
      d="m208.8 58 25.7-6.6.2.3.7 155.6-.9.9-5.3.2-20.1-3.2-.3-.7V58M59.7 219h.1l68 19.7.2.2.3.2-.1 59.2-.2.3-68.3-33.2V219"
    />
    <path
      fill="#CFB2C1"
      d="M208.8 204.5 128 223.8 87.6 214l-27.9 5 68.3 19.9 105.4-28.6 1.1-2.1-25.7-3.7"
    />
    <path
      fill="#512843"
      d="m196.3 79.6-.7-.7-66.9-19.5-.7.3-.7-.3L22.1 89.7l-.6.7.8.5 24.1 3.5.8-.3L128 74.8l40.5 9.8 27.9-5"
    />
    <path
      fill="#C17B9E"
      d="m47.2 240.5-25.7 6.3v-.2l-1-155 1-1.2 25.7 3.7v146.4"
    />
    <path fill="#7A3E65" d="m82 180.4 46 5.4.3-.5.2-72-.5-.5-46 5.4v62.2" />
    <path
      fill="#C17B9E"
      d="m174 180.4-46 5.4v-73l46 5.4v62.2m22.3-100.8L128 59.7V0l68.3 33.2v46.4"
    />
    <path fill="#7A3E65" d="M128 0 0 61.8v175l21.5 10V90.4L128 59.7V0" />
    <path
      fill="#C17B9E"
      d="M234.5 51.4v156.8L128 238.9v59.7l128-61.8v-175l-21.5-10.4"
    />
  </svg>
);

export default function Cognito<P extends CognitoProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "cognito",
    name: "Cognito",
    type: "oidc",
    options,
    style: {
      icon: <CognitoIcon />,
    },
  };
}

export { Cognito, CognitoIcon };
