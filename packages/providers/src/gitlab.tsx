import type { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/provider";

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

const GitLabIcon = () => (
  <svg
    className="-ml-1 size-5"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="94 97.5 192.1 185"
  >
    <defs></defs>
    <path
      d="m282.8 170.7-.2-.7-26.2-68.2a6.8 6.8 0 0 0-2.7-3.2 7 7 0 0 0-8 .4 7 7 0 0 0-2.3 3.5l-17.6 54h-71.5l-17.7-54a6.9 6.9 0 0 0-2.3-3.5 7 7 0 0 0-8-.4 6.9 6.9 0 0 0-2.7 3.2L97.4 170l-.2.7a48.5 48.5 0 0 0 16 56l.2.2.2.1 39.8 29.8 19.7 15 12 9a8 8 0 0 0 9.8 0l12-9 19.7-15 40-30h.1a48.6 48.6 0 0 0 16.1-56Z"
      style={{ fill: "#e24329" }}
    />
    <path
      d="m282.8 170.7-.2-.7a88.3 88.3 0 0 0-35.2 15.8L190 229.2a53007 53007 0 0 0 36.6 27.7l40-30h.1a48.6 48.6 0 0 0 16.1-56.2Z"
      style={{ fill: "#fc6d26" }}
    />
    <path
      d="m153.4 256.9 19.7 14.9 12 9a8 8 0 0 0 9.8 0l12-9 19.7-15-36.6-27.6-36.6 27.7Z"
      style={{ fill: "#fca326" }}
    />
    <path
      d="M132.6 185.8A88.2 88.2 0 0 0 97.4 170l-.2.7a48.5 48.5 0 0 0 16 56l.2.2.2.1 39.8 29.8 36.6-27.6Z"
      style={{ fill: "#fc6d26" }}
    />
  </svg>
);

export default function GitLab<P extends GitLabProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "gitlab",
    name: "GitLab",
    type: "oauth",
    authorization: "https://gitlab.com/oauth/authorize?scope=read_user",
    token: "https://gitlab.com/oauth/token",
    userinfo: "https://gitlab.com/api/v4/user",
    profile(profile) {
      return {
        id: profile.sub?.toString(),
        name: profile.name ?? profile.username,
        email: profile.email,
        image: profile.avatar_url,
      };
    },
    style: { icon: <GitLabIcon /> },
    options,
  };
}

export { GitLab, GitLabIcon };
