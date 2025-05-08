import type { EmailConfig, EmailUserConfig } from "./email";
import { html, text } from "./utils/email";

export default function MailGun(config: EmailUserConfig): EmailConfig {
  return {
    id: "mailgun",
    type: "email",
    name: "Mailgun",
    from: "SSE Auth <no-reply@auth.sse>",
    maxAge: 24 * 60 * 60,
    async sendVerificationRequest(params) {
      const { identifier: to, provider, url, theme } = params;
      const { host } = new URL(url);
      const domain = provider.from?.split("@").at(1);

      if (!domain) throw new Error("malformed Mailgun domain");

      const form = new FormData();
      form.append("from", `${provider.name} <${provider.from}>`);
      form.append("to", to);
      form.append("subject", `Sign in to ${host}`);
      form.append("html", html({ host, url, theme }));
      form.append("text", text({ host, url }));

      const res = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(`api:${provider.apiKey}`)}`,
        },
        body: form,
      });

      if (!res.ok) throw new Error("Mailgun error: " + (await res.text()));
    },
    options: config,
  };
}

export { MailGun }