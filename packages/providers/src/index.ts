import {
  EmailProviderId,
  OAuthConfig,
  Provider,
  WebAuthnConfig,
  WebAuthnProviderType,
} from '@sse-auth/types/provider';
import CredentialsProvider, { CredentialsProviderId } from './credentials.js';
import EmailProvider from './email.js';
import { OAuthProviderId } from './provider-types.js';

export type BuiltInProviders = Record<
  OAuthProviderId,
  (config: Partial<OAuthConfig<any>>) => OAuthConfig<any>
> &
  Record<CredentialsProviderId, typeof CredentialsProvider> &
  Record<EmailProviderId, typeof EmailProvider> &
  Record<WebAuthnProviderType, (config: Partial<WebAuthnConfig>) => WebAuthnConfig>;

export type AppProviders = Array<Provider | ReturnType<BuiltInProviders[keyof BuiltInProviders]>>;
