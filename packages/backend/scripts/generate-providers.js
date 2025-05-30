import { join } from "path";
import { readdirSync, writeFileSync } from "fs";

const currentDir = process.cwd();
const providersPath = join(currentDir, "src/providers");
const outputPath = join(currentDir, "..", "types/src/provider")

const files = readdirSync(providersPath, "utf8");

// TODO: Autogenerate
const emailProvidersFile = [
  "email",
  "forwardemail",
  "mailgun",
  "nodemailer",
  "passkey",
  "postmark",
  "resend",
  "sendgrid",
];

// TODO: Autogenerate
const nonOAuthFile = [
  "provider-types",
  "oauth",
  "index",
  // Credentials
  "credentials",
  // Webauthn
  "webauthn",
  // Email providers
  ...emailProvidersFile,
];

const providers = files.map((file) => {
  const strippedProviderName = file.substring(0, file.indexOf("."));
  return `"${strippedProviderName}"`;
});

const oauthProviders = providers.filter(
  (provider) => !nonOAuthFile.includes(provider.replace(/"/g, ""))
);

const emailProviders = providers.filter((provider) =>
  emailProvidersFile.includes(provider.replace(/"/g, ""))
);

const content = `
// THIS FILE IS AUTOGENERATED BY SSE. DO NOT EDIT.
export type OAuthProviderId = 
  | ${oauthProviders.join("\n  | ")}

export type EmailProviderId = 
  | ${emailProviders.join("\n  | ")}`;

writeFileSync(join(outputPath, "provider-types.ts"), content);
