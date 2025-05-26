import type { OIDCConfig, OIDCUserConfig } from '@sse-auth/types/provider';
import { VippsMobilepay as VippsMobilepayIcon } from '@sse-auth/icons';

interface Address {
  address_type: string;
  country: string;
  formatted: string;
  postal_code: string;
  region: string;
  street_address: string;
}

/** @see [User Profile Structure](https://developer.vippsmobilepay.com/api/userinfo/#operation/userinfoAuthorizationCode) */
export interface VippsProfile extends Record<string, any> {
  accounts: {
    account_name: string;
    account_number: number;
    bank_name: string;
  }[];
  address: Address;
  other_addresses: Address[];
  birthdate: string;
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  name: string;
  nin: string;
  phone_number: string;
  sid: string;
  sub: string;
  delegatedConsents: {
    language: string;
    heading: string;
    termsDescription: string;
    confirmConsentButtonText: string;
    links: {
      termsLinkText: string;
      termsLinkUrl: string;
      privacyStatementLinkText: string;
      privacyStatementLinkUrl: string;
    };
    timeOfConsent: string;
    consents: {
      id: string;
      accepted: boolean;
      required: boolean;
      textDisplayedToUser: string;
    }[];
  };
}

export default function Vipps(options: OIDCUserConfig<VippsProfile>): OIDCConfig<VippsProfile> {
  return {
    id: 'vipps',
    name: 'Vipps',
    type: 'oidc',
    issuer: 'https://api.vipps.no/access-management-1.0/access/',
    authorization: { params: { scope: 'openid name email' } },
    idToken: false,
    checks: ['pkce', 'state', 'nonce'],
    style: {
      icon: {
        dark: <VippsMobilepayIcon />,
        light: <VippsMobilepayIcon />,
      },
    },
    options,
  };
}

export { Vipps };
