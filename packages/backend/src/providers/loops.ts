import type { EmailConfig } from "./email";

export type LoopsUserConfig = Omit<Partial<LoopsConfig>, "options" | "type">;

export interface LoopsConfig
  extends Omit<EmailConfig, "sendVerificationRequest" | "options"> {
  id: string;
  apiKey: string;
  transactionalId: string;
  sendVerificationRequest: (params: Params) => Promise<void>;
  options: LoopsUserConfig;
}

type Params = Parameters<EmailConfig["sendVerificationRequest"]>[0] & {
  provider: LoopsConfig;
};

export default function Loops(config: LoopsUserConfig): LoopsConfig {
  return {
    id: "loops",
    apiKey: "",
    type: "email",
    name: "Loops",
    from: "SSE Auth <no-reply@auth.sse>",
    maxAge: 24 * 60 * 60,
    transactionalId: config.transactionalId || "",
    async sendVerificationRequest(params: Params) {
      const { identifier: to, provider, url } = params;
      if (!provider.apiKey || !provider.transactionalId)
        throw new TypeError("Missing Loops API Key or TransactionalId");

      const res = await fetch("https://app.loops.so/api/v1/transactional", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${provider.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transactionalId: provider.transactionalId,
          email: to,
          dataVariables: {
            url: url,
          },
        }),
      });
      if (!res.ok) {
        throw new Error(
          "Loops Send Error: " + JSON.stringify(await res.json())
        );
      }
    },
    options: config,
  };
}

export { Loops }