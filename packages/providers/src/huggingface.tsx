import type { OIDCConfig, OIDCUserConfig } from '@sse-auth/types/provider';
import { HuggingFace as HuggingFaceIcon } from '@sse-auth/icons';

export interface HuggingfaceProfile {
  /**
   * Unique identifier for the user.
   */
  sub: string;
  /**
   * Full name of the user.
   *
   * Needs 'profile' scope
   */
  name?: string;
  /**
   * Username of the user.
   *
   * Need 'profile' scope
   */
  preferred_username?: string;
  /**
   * URL of the user's avatar.
   *
   * Need 'profile' scope
   */
  profile?: string;
  /**
   * URL of the user's profile picture.
   *
   * Need 'profile' scope
   */
  picture?: string;
  /**
   * Need 'profile' scope
   *
   * Website of the user.
   */
  website?: string;
  /**
   * Need 'email' scope
   *
   * Email address of the user.
   */
  email?: string;
  /**
   * Need 'email' scope
   *
   * Whether the user's email address is verified. Should always be true, Hugging Face enforces
   * email verification for users to grant access to OAuth apps.
   */
  email_verified?: boolean;
  /**
   * Whether the user has a paid subscription.
   */
  isPro: boolean;
  /**
   * Whether the user has a payment method set up.
   *
   * Needs the `read-billing` scope.
   */
  canPay?: boolean;
  /**
   * List of the user's organizations.
   */
  orgs: Array<{
    /**
     * Unique identifier for the organization.
     */
    sub: string;
    /**
     * Name of the organization.
     */
    name: string;
    /**
     * URL of the organization's avatar.
     */
    picture: string;
    /**
     * Username of the organization.
     */
    preferred_username: string;
    /**
     * Whether the organization has a paid enterprise subscription.
     */
    isEnterprise: boolean;
    /**
     * Whether the organization has a payment method set up.
     *
     * Access to the organization needs to be granted to the oauth app for this field to be present.
     */
    canPay?: boolean;
    /**
     * The role of the user in the organization.
     *
     * Access to the organization needs to be granted to the oauth app for this field to be present.
     */
    roleInOrg?: 'admin' | 'write' | 'read' | 'contributor';
    /**
     * User needs to re-authenticate to access the organization.
     *
     * Access to the organization needs to be granted to the oauth app for this field to be present.
     */
    pendingSSO?: boolean;
    /**
     * User needs to enable MFA to access the organization.
     *
     * Access to the organization needs to be granted to the oauth app for this field to be present.
     */
    missingMFA?: boolean;
    /**
     * Resource groups are a feature of enterprise organizations.
     *
     * They allow granular access control to resources within the organization.
     *
     * Access to the organization needs to be granted to the oauth app for this field to be present.
     */
    resourceGroups?: Array<{
      /**
       * Unique identifier for the resource group.
       */
      sub: string;
      name: string;
      /**
       * The role of the user in the resource group.
       */
      role: 'read' | 'write' | 'admin' | 'contributor';
    }>;
  }>;
}

export default function HuggingFace(
  options: OIDCUserConfig<HuggingfaceProfile>
): OIDCConfig<HuggingfaceProfile> {
  return {
    id: 'huggingface',
    name: 'Hugging Face',
    type: 'oidc',
    issuer: 'https://huggingface.co',
    checks: ['pkce', 'state'],
    style: {
      icon: {
        dark: <HuggingFaceIcon />,
        light: <HuggingFaceIcon />,
      },
    },
    options,
  };
}

export { HuggingFace };
