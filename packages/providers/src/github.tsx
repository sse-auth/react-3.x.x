import type { OAuthConfig, OAuthUserConfig } from '@sse-auth/types/provider';
import { GitHubDark, GitHubLight } from '@sse-auth/icons';

export interface GitHubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: 'public' | 'private';
}

/** @see [Get the authenticated user](https://docs.github.com/en/rest/users/users#get-the-authenticated-user) */
export interface GitHubProfile {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string | null;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  hireable: boolean | null;
  bio: string | null;
  twitter_username?: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  private_gists?: number;
  total_private_repos?: number;
  owned_private_repos?: number;
  disk_usage?: number;
  suspended_at?: string | null;
  collaborators?: number;
  two_factor_authentication: boolean;
  plan?: {
    collaborators: number;
    name: string;
    space: number;
    private_repos: number;
  };
  [claim: string]: unknown;
}

export default function Github(
  config: OAuthUserConfig<GitHubProfile> & {
    /** Configuration for usage with [GitHub Enterprise Server](https://docs.github.com/en/enterprise-server/get-started). */
    enterprise?: {
      /** The base URL of your GitHub Enterprise Server instance. */
      baseUrl?: string;
    };
  }
): OAuthConfig<GitHubProfile> {
  const baseUrl = config?.enterprise?.baseUrl ?? 'https://github.com';
  const apiBaseUrl = config?.enterprise?.baseUrl
    ? `${config?.enterprise?.baseUrl}/api/v3`
    : 'https://api.github.com';

  return {
    id: 'github',
    name: 'Github',
    type: 'oauth',
    authorization: {
      url: `${baseUrl}/login/oauth/authorize`,
      params: { scope: 'read:user user:email' },
    },
    token: `${baseUrl}/login/oauth/access_token`,
    userinfo: `${apiBaseUrl}/user`,
    // style: {
    //   logo: <GithubIcon />,
    // },
    options: config,
    profile(profile) {
      return {
        id: profile.id.toString(),
        name: profile.name ?? profile.login,
        email: profile.email,
        image: profile.avatar_url,
      };
    },
    style: {
      icon: {
        dark: <GitHubDark />,
        light: <GitHubLight />,
      },
    },
  };
}

export { Github };
