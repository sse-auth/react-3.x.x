import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import { InternalOptions } from "@sse-auth/types/config";
import { MissingAdapter } from "@sse-auth/types/error";
import {
  DEFAULT_SIMPLEWEBAUTHN_BROWSER_VERSION,
  DEFAULT_WEBAUTHN_TIMEOUT,
  GetUserInfo,
  RelayingParty,
  WebAuthnConfig,
  WebAuthnProviderType,
} from "@sse-auth/types/provider/webauthn";
export * from "@sse-auth/types/provider/webauthn";

export default function WebAuthn(
  config: Partial<WebAuthnConfig>
): WebAuthnConfig {
  return {
    id: "webauthn",
    name: "WebAuthn",
    enableConditionalUI: true,
    simpleWebAuthn: {
      generateAuthenticationOptions,
      generateRegistrationOptions,
      verifyAuthenticationResponse,
      verifyRegistrationResponse,
    },
    authenticationOptions: { timeout: DEFAULT_WEBAUTHN_TIMEOUT },
    registrationOptions: { timeout: DEFAULT_WEBAUTHN_TIMEOUT },
    formFields: {
      email: {
        label: "Email",
        required: true,
        autoComplete: "username webauthn",
      },
    },
    simpleWebAuthnBrowserVersion: DEFAULT_SIMPLEWEBAUTHN_BROWSER_VERSION,
    getUserInfo,
    getRelayingParty,
    ...config,
    type: "webauthn",
  };
}

/**
 * Retrieves user information for the WebAuthn provider.
 *
 * It looks for the "email" query parameter and uses it to look up the user in the database.
 * It also accepts a "name" query parameter to set the user's display name.
 *
 * @param options - The internaloptions object.
 * @param request - The request object containing the query parameters.
 * @returns The existing or new user info.
 * @throws {MissingAdapter} If the adapter is missing.
 * @throws {EmailSignInError} If the email address is not provided.
 */
const getUserInfo: GetUserInfo = async (options, request) => {
  const { adapter } = options;
  if (!adapter)
    throw new MissingAdapter(
      "WebAuthn provider requires a database adapter to be configured"
    );

  // Get email address from the query.
  const { query, body, method } = request;
  const email = (method === "POST" ? body?.email : query?.email) as unknown;

  // If email is not provided, return null
  if (!email || typeof email !== "string") return null;

  const existingUser = await adapter.getUserByEmail(email);
  if (existingUser) {
    return { user: existingUser, exists: true };
  }

  // If the user does not exist, return a new user info.
  return { user: { email }, exists: false };
};

/**
 * Retrieves the relaying party information based on the provided options.
 * If the relaying party information is not provided, it falls back to using the URL information.
 */
function getRelayingParty(
  /** The options object containing the provider and URL information. */
  options: InternalOptions<WebAuthnProviderType>
): RelayingParty {
  const { provider, url } = options;
  const { relayingParty } = provider;

  const id = Array.isArray(relayingParty?.id)
    ? relayingParty.id[0]
    : relayingParty?.id;

  const name = Array.isArray(relayingParty?.name)
    ? relayingParty.name[0]
    : relayingParty?.name;
  const origin = Array.isArray(relayingParty?.origin)
    ? relayingParty.origin[0]
    : relayingParty?.origin;

  return {
    id: id ?? url.hostname,
    name: name ?? url.host,
    origin: origin ?? url.origin,
  };
}
