import { OAuth2Config, OAuthConfig, OIDCConfig } from "./oauth";
import { EmailConfig } from "./email";
import { CredentialsConfig, CredentialsProviderId } from "./credentials";
import { Profile } from "../index";
import { EmailProviderId, OAuthProviderId } from "./provider-types";
import { WebAuthnConfig, WebAuthnProviderType } from "./webauthn";

export * from "./email";
export * from "./credentials";
export * from "./nodemailer";
export * from "./oauth";
export * from "./webauthn";
export * from "./provider-types";

/**
 * Providers passed to Auth.js must define one of these types.
 *
 * @see [RFC 6749 - The OAuth 2.0 Authorization Framework](https://www.rfc-editor.org/rfc/rfc6749.html#section-2.3)
 * @see [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication)
 * @see [Email or Passwordless Authentication](https://authjs.dev/concepts/oauth)
 * @see [Credentials-based Authentication](https://authjs.dev/concepts/credentials)
 */
export type ProviderType =
  | "oidc"
  | "oauth"
  | "email"
  | "credentials"
  | WebAuthnProviderType;

/** Shared across all {@link ProviderType} */
export interface CommonProviderOptions {
  /**
   * Uniquely identifies the provider in {@link AuthConfig.providers}
   * It's also part of the URL
   */
  id: string;
  /**
   * The provider name used on the default sign-in page's sign-in button.
   * For example if it's "Google", the corresponding button will say:
   * "Sign in with Google"
   */
  name: string;
  /** See {@link ProviderType} */
  type: ProviderType;
}

interface InternalProviderOptions {
  /** Used to deep merge user-provided config with the default config
   */
  options?: Record<string, unknown>;
}

/**
 * Must be a supported authentication provider config:
 * - {@link OAuthConfig}
 * - {@link EmailConfigInternal}
 * - {@link CredentialsConfigInternal}
 *
 * For more information, see the guides:
 *
 * @see [OAuth/OIDC guide](https://authjs.dev/guides/providers/custom-provider)
 * @see [Email (Passwordless) guide](https://authjs.dev/guides/providers/email)
 * @see [Credentials guide](https://authjs.dev/guides/providers/credentials)
 */
export type Provider<P extends Profile = any> = (
  | ((
      | OIDCConfig<P>
      | OAuth2Config<P>
      | EmailConfig
      | CredentialsConfig
      | WebAuthnConfig
    ) &
      InternalProviderOptions)
  | ((
      ...args: any
    ) => (
      | OAuth2Config<P>
      | OIDCConfig<P>
      | EmailConfig
      | CredentialsConfig
      | WebAuthnConfig
    ) &
      InternalProviderOptions)
) &
  InternalProviderOptions;

export interface AppProvider extends CommonProviderOptions {
  signinUrl: string;
  callbackUrl: string;
}

export type ProviderId =
  | CredentialsProviderId
  | EmailProviderId
  | OAuthProviderId
  | WebAuthnProviderType
  | (string & {});
