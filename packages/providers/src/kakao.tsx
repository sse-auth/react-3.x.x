import type { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/provider";

export type DateTime = string;
export type Gender = "female" | "male";
export type Birthday = "SOLAR" | "LUNAR";
export type AgeRange =
  | "1-9"
  | "10-14"
  | "15-19"
  | "20-29"
  | "30-39"
  | "40-49"
  | "50-59"
  | "60-69"
  | "70-79"
  | "80-89"
  | "90-";

/**
 * https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#req-user-info
 * type from : https://gist.github.com/ziponia/cdce1ebd88f979b2a6f3f53416b56a77
 */
export interface KakaoProfile extends Record<string, any> {
  id: number;
  has_signed_up?: boolean;
  connected_at?: DateTime;
  synched_at?: DateTime;
  properties?: {
    id?: string;
    status?: string;
    registered_at?: DateTime;
    msg_blocked?: boolean;
    nickname?: string;
    profile_image?: string;
    thumbnail_image?: string;
  };
  kakao_account?: {
    profile_needs_agreement?: boolean;
    profile_nickname_needs_agreement?: boolean;
    profile_image_needs_agreement?: boolean;
    profile?: {
      nickname?: string;
      thumbnail_image_url?: string;
      profile_image_url?: string;
      is_default_image?: boolean;
    };
    name_needs_agreement?: boolean;
    name?: string;
    email_needs_agreement?: boolean;
    is_email_valid?: boolean;
    is_email_verified?: boolean;
    email?: string;
    age_range_needs_agreement?: boolean;
    age_range?: AgeRange;
    birthyear_needs_agreement?: boolean;
    birthyear?: string;
    birthday_needs_agreement?: boolean;
    birthday?: string;
    birthday_type?: Birthday;
    gender_needs_agreement?: boolean;
    gender?: Gender;
    phone_number_needs_agreement?: boolean;
    phone_number?: string;
    ci_needs_agreement?: boolean;
    ci?: string;
    ci_authenticated_at?: DateTime;
  };
}

const KakaoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
    <path
      fill="#FFE812"
      d="M256 236a20 20 0 0 1-20 20H20a20 20 0 0 1-20-20V20A20 20 0 0 1 20 0h216a20 20 0 0 1 20 20v216z"
    />
    <path d="M128 36C70.56 36 24 72.71 24 118c0 29.28 19.47 54.97 48.75 69.48-1.6 5.5-10.24 35.34-10.58 37.69 0 0-.21 1.76.93 2.43s2.48.15 2.48.15c3.28-.46 37.95-24.81 43.95-29.04 6 .85 12.17 1.29 18.47 1.29 57.44 0 104-36.71 104-82s-46.56-82-104-82z" />
    <path
      fill="#FFE812"
      d="M70.5 146.63c-3.3 0-6-2.57-6-5.73v-35.65h-9.36c-3.25 0-5.89-2.64-5.89-5.87s2.64-5.88 5.89-5.88h30.72a5.89 5.89 0 1 1 0 11.75H76.5v35.65c0 3.16-2.7 5.73-6 5.73zm52.61-.08c-2.5 0-4.41-1.02-5-2.65l-2.96-7.78h-18.3l-2.97 7.78c-.58 1.63-2.49 2.65-5 2.65a9.15 9.15 0 0 1-3.8-.83c-1.66-.76-3.25-2.86-1.43-8.52l14.36-37.78c1-2.87 4.08-5.83 7.99-5.92 3.91.09 6.99 3.05 8 5.93l14.34 37.76c1.83 5.67.24 7.77-1.41 8.53a9.18 9.18 0 0 1-3.82.83zM112 125.49l-6-17.02-6 17.02h12zm26 20.26a5.64 5.64 0 0 1-5.75-5.5V99.5c0-3.3 2.75-6 6.13-6s6.12 2.7 6.12 6v35.25h12.75c3.17 0 5.75 2.47 5.75 5.5s-2.58 5.5-5.75 5.5H138zm33.33.8a6 6 0 0 1-6-6V99.5a6 6 0 0 1 12 0v12.9l16.74-16.74a4.66 4.66 0 0 1 3.33-1.34c1.5 0 3 .65 4.13 1.77a5.91 5.91 0 0 1 1.77 3.8 4.68 4.68 0 0 1-1.33 3.66l-13.67 13.67 14.77 19.57a5.95 5.95 0 0 1 1.15 4.44 5.96 5.96 0 0 1-2.33 3.96 5.94 5.94 0 0 1-3.6 1.21 5.95 5.95 0 0 1-4.8-2.38l-14.07-18.65-2.08 2.08v13.1a6.01 6.01 0 0 1-6 6z"
    />
  </svg>
);

export default function Kakao<P extends KakaoProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "kakao",
    name: "Kakao",
    type: "oauth",
    authorization: "https://kauth.kakao.com/oauth/authorize?scope",
    token: "https://kauth.kakao.com/oauth/token",
    userinfo: "https://kapi.kakao.com/v2/user/me",
    client: {
      token_endpoint_auth_method: "client_secret_post",
    },
    profile(profile) {
      return {
        id: profile.id.toString(),
        name: profile.kakao_account?.profile?.nickname,
        email: profile.kakao_account?.email,
        image: profile.kakao_account?.profile?.profile_image_url,
      };
    },
    options,
    style: { icon: <KakaoIcon /> },
  };
}

export { Kakao, KakaoIcon };
