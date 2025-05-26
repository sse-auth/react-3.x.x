import Nodemailer from './nodemailer.js';
import type { NodemailerConfig, NodemailerUserConfig } from './nodemailer.js';
export * from '@sse-auth/types/provider/email';

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
    id: 'email',
    name: 'Email',
  };
}
