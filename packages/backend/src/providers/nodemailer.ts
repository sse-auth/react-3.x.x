import { createTransport } from "nodemailer";
import { html, text } from "../utils/email";

import type { Transport, TransportOptions } from "nodemailer";
import * as JSONTransport from "nodemailer/lib/json-transport/index";
import * as SendmailTransport from "nodemailer/lib/sendmail-transport/index";
import * as SESTransport from "nodemailer/lib/ses-transport/index";
import * as SMTPPool from "nodemailer/lib/smtp-pool/index";
import * as SMTPTransport from "nodemailer/lib/smtp-transport/index";
import * as StreamTransport from "nodemailer/lib/stream-transport/index";
import type { Awaitable, Theme } from "@sse-auth/types";
import type { EmailConfig } from "./email";

type AllTransportOptions =
  | string
  | SMTPTransport
  | SMTPTransport.Options
  | SMTPPool
  | SMTPPool.Options
  | SendmailTransport
  | SendmailTransport.Options
  | StreamTransport
  | StreamTransport.Options
  | JSONTransport
  | JSONTransport.Options
  | SESTransport
  | SESTransport.Options
  | Transport<any>
  | TransportOptions;

export interface NodemailerConfig extends EmailConfig {
  server?: AllTransportOptions;
  sendVerificationRequest: (params: {
    identifier: string;
    url: string;
    expires: Date;
    provider: NodemailerConfig;
    token: string;
    theme: Theme;
    request: Request;
  }) => Awaitable<void>;
  options?: NodemailerUserConfig;
}

export type NodemailerUserConfig = Omit<
  Partial<NodemailerConfig>,
  "options" | "type"
>;

export default function Nodemailer(
  config: NodemailerUserConfig
): NodemailerConfig {
  if (!config.server)
    throw new Error("Nodemailer requires a `server` configuration");

  return {
    id: "nodemailer",
    type: "email",
    name: "Nodemailer",
    server: { host: "localhost", port: 25, auth: { user: "", pass: "" } },
    from: "SSE Auth <no-reply@auth.sse>",
    maxAge: 24 * 60 * 60,
    async sendVerificationRequest(params) {
      const { identifier, url, provider, theme } = params;
      const { host } = new URL(url);
      const transport = createTransport(provider.server);
      const result = await transport.sendMail({
        to: identifier,
        from: provider.from,
        subject: `Sign in to ${host}`,
        text: text({ url, host }),
        html: html({ url, host, theme }),
      });
      const rejected = result.rejected || [];
      const pending = result.pending || [];
      const failed = rejected.concat(pending).filter(Boolean);
      if (failed.length) {
        throw new Error(`Email (${failed.join(", ")}) could not be sent`);
      }
    },
    options: config,
  };
}

export { Nodemailer }
