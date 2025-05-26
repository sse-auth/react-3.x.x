import type { OAuthConfig, OAuthUserConfig } from '@sse-auth/types/provider';
import { customFetch } from '@sse-auth/types/symbol';
import { Tiktok as TiktokIcon } from '@sse-auth/icons';

/**
 * [More info](https://developers.tiktok.com/doc/tiktok-api-v2-get-user-info/)
 */
export interface TiktokProfile {
  data: {
    user: {
      /**
       * The unique identification of the user in the current application.Open id
       * for the client.
       *
       * To return this field, add `fields=open_id` in the user profile request's query parameter.
       */
      open_id: string;
      /**
       * The unique identification of the user across different apps for the same developer.
       * For example, if a partner has X number of clients,
       * it will get X number of open_id for the same TikTok user,
       * but one persistent union_id for the particular user.
       *
       * To return this field, add `fields=union_id` in the user profile request's query parameter.
       */
      union_id?: string;
      /**
       * User's profile image.
       *
       * To return this field, add `fields=avatar_url` in the user profile request's query parameter.
       */
      avatar_url: string;
      /**
       * User`s profile image in 100x100 size.
       *
       * To return this field, add `fields=avatar_url_100` in the user profile request's query parameter.
       */
      avatar_url_100?: string;
      /**
       * User's profile image with higher resolution
       *
       * To return this field, add `fields=avatar_url_100` in the user profile request's query parameter.
       */
      avatar_large_url?: string;
      /**
       * User's profile name
       *
       * To return this field, add `fields=display_name` in the user profile request's query parameter.
       */
      display_name: string;
      /**
       * User's username.
       *
       * To return this field, add `fields=username` in the user profile request's query parameter.
       */
      username: string;
      /** @note Email is currently unsupported by TikTok  */
      email?: string;
      /**
       * User's bio description if there is a valid one.
       *
       * To return this field, add `fields=bio_description` in the user profile request's query parameter.
       */
      bio_description?: string;
      /**
       * The link to user's TikTok profile page.
       *
       * To return this field, add `fields=profile_deep_link` in the user profile request's query parameter.
       */
      profile_deep_link?: string;
      /**
       * Whether TikTok has provided a verified badge to the account after confirming
       * that it belongs to the user it represents.
       *
       * To return this field, add `fields=is_verified` in the user profile request's query parameter.
       */
      is_verified?: boolean;
      /**
       * User's followers count.
       *
       * To return this field, add `fields=follower_count` in the user profile request's query parameter.
       */
      follower_count?: number;
      /**
       * The number of accounts that the user is following.
       *
       * To return this field, add `fields=following_count` in the user profile request's query parameter.
       */
      following_count?: number;
      /**
       * The total number of likes received by the user across all of their videos.
       *
       * To return this field, add `fields=likes_count` in the user profile request's query parameter.
       */
      likes_count?: number;
      /**
       * The total number of publicly posted videos by the user.
       *
       * To return this field, add `fields=video_count` in the user profile request's query parameter.
       */
      video_count?: number;
    };
  };
  error: {
    /**
     * The error category in string.
     */
    code: string;
    /**
     * The error message in string.
     */
    message: string;
    /**
     * The error message in string.
     */
    log_id: string;
  };
}

export default function TikTok(
  options: OAuthUserConfig<TiktokProfile>
): OAuthConfig<TiktokProfile> {
  return {
    async [customFetch](...args) {
      const url = new URL(args[0] instanceof Request ? args[0].url : args[0]);
      if (url.pathname.endsWith('/token/')) {
        const [url, request] = args;

        const customHeaders = {
          ...request?.headers,
          'content-type': 'application/x-www-form-urlencoded',
        };

        const customBody = new URLSearchParams(request?.body as string);
        customBody.append('client_key', options.clientId!);
        const response = await fetch(url, {
          ...request,
          headers: customHeaders,
          body: customBody.toString(),
        });
        const json = await response.json();
        return Response.json({ ...json });
      }
      return fetch(...args);
    },
    id: 'tiktok',
    name: 'TikTok',
    type: 'oauth',
    client: {
      token_endpoint_auth_method: 'client_secret_post',
    },
    authorization: {
      url: 'https://www.tiktok.com/v2/auth/authorize',
      params: {
        client_key: options.clientId,
        scope: 'user.info.profile',
      },
    },

    token: 'https://open.tiktokapis.com/v2/oauth/token/',
    userinfo:
      'https://open.tiktokapis.com/v2/user/info/?fields=open_id,avatar_url,display_name,username',

    profile(profile) {
      return {
        id: profile.data.user.open_id,
        name: profile.data.user.display_name,
        image: profile.data.user.avatar_url,
        email: profile.data.user.email || profile.data.user.username || null,
      };
    },
    style: {
      icon: {
        dark: <TiktokIcon />,
        light: <TiktokIcon />,
      },
    },
    options,
  };
}

export { TikTok };
