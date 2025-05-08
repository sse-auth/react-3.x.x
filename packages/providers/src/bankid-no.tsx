import type { OIDCConfig, OIDCUserConfig } from "@sse-auth/types/provider";

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
  typ: "ID";
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
  amr: "BID" | "BIM" | "BIS";
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

const BankIDIcon = () => (
  <svg
    width="120"
    height="90"
    viewBox="0 0 120 90"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="-ml-1 size-4"
  >
    <rect width="100%" height="100%" fill="#39134c" />
    <path
      d="M38.13 24.7024H22.4443C20.3528 24.7024 18.5228 22.869 18.5228 20.7738C18.5228 18.6785 20.3528 16.8452 22.4443 16.8452H38.13C40.2214 16.8452 42.0514 18.6785 42.0514 20.7738C42.0514 22.869 40.2214 24.7024 38.13 24.7024Z"
      fill="#fff"
    />
    <path
      d="M38.13 56.1309H22.4443C20.3528 56.1309 18.5228 54.2976 18.5228 52.2024C18.5228 50.1071 20.3528 48.2738 22.4443 48.2738H38.13C40.2214 48.2738 42.0514 50.1071 42.0514 52.2024C42.0514 54.2976 40.2214 56.1309 38.13 56.1309Z"
      fill="#fff"
    />
    <path
      d="M38.13 71.8452H22.4443C20.3528 71.8452 18.5228 70.0119 18.5228 67.9167C18.5228 65.8214 20.3528 63.9881 22.4443 63.9881H38.13C40.2214 63.9881 42.0514 65.8214 42.0514 67.9167C42.0514 70.0119 40.2214 71.8452 38.13 71.8452Z"
      fill="#fff"
    />
    <path
      d="M69.5014 40.4167H53.8157C51.7243 40.4167 49.8943 38.5833 49.8943 36.4881C49.8943 34.3928 51.7243 32.5595 53.8157 32.5595H69.5014C71.5928 32.5595 73.4228 34.3928 73.4228 36.4881C73.4228 38.5833 71.5928 40.4167 69.5014 40.4167Z"
      fill="#fff"
    />
    <path
      d="M69.5014 56.1309H53.8157C51.7243 56.1309 49.8943 54.2976 49.8943 52.2024C49.8943 50.1071 51.7243 48.2738 53.8157 48.2738H69.5014C71.5928 48.2738 73.4228 50.1071 73.4228 52.2024C73.4228 54.2976 71.5928 56.1309 69.5014 56.1309Z"
      fill="#fff"
    />
    <path
      d="M100.873 24.7024H85.1871C83.0957 24.7024 81.2657 22.869 81.2657 20.7738C81.2657 18.6785 83.0957 16.8452 85.1871 16.8452H100.873C102.964 16.8452 104.794 18.6785 104.794 20.7738C104.794 22.869 102.964 24.7024 100.873 24.7024Z"
      fill="#fff"
    />
    <path
      d="M100.873 40.4167H85.1871C83.0957 40.4167 81.2657 38.5833 81.2657 36.4881C81.2657 34.3928 83.0957 32.5595 85.1871 32.5595H100.873C102.964 32.5595 104.794 34.3928 104.794 36.4881C104.794 38.5833 102.964 40.4167 100.873 40.4167Z"
      fill="#fff"
    />
    <path
      d="M100.873 71.8452H85.1871C83.0957 71.8452 81.2657 70.0119 81.2657 67.9167C81.2657 65.8214 83.0957 63.9881 85.1871 63.9881H100.873C102.964 63.9881 104.794 65.8214 104.794 67.9167C104.794 70.0119 102.964 71.8452 100.873 71.8452Z"
      fill="#fff"
    />
  </svg>
);

export default function BankIDNorway(
  config: OIDCUserConfig<BankIDNorwayProfile>
): OIDCConfig<BankIDNorwayProfile> {
  return {
    id: "bankid-no",
    name: "BankID Norge",
    type: "oidc",
    issuer: "https://auth.bankid.no/auth/realms/prod",
    client: {
      token_endpoint_auth_method: "client_secret_post",
      userinfo_signed_response_alg: "RS256",
    },
    idToken: false,
    authorization: { params: { ui_locales: "no", login_hint: "BIS" } },
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email ?? null,
        image: null,
      };
    },
    checks: ["pkce", "state", "nonce"],
    options: config,
    style: { icon: <BankIDIcon /> },
  };
}

export { BankIDNorway, BankIDIcon };
