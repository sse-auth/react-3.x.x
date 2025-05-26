import { AuthAction } from '@sse-auth/types';

const actions: AuthAction[] = [
  'callback',
  'csrf',
  'error',
  'providers',
  'session',
  'signin',
  'signout',
  'verify-request',
];

export function isAuthAction(action: string): action is AuthAction {
  return actions.includes(action as AuthAction);
}

export function isValidAction(action: string): boolean {
  return actions.includes(action as AuthAction);
}
