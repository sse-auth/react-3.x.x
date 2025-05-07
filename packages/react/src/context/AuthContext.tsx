import React, { useEffect } from "react";
import { ProviderId } from "@sse-auth/types/provider/index";
import { Session } from "@sse-auth/types";
import {
  AuthConfig,
  InternalOptions,
  RequestInternal,
} from "@sse-auth/types/config";
import { skipCSRFCheck } from "@sse-auth/types/symbol";
import { init } from "@sse-auth/backend/utils/init";

interface AuthContextProps {
  user: any;
  loading: boolean;
  configInternal: InternalOptions;
  /**
   * Sign in with a provider. If no provider is specified, the user will be redirected to the sign in page.
   *
   * By default, the user is redirected to the current page after signing in. You can override this behavior by setting the `redirectTo` option with a relative path.
   *
   * @example
   * ```ts title="app/layout.tsx"
   * import { signIn } from "../auth"
   *
   * export default function Layout() {
   *  return (
   *   <form action={async () => {
   *     "use server"
   *     await signIn("github")
   *   }}>
   *    <button>Sign in with GitHub</button>
   *   </form>
   * )
   * ```
   *
   * If an error occurs during signin, an instance of {@link AuthError} will be thrown. You can catch it like this:
   * ```ts title="app/layout.tsx"
   * import { AuthError } from "next-auth"
   * import { signIn } from "../auth"
   *
   * export default function Layout() {
   *  return (
   *    <form action={async (formData) => {
   *      "use server"
   *      try {
   *        await signIn("credentials", formData)
   *     } catch(error) {
   *       if (error instanceof AuthError) // Handle auth errors
   *       throw error // Rethrow all other errors
   *     }
   *    }}>
   *     <button>Sign in</button>
   *   </form>
   *  )
   * }
   * ```
   *
   */
  signIn?: <P extends ProviderId, R extends boolean = true>(
    /** Provider to sign in to */
    provider?: P, // See: https://github.com/microsoft/TypeScript/issues/29729
    options?:
      | FormData
      | ({
          /** The relative path to redirect to after signing in. By default, the user is redirected to the current page. */
          redirectTo?: string;
          /** If set to `false`, the `signIn` method will return the URL to redirect to instead of redirecting automatically. */
          redirect?: R;
        } & Record<string, any>),
    authorizationParams?:
      | string[][]
      | Record<string, string>
      | string
      | URLSearchParams
  ) => Promise<R extends false ? any : never>;
  /**
   * Sign out the user. If the session was created using a database strategy, the session will be removed from the database and the related cookie is invalidated.
   * If the session was created using a JWT, the cookie is invalidated.
   *
   * By default the user is redirected to the current page after signing out. You can override this behavior by setting the `redirectTo` option with a relative path.
   *
   * @example
   * ```ts title="app/layout.tsx"
   * import { signOut } from "../auth"
   *
   * export default function Layout() {
   *  return (
   *   <form action={async () => {
   *     "use server"
   *     await signOut()
   *   }}>
   *    <button>Sign out</button>
   *   </form>
   * )
   * ```
   *
   *
   */
  signOut?: <R extends boolean = true>(
    /** The relative path to redirect to after signing out. By default, the user is redirected to the current page. */
    redirectTo?: string,
    /** If set to `false`, the `signOut` method will return the URL to redirect to instead of redirecting automatically. */
    redirect?: R
  ) => Promise<R extends false ? any : never>;
  unstable_update?: (
    data: Partial<Session | { user: Partial<Session["user"]> }>
  ) => Promise<Session | null>;
}

const AuthContext = React.createContext<AuthContextProps | undefined>(
  undefined
);

export const AuthProvider: React.FC<
  React.PropsWithChildren<{ config: AuthConfig; request: RequestInternal }>
> = ({ config, children, request }) => {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [options, setOptions] = React.useState<InternalOptions>({});
  const csrfDisabled = config.skipCSRFCheck === skipCSRFCheck;

  const {  } = init({ authOptions: config });

  return (
    <AuthContext.Provider value={{ user, loading, configInternal: options }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useLocalization must be used within a LocalizationProvider"
    );
  }
  return context;
};
