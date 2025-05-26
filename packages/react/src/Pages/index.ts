import { renderToString } from 'react-dom/server';
import ErrorPage from './Error';

export interface PublicProvider {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
}
