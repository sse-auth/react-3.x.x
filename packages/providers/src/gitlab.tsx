import type { OAuthConfig, OAuthUserConfig } from '@sse-auth/types/provider';
import { Gitlab as GitLabIcon } from '@sse-auth/icons';

export interface GitLabProfile extends Record<string, any> {
  id: number;
  username: string;
  email: string;
  name: string;
  state: string;
  avatar_url: string;
  web_url: string;
  created_at: string;
  bio: string;
  location?: string;
  public_email: string;
  skype: string;
  linkedin: string;
  twitter: string;
  website_url: string;
  organization: string;
  job_title: string;
  pronouns: string;
  bot: boolean;
  work_information?: string;
  followers: number;
  following: number;
  local_time: string;
  last_sign_in_at: string;
  confirmed_at: string;
  theme_id: number;
  last_activity_on: string;
  color_scheme_id: number;
  projects_limit: number;
  current_sign_in_at: string;
  identities: Array<{
    provider: string;
    extern_uid: string;
  }>;
  can_create_group: boolean;
  can_create_project: boolean;
  two_factor_enabled: boolean;
  external: boolean;
  private_profile: boolean;
  commit_email: string;
  shared_runners_minutes_limit: number;
  extra_shared_runners_minutes_limit: number;
}

export default function GitLab<P extends GitLabProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: 'gitlab',
    name: 'GitLab',
    type: 'oauth',
    authorization: 'https://gitlab.com/oauth/authorize?scope=read_user',
    token: 'https://gitlab.com/oauth/token',
    userinfo: 'https://gitlab.com/api/v4/user',
    profile(profile) {
      return {
        id: profile.sub?.toString(),
        name: profile.name ?? profile.username,
        email: profile.email,
        image: profile.avatar_url,
      };
    },
    style: {
      icon: {
        dark: <GitLabIcon />,
        light: <GitLabIcon />,
      },
    },
    options,
  };
}

export { GitLab, GitLabIcon };
