import { JWTSessionError, SessionTokenError } from '@sse-auth/types/error';
import { fromDate, SessionStore } from '@sse-auth/utils';

import type { Adapter } from '@sse-auth/types/adapter';
import type { InternalOptions, ResponseInternal } from '@sse-auth/types/config';
import type { Session } from '@sse-auth/types';
import { Cookie } from '@sse-auth/types/cookie';

export async function session(
  options: InternalOptions,
  sessionStore: SessionStore,
  cookies: Cookie[],
  isUpdate?: boolean,
  newSession?: any
): Promise<ResponseInternal<Session | null>> {
  const {
    adapter,
    jwt,
    events,
    callbacks,
    logger,
    session: { strategy: sessionStrategy, maxAge: sessionMaxAge },
  } = options;

  const response: ResponseInternal<Session | null> = {
    body: null,
    headers: {
      'Content-Type': 'application/json',
      ...(!isUpdate && {
        'Cache-Control': 'private, no-cache, no-store',
        Expires: '0',
        Pragma: 'no-cache',
      }),
    },
    cookies,
  };

  const sessionToken = sessionStore.value;
  if (!sessionToken) return response;

  if (sessionStrategy === 'jwt') {
    try {
      const salt = options.cookies.sessionToken.name;
      const payload = await jwt.decode({ ...jwt, token: sessionToken, salt });
      if (!payload) throw new Error('Invalid JWT');

      // @ts-expect-error
      const token = await callbacks.jwt({
        token: payload,
        ...(isUpdate && { trigger: 'update' }),
        session: newSession,
      });

      const newExpires = fromDate(sessionMaxAge);

      if (token !== null) {
        // By default, only exposes a limited subset of information to the client
        // as needed for presentation purposes (e.g. "you are logged in as...").
        const session = {
          user: { name: token.name, email: token.email, image: token.picture },
          expires: newExpires.toISOString(),
        };

        // @ts-expect-error
        const newSession = await callbacks.session({ session, token });

        // Return session payload as response
        response.body = newSession;

        // Refresh JWT expiry by re-signing it, with an updated expiry date
        const newToken = await jwt.encode({ ...jwt, token, salt });

        // Set cookie, to also update expiry date on cookie
        const sessionCookies = sessionStore.chunk(newToken, {
          expires: newExpires,
        });

        response.cookies?.push(...sessionCookies);

        await events.session?.({ session: newSession, token });
      } else {
        response.cookies?.push(...sessionStore.clean());
      }
    } catch (e) {
      logger.error(new JWTSessionError(e as Error));
      // If the JWT is not verifiable remove the broken session cookie(s).
      response.cookies?.push(...sessionStore.clean());
    }

    return response;
  }

  // Retrieve session from database
  try {
    const { getSessionAndUser, deleteSession, updateSession } = adapter as Required<Adapter>;
    let userAndSession = await getSessionAndUser(sessionToken);

    // If session has expired, clean up the database
    if (userAndSession && userAndSession.session.expires.valueOf() < Date.now()) {
      await deleteSession(sessionToken);
      userAndSession = null;
    }

    if (userAndSession) {
      const { user, session } = userAndSession;

      const sessionUpdateAge = options.session.updateAge;
      // Calculate last updated date to throttle write updates to database
      // Formula: ({expiry date} - sessionMaxAge) + sessionUpdateAge
      //     e.g. ({expiry date} - 30 days) + 1 hour
      const sessionIsDueToBeUpdatedDate =
        session.expires.valueOf() - sessionMaxAge * 1000 + sessionUpdateAge * 1000;

      const newExpires = fromDate(sessionMaxAge);
      // Trigger update of session expiry date and write to database, only
      // if the session was last updated more than {sessionUpdateAge} ago
      if (sessionIsDueToBeUpdatedDate <= Date.now()) {
        await updateSession({
          sessionToken: sessionToken,
          expires: newExpires,
        });
      }

      // Pass Session through to the session callback
      const sessionPayload = await callbacks.session({
        // TODO: user already passed below,
        // remove from session object in https://github.com/nextauthjs/next-auth/pull/9702
        // @ts-expect-error
        session: { ...session, user },
        user,
        newSession,
        ...(isUpdate ? { trigger: 'update' } : {}),
      });

      // Return session payload as response
      response.body = sessionPayload;

      // Set cookie again to update expiry
      response.cookies?.push({
        name: options.cookies.sessionToken.name,
        value: sessionToken,
        options: {
          ...options.cookies.sessionToken.options,
          expires: newExpires,
        },
      });

      // @ts-expect-error
      await events.session?.({ session: sessionPayload });
    } else if (sessionToken) {
      // If `sessionToken` was found set but it's not valid for a session then
      // remove the sessionToken cookie from browser.
      response.cookies?.push(...sessionStore.clean());
    }
  } catch (e) {
    logger.error(new SessionTokenError(e as Error));
  }

  return response;
}
