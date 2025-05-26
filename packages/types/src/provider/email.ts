import { CommonProviderOptions } from './index';
import type { Awaitable, Theme } from '../index';

// TODO: Kepts for backwards compatibility
// Remove this import and encourage users
// to import it from @auth/core/providers/nod
import type { NodemailerConfig } from './nodemailer';

// TODO: Rename to Token provider
// when started working on https://github.com/nextauthjs/next-auth/discussions/1465
export type EmailProviderType = 'email';

export type EmailProviderSendVerificationRequestParams = {
  identifier: string;
  url: string;
  expires: Date;
  provider: EmailConfig;
  token: string;
  theme: Theme;
  request: Request;
};

export interface EmailConfig extends CommonProviderOptions {
  id: string;
  type: 'email';
  name: string;
  from?: string;
  maxAge?: number;
  sendVerificationRequest: (params: EmailProviderSendVerificationRequestParams) => Awaitable<void>;
  /** Used to hash the verification token. */
  secret?: string;
  /** Used with HTTP-based email providers. */
  apiKey?: string;
  /** Used with SMTP-based email providers. */
  server?: NodemailerConfig['server'];
  generateVerificationToken?: () => Awaitable<string>;
  normalizeIdentifier?: (identifier: string) => string;
  options?: EmailUserConfig;
}

export type EmailUserConfig = Omit<Partial<EmailConfig>, 'options' | 'type'>;
