import type { OIDCConfig, OIDCUserConfig } from "@sse-auth/types/provider";

/** The returned user profile from Asgardeo when using the profile callback. */
export interface AsgardeoProfile extends Record<string, any> {
  /**
   * The user Asgardeo account ID
   */
  sub: string;
  /**
   * The user name
   */
  given_name: string;
  /**
   * The user email
   */
  email: string;
  /**
   * The user profile picture
   */
  picture: string;
}

const AsgardeoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="-ml-1 size-3.5"
    viewBox="0 0 99.9 86.4"
  >
    <g transform="translate(-553 -389)">
      <path
        fill="#ff7300"
        d="m624.4 389 9.1 15.9-10.1 17.6h20.3l9.2 15.9h-57Z"
        data-name="Path 264"
      />
      <path
        fill="#ff7300"
        d="m553 438.4 9.2-16h20.3L572.4 405l9.1-16 28.6 49.5Z"
        data-name="Path 265"
      />
      <path
        d="M613.1 475.4 603 457.8l-10.2 17.6h-18.4L603 426l28.5 49.4Z"
        data-name="Path 266"
      />
    </g>
  </svg>
);

export default function Asgardeo(
  config: OIDCUserConfig<AsgardeoProfile>
): OIDCConfig<AsgardeoProfile> {
  return {
    id: "asgardeo",
    name: "Asgardeo",
    type: "oidc",
    wellKnown: `${config?.issuer}/oauth2/token/.well-known/openid-configuration`,
    options: config,
    style: {
      icon: <AsgardeoIcon />,
    },
  };
}

export { Asgardeo, AsgardeoIcon };
