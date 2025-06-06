import { InternalOptions, ResponseInternal } from '@sse-auth/types/config';
import { Cookie } from '@sse-auth/types/cookie';
import { SignOutError } from '@sse-auth/types/error';
import { SessionStore } from '@sse-auth/utils';
/**
 * Destroys the session.
 * If the session strategy is database,
 * The session is also deleted from the database.
 * In any case, the session cookie is cleared and
 * {@link AuthConfig["events"].signOut} is emitted.
 */
export async function signOut(
  cookies: Cookie[],
  sessionStore: SessionStore,
  options: InternalOptions
): Promise<ResponseInternal> {
  const { jwt, events, callbackUrl: redirect, logger, session } = options;
  const sessionToken = sessionStore.value;
  if (!sessionToken) return { redirect, cookies };

  try {
    if (session.strategy === 'jwt') {
      const salt = options.cookies.sessionToken.name;
      const token = await jwt.decode({ ...jwt, token: sessionToken, salt });
      await events.signOut?.({ token });
    } else {
      const session = await options.adapter?.deleteSession(sessionToken);
      await events.signOut?.({ session });
    }
  } catch (e) {
    logger.error(new SignOutError(e as Error));
  }

  cookies.push(...sessionStore.clean());
  return { redirect, cookies };
}
