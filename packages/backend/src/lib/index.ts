import { UnknownAction } from "@sse-auth/types/errors";
import { SessionStore } from "../utils/cookie";
import { init } from "./init";
import * as actions from "../actions";
import { validateCSRF } from "../actions/csrf-token";
import type {
  RequestInternal,
  ResponseInternal,
  AuthConfig,
} from "@sse-auth/types/config";
import { skipCSRFCheck } from "@sse-auth/types/symbol";
export { conformInternal, raw, skipCSRFCheck } from "@sse-auth/types/symbol";

/** @internal */
export async function AuthInternal(
  request: RequestInternal,
  authOptions: AuthConfig
): Promise<ResponseInternal> {
  const { action, providerId, error, method } = request;
  const csrfDisabled = authOptions.skipCSRFCheck === skipCSRFCheck;
  const { options, cookies } = await init({
    authOptions,
    action,
    providerId,
    url: request.url,
    callbackUrl: request.body?.callbackUrl ?? request.query?.callbackUrl,
    csrfToken: request.body?.csrfToken,
    cookies: request.cookies,
    isPost: method === "POST",
    csrfDisabled,
  });

  const sessionStore = new SessionStore(
    options.cookies.sessionToken,
    request.cookies,
    options.logger
  );

  if (method === "POST") {
    const { csrfTokenVerified } = options;
    switch (action) {
      case "callback":
        if (options.provider.type === "credentials")
          // Verified CSRF Token required for credentials providers only
          validateCSRF(action, csrfTokenVerified);
        return await actions.callback(request, options, sessionStore, cookies);
      case "session":
        validateCSRF(action, csrfTokenVerified);
        return await actions.session(
          options,
          sessionStore,
          cookies,
          true,
          request.body?.data
        );
      case "signin":
        validateCSRF(action, csrfTokenVerified);
        return await actions.signOut(cookies, sessionStore, options);
      default:
    }
  }
  throw new UnknownAction(`Cannot handle action: ${action}`);
}
