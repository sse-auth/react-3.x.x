import type { CommonProviderOptions } from "@sse-auth/types";
import type { Awaitable, User } from "@sse-auth/types";
import type { JSX } from "react";

/**
 * Besides providing type safety inside {@link CredentialsConfig.authorize}
 * it also determines how the credentials input fields will be rendered
 * on the default sign in page.
 */
export interface CredentialInput
  extends Partial<JSX.IntrinsicElements["input"]> {
  label?: string;
}

/** The Credentials Provider needs to be configured. */
export interface CredentialsConfig<
  CredentialsInputs extends Record<string, CredentialInput> = Record<
    string,
    CredentialInput
  >
> extends CommonProviderOptions {
  type: "credentials";
  credentials: CredentialInput;
  /**
   * Gives full control over how you handle the credentials received from the user.
   *
   * :::warning
   * There is no validation on the user inputs by default, so make sure you do so
   * by a popular library like [Zod](https://zod.dev)
   * :::
   *
   * This method expects a `User` object to be returned for a successful login.
   *
   * If an `CredentialsSignin` is thrown or `null` is returned, two things can happen:
   * 1. The user is redirected to the login page, with `error=CredentialsSignin&code=credentials` in the URL. `code` is configurable, see below.
   * 2. If you throw this error in a framework that handles form actions server-side, this error is thrown by the login form action, so you'll need to handle it there.
   *
   * In case of 1., generally, we recommend not hinting if the user for example gave a wrong username or password specifically,
   * try rather something like "invalid-credentials". Try to be as generic with client-side errors as possible.
   *
   * To customize the error code, you can create a custom error that extends {@link CredentialsSignin} and throw it in `authorize`.
   *
   * @example
   * ```ts
   * class CustomError extends CredentialsSignin {
   *  code = "custom_error"
   * }
   * // URL will contain `error=CredentialsSignin&code=custom_error`
   * ```
   *
   * @example
   * ```ts
   * async authorize(credentials, request) { // you have access to the original request as well
   *   if(!isValidCredentials(credentials)) {
   *      throw new CustomError()
   *   }
   *   return await getUser(credentials) // assuming it returns a User or null
   * }
   * ```
   */
  authorize: (
    /**
     * The available keys are determined by {@link CredentialInput}.
     *
     * @note The existence/correctness of a field cannot be guaranteed at compile time,
     * so you should always validate the input before using it.
     *
     * You can add basic validation depending on your use case,
     * or you can use a popular library like [Zod](https://zod.dev) for example.
     */
    credentials: Partial<Record<keyof CredentialsInputs, unknown>>,
    /** The original request. */
    request: Request
  ) => Awaitable<User | null>;
}

export type CredentialsProviderId = "credentials";

export default function Credentials<
  CredentialsInputs extends Record<string, CredentialInput> = Record<
    string,
    CredentialInput
  >
>(config: Partial<CredentialsConfig<CredentialsInputs>>): CredentialsConfig {
  return {
    id: "credentials",
    name: "Credentials",
    type: "credentials",
    credentials: {},
    authorize: () => null,
    // @ts-expect-error
    options: config,
  };
}

export { Credentials }
