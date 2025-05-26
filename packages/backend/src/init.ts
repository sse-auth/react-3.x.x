import * as jwt from './utils/jwt.js';
import * as cookie from './utils/cookie.js';

import { AdapterError, EventError } from '@sse-auth/types/error';
import parseProviders from './utils/providers.js';
import { setLogger, type LoggerInstance } from '@sse-auth/types/logger';
import { merge } from './utils/merge.js';

import type { InternalOptions, RequestInternal } from '@sse-auth/types/config';
import type { AuthConfig } from '@sse-auth/types/config';
import { Cookie } from '@sse-auth/types/cookie';

interface InitParams {
  url: URL;
  authOptions: AuthConfig;
  providerId?: string;
  action: InternalOptions['action'];
  /** Callback URL value extracted from the incoming request. */
  callbackUrl?: string;
  /** CSRF token value extracted from the incoming request. From body if POST, from query if GET */
  csrfToken?: string;
  /** Is the incoming request a POST request? */
  csrfDisabled: boolean;
  isPost: boolean;
  cookies: RequestInternal['cookies'];
}

export const defaultCallbacks: InternalOptions['callbacks'] = {
  signIn() {
    return true;
  },
  redirect({ url, baseUrl }) {
    if (url.startsWith('/')) return `${baseUrl}${url}`;
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
  const logger = setLogger(config);
  const { providers, provider } = parseProviders({ url, providerId, config });
  const maxAge = 30 * 24 * 60 * 60; // 30 days
  let isOnRedirectProxy = false;

  if ((provider?.type === 'oauth' || provider?.type === 'oidc') && provider?.redirectProxyUrl) {
    try {
      isOnRedirectProxy = new URL(provider.redirectProxyUrl).origin === url.origin;
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
      colorScheme: 'auto',
      logo: '',
      brandColor: '',
      buttonText: '',
    },
    ...config,
    url,
    action,
    // @ts-expect-error
    provider,
    cookies: merge(
      cookie.defaultCookies(config.useSecureCookies ?? url.protocol === 'https:'),
      config.cookies
    ),
    providers,
    session: {
      strategy: config.adapter ? 'database' : 'jwt',
      maxAge,
      updateAge: 24 * 60 * 60, // 24 hours
      generateSessionToken: () => crypto.randomUUID(),
      ...config.session,
    },
    jwt: {
      secret: config.secret!,
      maxAge: config.session?.maxAge ?? maxAge,
      encode: jwt.encode,
      decode: jwt.decode,
    },
    events: eventsErrorHandler(config.events ?? {}, logger),
    adapter: adapterErrorHandler(config.adapter, logger),
    callbacks: { ...defaultCallbacks, ...config.callbacks },
    logger,
    callbackUrl: url.origin,
    isOnRedirectProxy,
    experimental: {
      ...config.experimental,
    },
  };

  const cookies: Cookie[] = [];

  if (csrfDisabled) {
    options.csrfTokenVerified = true;
  }

  return { options, cookies };
}

type Method = (...args: any[]) => Promise<any>;

/** Wraps an object of methods and adds error handling. */
function eventsErrorHandler(
  methods: Partial<InternalOptions['events']>,
  logger: LoggerInstance
): Partial<InternalOptions['events']> {
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
function adapterErrorHandler(adapter: AuthConfig['adapter'], logger: LoggerInstance) {
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
