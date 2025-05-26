import { OAuthConfig, OAuthUserConfig } from '@sse-auth/types/provider';
import { Dailymotion as DailymotionIcon } from '@sse-auth/icons';

// Icon Pending

type GenderType = 'male' | 'female' | 'other' | 'prefer-not-to-answer';
type StatusType = 'pending-activation' | 'disabled' | 'active' | 'unknown';

/**
 * @see [Dailymotion User](https://developers.dailymotion.com/api/platform-api/reference/#user)
 * This interface represents a user's profile on Dailymotion, including various attributes related to the user.
 */
export interface DailymotionProfile {
  /**
   * Indicates whether the user is active or not.
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-active-field)
   */
  active?: 'y' | 'n';
  /**
   * The user's address.
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-address-field)
   */
  address?: string;
  /**
   * Indicates if the user has advanced statistics enabled.
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-advanced_statistics-field)
   */
  advanced_statistics?: boolean;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-avatar_25_url-field)
   */
  avatar_25_url?: string;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-avatar_60_url-field)
   */
  avatar_60_url?: string;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-avatar_80_url-field)
   */
  avatar_80_url?: string;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-avatar_120_url-field)
   */
  avatar_120_url?: string;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-avatar_190_url-field)
   */
  avatar_190_url?: string;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-avatar_240_url-field)
   */
  avatar_240_url?: string;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-avatar_360_url-field)
   */
  avatar_360_url?: string;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-avatar_480_url-field)
   */
  avatar_480_url?: string;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-avatar_720_url-field)
   */
  avatar_720_url?: string;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-avatar_url-field)
   */
  avatar_url?: string;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-ban_from_partner_program-field)
   */
  ban_from_partner_program?: boolean;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-birthday-field)
   */
  birthday?: string;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-children_total-field)
   */
  children_total?: number;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-city-field)
   */
  city?: string;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-country-field)
   */
  country?: string;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-cover_100_url-field)
   */
  cover_100_url?: string;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-cover_150_url-field)
   */
  cover_150_url?: string;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-cover_200_url-field)
   */
  cover_200_url?: string;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-cover_250_url-field)
   */
  cover_250_url?: string;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-cover_url-field)
   */
  cover_url?: string;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-created_time-field)
   */
  created_time?: Date;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-description-field)
   */
  description?: string;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-email-field)
   */
  email?: string;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-facebook_url-field)
   */
  facebook_url?: string;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-first_name-field)
   */
  first_name?: string;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-followers_total-field)
   */
  followers_total?: number;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-following_total-field)
   */
  following_total?: number;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-fullname-field)
   */
  fullname?: string;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-gender-field)
   */
  gender?: GenderType;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-googleplus_url-field)
   */
  googleplus_url?: string;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-id-field)
   */
  id?: string;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-instagram_url-field)
   */
  instagram_url?: string;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-is_following-field)
   */
  is_following?: boolean;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-item_type-field)
   */
  item_type?: string;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-language-field)
   */
  language?: string;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-last_name-field)
   */
  last_name?: string;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-limits-field)
   */
  limits?: Record<string, unknown>;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-linkedin_url-field)
   */
  linkedin_url?: string;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-parent-field)
   */
  parent?: string;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-partner-field)
   */
  partner?: boolean;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-pinterest_url-field)
   */
  pinterest_url?: string;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-playlists_total-field)
   */
  playlists_total?: number;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-reposts_total-field)
   */
  reposts_total?: number;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-revenues_claim_last_day-field)
   */
  revenues_claim_last_day?: number;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-revenues_claim_last_month-field)
   */
  revenues_claim_last_month?: number;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-revenues_claim_last_week-field)
   */
  revenues_claim_last_week?: number;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-revenues_claim_total-field)
   */
  revenues_claim_total?: number;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-revenues_paidcontent_last_day-field)
   */
  revenues_paidcontent_last_day?: number;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-revenues_paidcontent_last_month-field)
   */
  revenues_paidcontent_last_month?: number;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-revenues_paidcontent_last_week-field)
   */
  revenues_paidcontent_last_week?: number;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-revenues_paidcontent_total-field)
   */
  revenues_paidcontent_total?: number;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-revenues_video_last_day-field)
   */
  revenues_video_last_day?: number;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-revenues_video_last_month-field)
   */
  revenues_video_last_month?: number;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-revenues_video_last_week-field)
   */
  revenues_video_last_week?: number;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-revenues_video_total-field)
   */
  revenues_video_total?: number;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-revenues_website_last_day-field)
   */
  revenues_website_last_day?: number;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-revenues_website_last_month-field)
   */
  revenues_website_last_month?: number;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-revenues_website_last_week-field)
   */
  revenues_website_last_week?: number;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-revenues_website_total-field)
   */
  revenues_website_total?: number;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-screenname-field)
   */
  screenname?: string;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-status-field)
   */
  status?: StatusType;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-twitter_url-field)
   */
  twitter_url?: string;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-url-field)
   */
  url?: string;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-username-field)
   */
  username?: string;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-username_update_required-field)
   */
  username_update_required?: boolean;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-verified-field)
   */
  verified?: boolean;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-videos_total-field)
   */
  videos_total?: number;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-views_total-field)
   */
  views_total?: number;
  /**
   * @see [Reference](https://developers.dailymotion.com/api/platform-api/reference/#user-website_url-field)
   */
  website_url?: string;
}

export default function Dailymotion(
  options: OAuthUserConfig<DailymotionProfile>
): OAuthConfig<DailymotionProfile> {
  const url = 'https://api.dailymotion.com';
  return {
    id: 'dailymotion',
    name: 'Dailymotion',
    type: 'oauth',
    authorization: {
      url: `${url}/oauth/authorize`,
      params: { scope: 'read' },
    },
    token: 'https://www.dailymotion.com/oauth/token',
    userinfo: 'https://api.dailymotion.com/me',
    profile(profile) {
      return {
        id: profile.id,
        name: profile.fullname,
        email: profile.email,
        image: profile.avatar_url,
      };
    },
    checks: ['state'],
    style: {
      icon: {
        light: <DailymotionIcon />,
        dark: <DailymotionIcon />,
      },
    },
    options,
  };
}

export { Dailymotion };
