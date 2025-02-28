import type { OIDCConfig, OIDCUserConfig } from "@sse-auth/types/provider";

/** The returned user profile from Descope when using the profile callback.
 * [See Load User](https://docs.descope.com/api/openapi/usermanagement/operation/LoadUser/)
 */
export interface DescopeProfile {
  /** The user's unique Descope ID */
  sub: string;
  /** The user's name */
  name: string;
  /** The user's email */
  email: string;
  /** A boolean indicating if the user's email is verified */
  email_verified: boolean;
  /** The user's phone number */
  phone_number: string;
  /** A boolean indicating if the user's phone number is verified */
  phone_number_verified: boolean;
  /** The user's picture */
  picture: string;
  /** The user's custom attributes */
  [claim: string]: unknown;
}

const DescopeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    id="Layer_1"
    className="-ml-1 size-4"
    x="0"
    y="0"
    version="1.1"
    viewBox="0 0 194.7 215.2"
  >
    <style></style>
    <linearGradient
      id="SVGID_1_"
      x1="68.39"
      x2="185.03"
      y1="222.15"
      y2="41.03"
      gradientUnits="userSpaceOnUse"
    >
      <stop offset="0" stopColor="#0083b5" />
      <stop offset=".42" stopColor="#0ff" />
      <stop offset="1" stopColor="#6ff12d" />
    </linearGradient>
    <path
      d="M129.8 174.7c7.6-1.6 14-4.8 19.2-9.7 7.7-7.3 8.8-17.1 8.8-29.4V80.7c0-12.3-1.1-22.1-8.8-29.4-5.2-4.9-11.6-8.1-19.2-9.7V15.4c12.5 1.8 22.9 6.5 31 14.2 10.6 10 19.9 23.5 19.9 40.5v75c0 17-9.3 30.5-19.9 40.5-8.1 7.7-18.5 12.4-31 14.2v-25.1z"
      style={{ fill: "url(#SVGID_1_)" }}
    />
    <linearGradient
      id="SVGID_00000040544740507634666800000017273841385603649669_"
      x1="5.04"
      x2="121.67"
      y1="181.36"
      y2=".23"
      gradientUnits="userSpaceOnUse"
    >
      <stop offset="0" stopColor="#0083b5" />
      <stop offset=".42" stopColor="#0ff" />
      <stop offset="1" stopColor="#6ff12d" />
    </linearGradient>
    <path
      fill="url(#SVGID_00000040544740507634666800000017273841385603649669_)"
      d="M33.9 29.6c8.1-7.7 18.5-12.4 31-14.2v26.3c-7.6 1.6-14 4.8-19.2 9.7-7.7 7.3-8.8 17-8.8 29.2v55.1c0 12.3 1.1 22.1 8.8 29.4 5.2 4.9 11.6 8.1 19.2 9.7v25.1c-12.5-1.8-22.9-6.5-31-14.2-10.6-10-19.9-23.5-19.9-40.5V69.8c-.1-16.8 9.2-30.2 19.9-40.2z"
    />
    <linearGradient
      id="SVGID_00000060713993868866928010000000698955780952733088_"
      x1="22.03"
      x2="138.66"
      y1="192.3"
      y2="11.17"
      gradientUnits="userSpaceOnUse"
    >
      <stop offset="0" stopColor="#0083b5" />
      <stop offset=".42" stopColor="#0ff" />
      <stop offset="1" stopColor="#6ff12d" />
    </linearGradient>
    <path
      fill="url(#SVGID_00000060713993868866928010000000698955780952733088_)"
      d="m120.2 87.8 8.5-13.7-17.8-9.4-7.5 14.2a6.02 6.02 0 0 1-5.5 3.3c-2.3 0-4.4-1.2-5.5-3.3L85 64.7 67.3 74l12.3 19.7 40.6-5.9z"
    />
    <linearGradient
      id="SVGID_00000115475840050352750520000000840372054167564949_"
      x1="37.97"
      x2="154.6"
      y1="202.56"
      y2="21.43"
      gradientUnits="userSpaceOnUse"
    >
      <stop offset="0" stopColor="#0083b5" />
      <stop offset=".42" stopColor="#0ff" />
      <stop offset="1" stopColor="#6ff12d" />
    </linearGradient>
    <path
      fill="url(#SVGID_00000115475840050352750520000000840372054167564949_)"
      d="m142.4 97.7-87.8.8v17.7l27.5-.1-14.8 23.8 17.7 9.3 7.5-14.2c1.1-2.1 3.1-3.3 5.5-3.3 2.3 0 4.4 1.2 5.5 3.3l7.5 14.2 17.8-9.4-12-19.3-23.1-4.5 48.7-.2V97.7z"
    />
  </svg>
);

export default function Descope(
  config: OIDCUserConfig<DescopeProfile>
): OIDCConfig<DescopeProfile> {
  return {
    id: "discope",
    name: "Descope",
    type: "oidc",
    // style: {  },
    checks: ["pkce", "state"],
    options: config,
    style: { icon: <DescopeIcon /> },
  };
}

export { Descope, DescopeIcon };
