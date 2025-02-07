import * as jwt from "@sse-auth/backend/utils/jwt";
import * as cookie from "@sse-auth/backend/utils/cookie";
import { AdapterError, EventError } from "@sse-auth/types/error";
import parseProvider from "@sse-auth/backend/utils/providers";
import type {
  InternalOptions,
  RequestInternal,
  AuthConfig,
} from "@sse-auth/backend";
import type { Cookie } from "@sse-auth/types/cookie";
// import { createCSRFToken } from "@sse-auth/types/actions/csrf-token";

interface InitParams {
  url: URL;
  authOptions: AuthConfig;
  providerId?: string;
  action: InternalOptions["action"];
  /** Callback URL value extracted from the incoming request. */
  callbackUrl?: string;
  /** CSRF token value extracted from the incoming request. From body if POST, from query if GET */
  csrfToken?: string;
  /** Is the incoming request a POST request? */
  csrfDisabled: boolean;
  isPost: boolean;
  cookies: RequestInternal["cookies"];
}

export const defaultCallbacks: InternalOptions["callbacks"] = {
  signIn() {
    return true;
  },
  redirect({ url, baseUrl }) {
    if (url.startsWith("/")) return `${baseUrl}${url}`;
    else if (new URL(url).origin === baseUrl) return url;
    return baseUrl;
  },
  session({ session }) {
    return {
      user: {
        name: session.user?.name,
        email: session.user?.email,
        image: session.user?.image,
      },
      expires: session.expires?.toISOString?.() ?? session.expires,
    };
  },
  jwt({ token }) {
    return token;
  },
};

export async function init({
  authOptions: config,
  providerId,
  action,
  url,
  cookies: reqCookies,
  csrfDisabled,
  isPost,
  csrfToken: reqCsrfToken,
}: InitParams) {
  const {} = parseProvider({ url, providerId, config });
  const maxAge = 30 * 24 * 60 * 60; // Sessions expire after 30 days of being idle by default
  let isOnRedirectProxy = false;
}
