/**
 * :::danger
 * This option is intended for framework authors.
 * :::
 *
 * Auth.js comes with built-in CSRF protection, but
 * if you are implementing a framework that is already protected against CSRF attacks, you can skip this check by
 * passing this value to {@link AuthConfig.skipCSRFCheck}.
 */
export const skipCSRFCheck = Symbol("skip-csrf-check");

/**
 * :::danger
 * This option is intended for framework authors.
 * :::
 *
 * Auth.js returns a web standard {@link Response} by default, but
 * if you are implementing a framework you might want to get access to the raw internal response
 * by passing this value to {@link AuthConfig.raw}.
 */
export const raw = Symbol("sse-return-type-raw");

/**
 * :::danger
 * This option allows you to override the default `fetch` function used by the provider
 * to make requests to the provider's OAuth endpoints directly.
 * Used incorrectly, it can have security implications.
 * :::
 *
 * It can be used to support corporate proxies, custom fetch libraries, cache discovery endpoints,
 * add mocks for testing, logging, set custom headers/params for non-spec compliant providers, etc.
 *
 *
 * @see https://undici.nodejs.org/#/docs/api/ProxyAgent?id=example-basic-proxy-request-with-local-agent-dispatcher
 * @see https://authjs.dev/guides/corporate-proxy
 */
export const customFetch = Symbol("sse-custom-fetch");

/**
 * @internal
 *
 * Used to mark some providers for processing within the core library.
 *
 * **Do not use or you will be fired.**
 */
export const conformInternal = Symbol("sse-conform-internal");
