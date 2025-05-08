import type { OIDCConfig, OIDCUserConfig } from "@sse-auth/types/provider";

/** @see [Beyond Identity Developer Docs](https://developer.beyondidentity.com/) */
export interface BeyondIdentityProfile {
  /** The user's unique identifier. */
  sub: string;
  /** The user's full name. */
  name: string;
  /** The user's preferred username. */
  preferred_username: string;
  /** The user's email address. */
  email: string;
}

const BeyondIdentityIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 32 32"
    className="-ml-1 size-3.5"
  >
    <path
      fill="#5077c5"
      d="m22.1 0-8.3 16.6L10 8.7H7.1l6.7 12.8L25 0Zm-9.2 27.2V30h2.5v-7.7z"
    />
  </svg>
);

export default function BeyondIdentity(
  config: OIDCUserConfig<BeyondIdentityProfile>
): OIDCConfig<BeyondIdentityProfile> {
  return {
    id: "beyondidentity",
    name: "Beyond Identity",
    type: "oidc",
    profile(profile) {
      return {
        id: profile.sub,
        email: profile.email,
        name: profile.name,
        image: null,
        preferred_username: profile.preferred_username,
      };
    },
    options: config,
    style: { icon: <BeyondIdentityIcon /> },
  };
}

export { BeyondIdentity, BeyondIdentityIcon };
