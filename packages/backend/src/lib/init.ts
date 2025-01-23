import * as jwt from "../utils/jwt";
import * as cookie from "../utils/cookie";
import { createCSRFToken } from "../actions/csrf-token";
import { AdapterError, EventError } from "@sse-auth/types/errors";
import parseProviders from "../utils/providers";
import { merge } from "../utils/merge";
import type {
  InternalOptions,
  RequestInternal,
  AuthConfig,
} from "@sse-auth/types/config";
import type { Cookie } from "@sse-auth/types/cookie";

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
    // @ts-expect-error
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
      updateAge: 24 * 60 * 60, // Sessions are updated every 24 hours
      generateSessionToken: () => crypto.randomUUID(),
      ...config.session,
    },
    // JWT options
    jwt: {
      secret: config.secret!,
      maxAge: config.session?.maxAge ?? maxAge,
      encode: jwt.encode,
      decode: jwt.decode,
      ...config.jwt,
    },
    // Event messages
    events: eventsErrorHandler(config.events ?? {}),
    adapter: adapterErrorHandler(config.adapter),
    // Callback functions
    callbacks: { ...defaultCallbacks, ...config.callbacks },
    callbackUrl: url.origin,
    experimental: {
      ...config.experimental,
    },
  };

  // Init cookies
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
  methods: Partial<InternalOptions["events"]>
): Partial<InternalOptions["events"]> {
  return Object.keys(methods).reduce<any>((acc, name) => {
    acc[name] = async (...args: any[]) => {
      try {
        const method: Method = methods[name as keyof Method];
        return await method(...args);
      } catch (e) {
        console.error(new EventError(e as Error));
      }
    };
    return acc;
  }, {});
}

/** Handles adapter induced errors. */
function adapterErrorHandler(adapter: AuthConfig["adapter"]) {
  if (!adapter) return;

  return Object.keys(adapter).reduce<any>((acc, name) => {
    acc[name] = async (...args: any[]) => {
      try {
        console.debug(`adapter_${name}`, { args });
        const method: Method = adapter[name as keyof Method];
        return await method(...args);
      } catch (e) {
        const error = new AdapterError(e as Error);
        console.error(error);
        throw error;
      }
    };
    return acc;
  }, {});
}
