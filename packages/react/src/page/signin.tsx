import { SignInError } from '@sse-auth/types/error';
import { webauthnScript } from '@sse-auth/backend/utils/webauthn-client';
import { Theme } from '@sse-auth/types';
import { InternalProvider } from '@sse-auth/types/config';

/** TODO: Check if all these are used/correct */
export type SignInPageErrorParam =
  | 'Signin'
  | 'OAuthSignin'
  | 'OAuthCallbackError'
  | 'OAuthCreateAccount'
  | 'EmailCreateAccount'
  | 'Callback'
  | 'OAuthAccountNotLinked'
  | 'EmailSignin'
  | 'CredentialsSignin'
  | 'SessionRequired';

const signinErrors: Record<SignInPageErrorParam | 'default', string> = {
  default: 'Unable to sign in.',
  Signin: 'Try signing in with a different account.',
  OAuthSignin: 'Try signing in with a different account.',
  OAuthCallbackError: 'Try signing in with a different account.',
  OAuthCreateAccount: 'Try signing in with a different account.',
  EmailCreateAccount: 'Try signing in with a different account.',
  Callback: 'Try signing in with a different account.',
  OAuthAccountNotLinked:
    'To confirm your identity, sign in with the same account you used originally.',
  EmailSignin: 'The e-mail could not be sent.',
  CredentialsSignin: 'Sign in failed. Check the details you provided are correct.',
  SessionRequired: 'Please sign in to access this page.',
};

function ConditionalUIScript(providerID: string) {
  const startConditonalUIScript = `
        const currentURL = window.location.href;
        const authURL = currentURL.substring(0, currentURL.lastIndexOf('/'));
        (${webauthnScript})(authURL, "${providerID}");
    `;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: startConditonalUIScript }}></script>
    </>
  );
}

export default function SigninPage(props: {
  csrfToken?: string;
  providers?: InternalProvider[];
  callbackUrl?: string;
  email?: string;
  error?: SignInPageErrorParam;
  theme?: Theme;
}) {
  const { csrfToken, providers = [], callbackUrl, theme, email, error: errorType } = props;

  if (typeof document !== 'undefined' && theme?.brandColor) {
    document.documentElement.style.setProperty('--brand-color', theme.brandColor);
  }

  if (typeof document !== 'undefined' && theme?.buttonText) {
    document.documentElement.style.setProperty('--button-text-color', theme.buttonText);
  }

  const error = errorType && (signinErrors[errorType] ?? signinErrors.default);
  const conditionalUIProviderID = providers.find(
    (provider) => provider.type === 'webauthn' && provider.enableConditionalUI
  )?.id;

  // return ()
}
