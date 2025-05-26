import { OAuthConfig, OAuthUserConfig } from '@sse-auth/types/provider';
import { Bitbucket as BitBucketIcon } from '@sse-auth/icons';

type LiteralUnion<T extends U, U = string> = T | (U & Record<never, never>);

/**
 * @see https://developer.atlassian.com/cloud/bitbucket/rest/api-group-users/#api-user-get
 */
export interface BitbucketProfile {
  display_name: string;
  links: Record<
    LiteralUnion<'self' | 'avatar' | 'repositories' | 'snippets' | 'html' | 'hooks'>,
    { href?: string }
  >;
  created_on: string;
  type: string;
  uuid: string;
  has_2fa_enabled: boolean | null;
  username: string;
  is_staff: boolean;
  account_id: string;
  nickname: string;
  account_status: string;
  location: string | null;
}

export default function BitBucket(
  options: OAuthUserConfig<BitbucketProfile>
): OAuthConfig<BitbucketProfile> {
  return {
    id: 'bitbucket',
    name: 'Bitbucket',
    type: 'oauth',
    authorization: {
      url: 'https://bitbucket.org/site/oauth2/authorize',
      params: {
        scope: 'account',
      },
    },
    token: 'https://bitbucket.org/site/oauth2/access_token',
    userinfo: 'https://api.bitbucket.org/2.0/user',
    profile(profile) {
      return {
        name: profile.display_name ?? profile.username,
        id: profile.account_id,
        image: profile.links.avatar?.href,
      };
    },
    options,
    style: {
      icon: {
        dark: <BitBucketIcon />,
        light: <BitBucketIcon />,
      },
    },
  };
}

export { BitBucket, BitBucketIcon };
