import type { OIDCConfig, OIDCUserConfig } from '@sse-auth/types/provider';
import { BankidNo as BankIDIcon } from '@sse-auth/icons';

/**
 * @see [Core conepts - ID Token](https://confluence.bankidnorge.no/confluence/pdoidcl/technical-documentation/core-concepts/id-token)
 * @see [userinfo](https://confluence.bankidnorge.no/confluence/pdoidcl/technical-documentation/api/userinfo)
 */
export interface BankIDNorwayProfile {
  exp: number;
  iat: number;
  /** Epoc time */
  auth_time: number;
  jti: string;
  iss: string;
  /** Always client_id */
  aud: string;
  sub: string;
  typ: 'ID';
  /** Equals client_id */
  azp: string;
  session_state: string;
  at_hash: string;
  name: string;
  given_name: string;
  family_name: string;
  birthdate: string;
  updated_at: number;
  /**
   * Uniform Resource Name for [IDP option](https://confluence.bankidnorge.no/confluence/pdoidcl/technical-documentation/core-concepts/identity-providers) being used,
   * including Level of Assurance (LoA).
   * @example
   * ```
   * urn:bankid:bid;LOA=4
   * ```
   */
  acr: string;
  sid: string;
  /**
   * Name of [IDP option](https://confluence.bankidnorge.no/confluence/pdoidcl/technical-documentation/core-concepts/identity-providers) being used to authenticate the end-user.
   * If the end-user is subject to authentication step-up,
   * note that this value may differ from any `amr` value specified
   * in the `login_hint` parameter of the [authorize](https://confluence.bankidnorge.no/confluence/pdoidcl/technical-documentation/api/authorize) endpoint.
   */
  amr: 'BID' | 'BIM' | 'BIS';
  /** Personal Identifier (PID) / Serial Number) from associated BankID certificate. */
  bankid_altsub: string;
  /**
   * In case of BID or BIM, the issuer of the end user certificate is returned.
   * @example
   * ```
   * CN=BankID Bankenes ID-tjeneste Bank CA 2,
   * OU=988477052,
   * O=Bankenes ID-tjeneste AS,*
   * C=NO;OrginatorId=9775;OriginatorName=Gjensidige Bank RA 1
   * ```
   */
  originator: string;
  additionalCertInfo: {
    certValidFrom: number;
    serialNumber: string;
    keyAlgorithm: string;
    keySize: string;
    policyOid: string;
    certQualified: boolean;
    certValidTo: number;
    versionNumber: string;
    subjectName: string;
  };
  /** Currently used as an input parameter for the [securityData](https://confluence.bankidnorge.no/confluence/pdoidcl/technical-documentation/api/securitydata) endpoint of the [Fraud Data](https://confluence.bankidnorge.no/confluence/pdoidcl/technical-documentation/advanced-topics/fraud-data) service */
  tid: string;
  /** Only returned from the `userinfo_endpoint` */
  email?: string;
  /**
   * [Norwegian National Identity Number (fødselsnummer)](https://www.skatteetaten.no/en/person/foreign/norwegian-identification-number/national-identity-number). It can be an alternative to `sub`.
   * Requires `nnin_altsub` scope at the [authorize](https://confluence.bankidnorge.no/confluence/pdoidcl/technical-documentation/api/authorize) endpoint.
   * @example
   * ```
   * 181266*****
   * ```
   */
  nnin_altsub?: string;
}

export default function BankIDNorway(
  config: OIDCUserConfig<BankIDNorwayProfile>
): OIDCConfig<BankIDNorwayProfile> {
  return {
    id: 'bankid-no',
    name: 'BankID Norge',
    type: 'oidc',
    issuer: 'https://auth.bankid.no/auth/realms/prod',
    client: {
      token_endpoint_auth_method: 'client_secret_post',
      userinfo_signed_response_alg: 'RS256',
    },
    idToken: false,
    authorization: { params: { ui_locales: 'no', login_hint: 'BIS' } },
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email ?? null,
        image: null,
      };
    },
    checks: ['pkce', 'state', 'nonce'],
    options: config,
    style: {
      icon: {
        dark: <BankIDIcon />,
        light: <BankIDIcon />,
      },
    },
  };
}

export { BankIDNorway, BankIDIcon };
