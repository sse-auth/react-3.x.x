import type { OIDCConfig, OIDCUserConfig } from '@sse-auth/types/provider';
import { Beyondidentity as BeyondIdentityIcon } from '@sse-auth/icons';

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

export default function BeyondIdentity(
  config: OIDCUserConfig<BeyondIdentityProfile>
): OIDCConfig<BeyondIdentityProfile> {
  return {
    id: 'beyondidentity',
    name: 'Beyond Identity',
    type: 'oidc',
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
    style: {
      icon: {
        dark: <BeyondIdentityIcon />,
        light: <BeyondIdentityIcon />,
      },
    },
  };
}

export { BeyondIdentity, BeyondIdentityIcon };
