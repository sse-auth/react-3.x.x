import { conformInternal, customFetch } from "@sse-auth/types/symbol";
import { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/provider";

/** The returned user profile from Apple when using the profile callback. */
export interface AppleProfile extends Record<string, any> {
  /**
   * The issuer registered claim identifies the principal that issued the identity token.
   * Since Apple generates the token, the value is `https://appleid.apple.com`.
   */
  iss: "https://appleid.apple.com";
  /**
   * The audience registered claim identifies the recipient for which the identity token is intended.
   * Since the token is meant for your application, the value is the `client_id` from your developer account.
   */
  aud: string;
  /**
   * The issued at registered claim indicates the time at which Apple issued the identity token,
   * in terms of the number of seconds since Epoch, in UTC.
   */
  iat: number;

  /**
   * The expiration time registered identifies the time on or after which the identity token expires,
   * in terms of number of seconds since Epoch, in UTC.
   * The value must be greater than the current date/time when verifying the token.
   */
  exp: number;
  /**
   * The subject registered claim identifies the principal that's the subject of the identity token.
   * Since this token is meant for your application, the value is the unique identifier for the user.
   */
  sub: string;
  /**
   * A String value used to associate a client session and the identity token.
   * This value mitigates replay attacks and is present only if passed during the authorization request.
   */
  nonce: string;

  /**
   * A Boolean value that indicates whether the transaction is on a nonce-supported platform.
   * If you sent a nonce in the authorization request but don't see the nonce claim in the identity token,
   * check this claim to determine how to proceed.
   * If this claim returns true, you should treat nonce as mandatory and fail the transaction;
   * otherwise, you can proceed treating the nonce as options.
   */
  nonce_supported: boolean;

  /**
   * A String value representing the user's email address.
   * The email address is either the user's real email address or the proxy address,
   * depending on their status private email relay service.
   */
  email: string;

  /**
   * A String or Boolean value that indicates whether the service has verified the email.
   * The value of this claim is always true, because the servers only return verified email addresses.
   * The value can either be a String (`"true"`) or a Boolean (`true`).
   */
  email_verified: "true" | true;

  /**
   * A String or Boolean value that indicates whether the email shared by the user is the proxy address.
   * The value can either be a String (`"true"` or `"false"`) or a Boolean (`true` or `false`).
   */
  is_private_email: boolean | "true" | "false";

  /**
   * An Integer value that indicates whether the user appears to be a real person.
   * Use the value of this claim to mitigate fraud. The possible values are: 0 (or Unsupported), 1 (or Unknown), 2 (or LikelyReal).
   * For more information, see [`ASUserDetectionStatus`](https://developer.apple.com/documentation/authenticationservices/asuserdetectionstatus).
   * This claim is present only on iOS 14 and later, macOS 11 and later, watchOS 7 and later, tvOS 14 and later;
   * the claim isn't present or supported for web-based apps.
   */
  real_user_status: 0 | 1 | 2;

  /**
   * A String value representing the transfer identifier used to migrate users to your team.
   * This claim is present only during the 60-day transfer period after an you transfer an app.
   * For more information, see [Bringing New Apps and Users into Your Team](https://developer.apple.com/documentation/sign_in_with_apple/bringing_new_apps_and_users_into_your_team).
   */
  transfer_sub: string;
  at_hash: string;
  auth_time: number;
  user?: AppleNonConformUser;
}

/**
 * This is the shape of the `user` query parameter that Apple sends the first
 * time the user consents to the app.
 * @see https://developer.apple.com/documentation/sign_in_with_apple/request_an_authorization_to_the_sign_in_with_apple_server#4066168
 */
export interface AppleNonConformUser {
  name: {
    firstName: string;
    lastName: string;
  };
  email: string;
}

const AppleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="4 32 376.4 449.4"
    className="-ml-1 size-3.5 fill-current dark:text-white"
  >
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5a106 106 0 0 0-67.9 34.9 95.7 95.7 0 0 0-25.6 71.9c26.1 2 49.9-11.4 69.5-34.3z" />
  </svg>
);

export default function Apple(
  config: OAuthUserConfig<AppleProfile>
): OAuthConfig<AppleProfile> {
  return {
    id: "apple",
    name: "Apple",
    type: "oidc",
    issuer: "https://appleid.apple.com",
    authorization: {
      params: {
        scope: "name email", // https://developer.apple.com/documentation/sign_in_with_apple/clientconfigi/3230955-scope
        response_mode: "form_post",
      },
    },
    // We need to parse the special `user` parameter the first time the user consents to the app.
    // It adds the `name` object to the `profile`, with `firstName` and `lastName` fields.
    [conformInternal]: true,
    profile(profile) {
      const name = profile.user
        ? `${profile.user.name.firstName} ${profile.user.name.lastName}`
        : profile.email;
      return {
        id: profile.sub,
        name: name,
        email: profile.email,
        image: null,
      };
    },
    // Apple does not provide a userinfo endpoint.
    async [customFetch](...args): Promise<Response> {
      const url = new URL(args[0] instanceof Request ? args[0].url : args[0]);
      if (url.pathname.endsWith(".well-known/openid-configuration")) {
        const response: Response = await fetch(...args);
        const json: Record<string, any> = await response.clone().json();
        return Response.json({
          ...json,
          userinfo_endpoint: "https://appleid.apple.com/fake_endpoint",
        });
      }
      return fetch(...args);
    },
    client: { token_endpoint_auth_method: "client_secret_post" },
    checks: ["nonce", "state"],
    options: config,
    style: {
      icon: <AppleIcon />,
    },
  };
}

export { Apple, AppleIcon };
