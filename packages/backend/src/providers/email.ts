import type { CommonProviderOptions, Awaitable, Theme } from "@sse-auth/types";
import Nodemailer from "./nodemailer";
import type { NodemailerConfig, NodemailerUserConfig } from "./nodemailer";

/**
 * @deprecated
 *
 * Import this provider from the `providers/nodemailer` submodule instead of `providers/email`.
 *
 * To log in with nodemailer, change `signIn("email")` to `signIn("nodemailer")`
 */

export default function Email(config: NodemailerUserConfig): NodemailerConfig {
  return {
    ...Nodemailer(config),
    id: "email",
    name: "Email",
  };
}

// TODO: Rename to Token provider
export type EmailProviderType = "email";

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
  type: "email";
  name: string;
  from?: string;
  maxAge?: number;
  sendVerificationRequest: (
    params: EmailProviderSendVerificationRequestParams
  ) => Awaitable<void>;
  /** Used to hash the verification token. */
  secret?: string;
  /** Used with HTTP-based email providers. */
  apiKey?: string;
  /** Used with SMTP-based email providers. */
  server?: NodemailerConfig["server"];
  generateVerificationToken?: () => Awaitable<string>;
  normalizeIdentifier?: (identifier: string) => string;
  options?: EmailUserConfig;
}

export type EmailUserConfig = Omit<Partial<EmailConfig>, "options" | "type">;
