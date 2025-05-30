import type { OAuthConfig, OAuthUserConfig } from '@sse-auth/types/provider';
import { Yandex as YandexIcon } from '@sse-auth/icons';

/**
 * - {@link https://yandex.com/dev/id/doc/en/user-information | Getting information about the user}
 * - {@link https://yandex.com/dev/id/doc/en/user-information#email-access | Access to email address}
 * - {@link https://yandex.com/dev/id/doc/en/user-information#avatar-access | Access to the user's profile picture}
 * - {@link https://yandex.com/dev/id/doc/en/user-information#birthday-access | Access to the date of birth}
 * - {@link https://yandex.com/dev/id/doc/en/user-information#name-access | Access to login, first name, last name, and gender}
 * - {@link https://yandex.com/dev/id/doc/en/user-information#phone-access | Access to the phone number}
 */
export interface YandexProfile {
  /** User's Yandex login. */
  login: string;
  /** Yandex user's unique ID. */
  id: string;
  /**
   * The ID of the app the OAuth token in the request was issued for.
   * Available in the [app properties](https://oauth.yandex.com/). To open properties, click the app name.
   */
  client_id: string;
  /** Authorized Yandex user ID. It is formed on the Yandex side based on the `client_id` and `user_id` pair. */
  psuid: string;
  /** An array of the user's email addresses. Currently only includes the default email address. */
  emails?: string[];
  /** The default email address for contacting the user. */
  default_email?: string;
  /**
   * Indicates that the stub (profile picture that is automatically assigned when registering in Yandex)
   * ID is specified in the `default_avatar_id` field.
   */
  is_avatar_empty?: boolean;
  /**
   * ID of the Yandex user's profile picture.
   * Format for downloading user avatars: `https://avatars.yandex.net/get-yapic/<default_avatar_id>/<size>`
   * @example "https://avatars.yandex.net/get-yapic/31804/BYkogAC6AoB17bN1HKRFAyKiM4-1/islands-200"
   * Available sizes:
   * `islands-small`: 28×28 pixels.
   * `islands-34`: 34×34 pixels.
   * `islands-middle`: 42×42 pixels.
   * `islands-50`: 50×50 pixels.
   * `islands-retina-small`: 56×56 pixels.
   * `islands-68`: 68×68 pixels.
   * `islands-75`: 75×75 pixels.
   * `islands-retina-middle`: 84×84 pixels.
   * `islands-retina-50`: 100×100 pixels.
   * `islands-200`: 200×200 pixels.
   */
  default_avatar_id?: string;
  /**
   * The user's date of birth in YYYY-MM-DD format.
   * Unknown elements of the date are filled in with zeros, such as: `0000-12-23`.
   * If the user's date of birth is unknow, birthday will be `null`
   */
  birthday?: string | null;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  /**
   * The first and last name that the user specified in Yandex ID.
   * Non-Latin characters of the first and last names are presented in Unicode format.
   */
  real_name?: string;
  /** User's gender. `null` Stands for unknown or unspecified gender. Will be `undefined` if not provided by Yandex. */
  sex?: 'male' | 'female' | null;
  /**
   * The default phone number for contacting the user.
   * The API can exclude the user's phone number from the response at its discretion.
   * The field contains the following parameters:
   * id: Phone number ID.
   * number: The user's phone number.
   */
  default_phone?: { id: number; number: string };
}

export default function Yandex(
  options: OAuthUserConfig<YandexProfile>
): OAuthConfig<YandexProfile> {
  return {
    id: 'yandex',
    name: 'Yandex',
    type: 'oauth',
    /** @see [Data access](https://yandex.com/dev/id/doc/en/register-client#access) */
    authorization: 'https://oauth.yandex.ru/authorize?scope=login:info+login:email+login:avatar',
    token: 'https://oauth.yandex.ru/token',
    userinfo: 'https://login.yandex.ru/info?format=json',
    profile(profile) {
      return {
        id: profile.id,
        name: profile.display_name ?? profile.real_name ?? profile.first_name,
        email: profile.default_email ?? profile.emails?.[0] ?? null,
        image:
          !profile.is_avatar_empty && profile.default_avatar_id
            ? `https://avatars.yandex.net/get-yapic/${profile.default_avatar_id}/islands-200`
            : null,
      };
    },
    style: {
      icon: {
        dark: <YandexIcon />,
        light: <YandexIcon />,
      },
    },
    options,
  };
}

export { Yandex };
