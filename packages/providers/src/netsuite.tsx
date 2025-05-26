import type { OAuthConfig, OAuthUserConfig } from '@sse-auth/types/provider';
import { Netsuite as NetSuiteIcon } from '@sse-auth/icons';

export interface OAuthNetSuiteOptions {
  /**
   *  The prompt options - also viewable below
   *
   *  @link https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_160855585734.html
   *
   * 	authorization.params.prompt
   *
   * The optional prompt parameter provides additional control of when the login/consent screen appears. Following are the values you can use with the prompt parameter:
   * "none" - the consent screen does not appear. If there is no active session, the application returns an error.
   * "login" - the user must authenticate even if there is an active session.
   * This option only works if the application sends the request to the account-specific domain.
   * "consent" - the consent screen appears every time. The user must authenticate if there is no active session.
   * login consent or consent login - the consent screen appears every time, and the user must authenticate even if there is an active session and allow the connection to the NetSuite. Similar to GitHub, Google, and Facebook data consent screens.
   */
  prompt: string | 'none' | 'login' | 'consent';
  /**
   * EX: TSTDRV1234567 or 81555 for prod
   */
  accountID: string;
  /**
   * restlets rest_webservices or restlets or rest_webservices suiteanalytics_connect restlets
   */
  scope: string;
  /**
   * Either a restlet or suitelet returning runtime info or record info -> RESTlet recommended
   */
  userinfo: string;
}

export interface NetSuiteProfile {
  // Main N/runtime.getCurrentUser() object return
  id: number;
  name: string;
  email: string;
  location: number;
  role: number;
  roleId?: string;
  roleCenter?: string;
  contact?: number;
  subsidiary?: number;
  department?: number;
}

export default function NetSuite<P extends NetSuiteProfile>(
  config: OAuthUserConfig<P> & OAuthNetSuiteOptions
): OAuthConfig<P> {
  const { accountID } = config;

  return {
    id: 'netsuite',
    name: 'NetSuite',
    type: 'oauth',
    checks: ['state'],
    authorization: {
      url: `https://${accountID}.app.netsuite.com/app/login/oauth2/authorize.nl`,
      params: { scope: 'restlets rest_webservices' },
    },
    token: `https://${accountID}.suitetalk.api.netsuite.com/services/rest/auth/oauth2/v1/token`,
    profile(profile) {
      // This is the default runtime.getCurrentUser() object returned from the RESTlet or SUITELet
      return {
        id: profile.id.toString(),
        name: profile.name,
        email: profile.email,
        image: null,
      };
    },
    style: {
      icon: {
        dark: <NetSuiteIcon />,
        light: <NetSuiteIcon />,
      },
    },
    options: config,
  };
}

export { NetSuite };
