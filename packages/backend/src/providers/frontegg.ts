import type { OIDCConfig, OIDCUserConfig } from "@sse-auth/types/oauth";

/** The returned user profile from Frontegg when using the profile callback. [Reference](https://docs.frontegg.com/docs/admin-portal-profile). */
export interface FronteggProfile {
  /** The user's unique Frontegg ID */
  sub: string;
  /** The user's name */
  name: string;
  /** The user's email */
  email: string;
  /** A boolean indicating if the user's email is verified */
  email_verified: boolean;
  /** The user's picture */
  profilePictureUrl: string;
  /** The user's roles */
  roles: string[];
  /** The user's custom attributes */
  [claim: string]: unknown;
}

export default function Frontegg(
  options: OIDCUserConfig<FronteggProfile>
): OIDCConfig<FronteggProfile> {
  return {
    id: "frontegg",
    name: "Frontegg",
    type: "oidc",
    authorization: `${options.issuer}/oauth/authorize`,
    token: `${options.issuer}/oauth/token`,
    userinfo: `${options.issuer}/identity/resources/users/v2/me`,
    wellKnown: `${options.issuer}/oauth/.well-known/openid-configuration`,
    issuer: options.issuer,
    options,
  };
}

export { Frontegg }