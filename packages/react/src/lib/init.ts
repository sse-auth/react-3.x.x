import * as jwt from "@sse-auth/backend/utils/jwt";
import * as cookie from "@sse-auth/backend/utils/cookie";
import { createCSRFToken } from "@sse-auth/backend/actions/csrf-token";
import parseProviders from "@sse-auth/backend/utils/providers";
import { merge } from "@sse-auth/backend/utils/merge";
import type {
  AuthConfig,
  InternalOptions,
  RequestInternal,
} from "@sse-auth/types/config";
import { AdapterError, EventError } from "@sse-auth/types/error";
import { Cookie } from "@sse-auth/types/cookie";

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

function generateUUID() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  } else if (
    typeof window !== "undefined" &&
    typeof window.crypto !== "undefined" &&
    typeof window.crypto.randomUUID === "function"
  ) {
    return window.crypto.randomUUID();
  } else {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }
}

/** Initialize all internal options and cookies. */
export async function init({
  authOptions: config,
  providerId,
  action,
  url,
  cookies: reqCookies,
  callbackUrl: reqCallbackUrl,
  csrfToken: reqCsrfToken,
  csrfDisabled,
  isPost,
}: InitParams): Promise<{
  options: InternalOptions;
  cookies: Cookie[];
}> {
  const logger: Console = console;
  const { providers, provider } = parseProviders({ url, providerId, config });
  const maxAge = 30 * 24 * 60 * 60; // Sessions expire after 30 days of being idle by default
  let isOnRedirectProxy = false;
  
  if (
    (provider?.type === "oauth" || provider?.type === "oidc") &&
    provider.redirectProxyUrl
  ) {
    try {
      isOnRedirectProxy =
        new URL(provider.redirectProxyUrl).origin === url.origin;
    } catch {
      throw new TypeError(
        `redirectProxyUrl must be a valid URL. Received: ${provider.redirectProxyUrl}`
      );
    }
  }

  // User provided options are overridden by other options,
  // except for the options with special handling above
  const options: InternalOptions = {
    debug: false,
    pages: {},
    theme: {
      colorScheme: "auto",
      logo: "",
      brandColor: "",
      buttonText: "",
    },
    // Custom options override defaults
    ...config,
    // These computed settings can have values in userOptions but we override them
    // and are request-specific.
    url,
    action,
    // @ts-expect-errors
    provider,
    cookies: merge(
      cookie.defaultCookies(
        config.useSecureCookies ?? url.protocol === "https:"
      ),
      config.cookies
    ),
    providers,
    // Session options
    session: {
      strategy: config.adapter ? "database" : "jwt",
      maxAge,
      updateAge: 24 * 60 * 60,
      generateSessionToken: () => generateUUID(),
      ...config.session,
    },
    // JWT Options
    jwt: {
      secret: config.secret!,
      maxAge: config.session?.maxAge ?? maxAge,
      encode: jwt.encode,
      decode: jwt.decode,
      ...config.jwt,
    },
    // Event messages
    events: eventsErrorHandler(config.events ?? {}, logger),
    adapter: adapterErrorHandler(config.adapter, logger),
    // Callback functions
    callbacks: { ...defaultCallbacks, ...config.callbacks },
    callbackUrl: url.origin,
    isOnRedirectProxy,
    experimental: {
      ...config.experimental,
    },
  };

  // Init Cookies
  const cookies: Cookie[] = [];

  if (csrfDisabled) {
    options.csrfTokenVerified = true;
  } else {
    const {
      csrfToken,
      cookie: csrfCookie,
      csrfTokenVerified,
    } = await createCSRFToken({
      options,
      cookieValue: reqCookies?.[options.cookies.csrfToken.name],
      isPost,
      bodyValue: reqCsrfToken,
    });

    options.csrfToken = csrfToken;
    options.csrfTokenVerified = csrfTokenVerified;

    if (csrfCookie) {
      cookies.push({
        name: options.cookies.csrfToken.name,
        value: csrfCookie,
        options: options.cookies.csrfToken.options,
      });
    }
  }

  return { options, cookies };
}

type Method = (...args: any[]) => Promise<any>;

/** Wraps an object of methods and adds error handling. */
function eventsErrorHandler(
  methods: Partial<InternalOptions["events"]>,
  logger: Console
): Partial<InternalOptions["events"]> {
  return Object.keys(methods).reduce<any>((acc, name) => {
    acc[name] = async (...args: any[]) => {
      try {
        const method: Method = methods[name as keyof Method];
        return await method(...args);
      } catch (e) {
        logger.error(new EventError(e as Error));
      }
    };
    return acc;
  }, {});
}

/** Handles adapter induced errors. */
function adapterErrorHandler(adapter: AuthConfig["adapter"], logger: Console) {
  if (!adapter) return;

  return Object.keys(adapter).reduce<any>((acc, name) => {
    acc[name] = async (...args: any[]) => {
      try {
        logger.debug(`adapter_${name}`, { args });
        const method: Method = adapter[name as keyof Method];
        return await method(...args);
      } catch (e) {
        const error = new AdapterError(e as Error);
        logger.error(error);
        throw error;
      }
    };
    return acc;
  }, {});
}
