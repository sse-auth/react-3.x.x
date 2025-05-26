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
) {
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
    } catch (error) {}
  }
}
