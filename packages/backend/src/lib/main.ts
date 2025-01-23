import { AuthConfig } from "@sse-auth/types/config";
import { raw } from "@sse-auth/types/symbol";
import { toInternalRequest } from "../utils/web";
import { assertConfig } from "../utils/assert";

export async function Auth(
  request: Request,
  config: AuthConfig & { raw: typeof raw }
): Promise<Response>;

export async function Auth(
  request: Request,
  config: Omit<AuthConfig, "raw">
): Promise<Response>;

/**
 * Core functionality provided by Auth.js.
 *
 * Receives a standard {@link Request} and returns a {@link Response}.
 *
 * @example
 * ```ts
 * import { Auth } from "@auth/core"
 *
 * const request = new Request("https://example.com")
 * const response = await Auth(request, {
 *   providers: [Google],
 *   secret: "...",
 *   trustHost: true,
 * })
 *```
 * @see [Documentation](https://authjs.dev)
 */
export async function Auth(request: Request, config: AuthConfig) {
  const internalRequest = await toInternalRequest(request, config);
  // There was an error parsing the request
  if (!internalRequest) return Response.json(`Bad request.`, { status: 400 });

//   const warningsOrError = assertConfig(internalRequest, config);
//   if (Array.isArray(warningsOrError)) {
//     // warningsOrError.forEach()
//   } else if ()
}
