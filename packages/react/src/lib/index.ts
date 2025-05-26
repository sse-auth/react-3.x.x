import type { AuthConfig, RequestInternal, ResponseInternal } from '@sse-auth/types/config';
import { skipCSRFCheck } from '@sse-auth/types/symbol';
import { init } from './init';
import renderPage from 'src/page';
import * as actions from '@sse-auth/backend/actions/index';
import { SessionStore } from '@sse-auth/backend/utils/cookie';
import { UnknownAction } from '@sse-auth/types/error';
import { validateCSRF } from '@sse-auth/backend/actions/csrf-token';

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
    isPost: method === 'POST',
    csrfDisabled,
  });

  const sessionStore = new SessionStore(options.cookies.sessionToken, request.cookies, console);

  if (method === 'GET') {
    const render = renderPage({ ...options, query: request.query, cookies });
    switch (action) {
      case 'callback':
        return await actions.callback(request, options, sessionStore, cookies);
      case 'csrf':
        return render.csrf(csrfDisabled, options, cookies);
      case 'error':
        return render.error(error);
      case 'providers':
        return render.providers(options.providers);
      case 'session':
        return await actions.session(options, sessionStore, cookies);
      case 'signin':
        return render.signin(providerId, error);
      case 'signout':
        return render.signout();
      case 'verify-request':
        return render.verifyRequest();
      case 'webauthn-options':
        return await actions.webAuthnOptions(request, options, sessionStore, cookies);
      default:
    }
  } else {
    const { csrfTokenVerified } = options;
    switch (action) {
      case 'callback':
        if (options.provider.type === 'credentials')
          // Verified CSRF Token required for credentials providers only
          validateCSRF(action, csrfTokenVerified);
        return await actions.callback(request, options, sessionStore, cookies);
      case 'session':
        validateCSRF(action, csrfTokenVerified);
        return await actions.session(options, sessionStore, cookies, true, request.body?.data);
      case 'signin':
        validateCSRF(action, csrfTokenVerified);
        return await actions.signIn(request, cookies, options);

      case 'signout':
        validateCSRF(action, csrfTokenVerified);
        return await actions.signOut(cookies, sessionStore, options);
      default:
    }
  }
  throw new UnknownAction(`Cannot handle action: ${action}`);
}
