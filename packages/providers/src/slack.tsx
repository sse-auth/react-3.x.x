import type { OAuthConfig, OAuthUserConfig } from '@sse-auth/types/provider';
import { Slack as SlackIcon } from '@sse-auth/icons';

export interface SlackProfile extends Record<string, any> {
  ok: boolean;
  sub: string;
  'https://slack.com/user_id': string;
  'https://slack.com/team_id': string;
  email: string;
  email_verified: boolean;
  date_email_verified: number;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  locale: string;
  'https://slack.com/team_name': string;
  'https://slack.com/team_domain': string;
  'https://slack.com/user_image_24': string;
  'https://slack.com/user_image_32': string;
  'https://slack.com/user_image_48': string;
  'https://slack.com/user_image_72': string;
  'https://slack.com/user_image_192': string;
  'https://slack.com/user_image_512': string;
  'https://slack.com/user_image_1024': string;
  'https://slack.com/team_image_34': string;
  'https://slack.com/team_image_44': string;
  'https://slack.com/team_image_68': string;
  'https://slack.com/team_image_88': string;
  'https://slack.com/team_image_102': string;
  'https://slack.com/team_image_132': string;
  'https://slack.com/team_image_230': string;
  'https://slack.com/team_image_default': boolean;
}

export default function Slack<P extends SlackProfile>(options: OAuthUserConfig<P>): OAuthConfig<P> {
  return {
    id: 'slack',
    name: 'Slack',
    type: 'oidc',
    issuer: 'https://slack.com',
    checks: ['nonce'],
    style: {
      icon: {
        dark: <SlackIcon />,
        light: <SlackIcon />,
      },
    },
    options,
  };
}

export { Slack };
