import type { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/oauth";

/**
 * [User](https://developers.facebook.com/docs/threads/reference/user)
 */
export interface ThreadsProfile {
  data: {
    /**
     * Unique identifier of this user. This is returned as a string in order to avoid complications with languages and tools
     * that cannot handle large integers.
     */
    id: string;
    /**
     * The Threads handle (username) of this user.
     *
     * To return this field, add `fields=username` in the authorization request's query parameter.
     */
    username?: string;
    /**
     * The URL to the profile image for this user, as shown on the user's profile.
     *
     * To return this field, add `fields=threads_profile_picture_url` in the authorization request's query parameter.
     */
    threads_profile_picture_url?: string;
    /**
     * The text of this user's profile biography (also known as bio), if the user provided one.
     *
     * To return this field, add `fields=threads_biography` in the authorization request's query parameter.
     */
    threads_biography?: string;
  };
}

export default function Threads(
  config: OAuthUserConfig<ThreadsProfile>
): OAuthConfig<ThreadsProfile> {
  return {
    id: "threads",
    name: "Threads",
    type: "oauth",
    checks: ["state"],
    authorization: "https://threads.net/oauth/authorize?scope=threads_basic",
    token: "https://graph.threads.net/oauth/access_token",
    userinfo:
      "https://graph.threads.net/v1.0/me?fields=id,username,threads_profile_picture_url",
    client: {
      token_endpoint_auth_method: "client_secret_post",
    },
    profile({ data }) {
      return {
        id: data.id,
        name: data.username || null,
        email: null,
        image: data.threads_profile_picture_url || null,
      };
    },
    // style: { bg: "#000", text: "#fff" },
    options: config,
  };
}

export { Threads }
