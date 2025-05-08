import type { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/provider";

/**
 * Corresponds to the user structure documented here:
 * https://discord.com/developers/docs/resources/user#user-object-user-structure
 */
export interface DiscordProfile extends Record<string, any> {
  /** the user's id (i.e. the numerical snowflake) */
  id: string;
  /** the user's username, not unique across the platform */
  username: string;
  /** the user's Discord-tag */
  discriminator: string;
  /** the user's display name, if it is set  */
  global_name: string | null;
  /**
   * the user's avatar hash:
   * https://discord.com/developers/docs/reference#image-formatting
   */
  avatar: string | null;
  /** whether the user belongs to an OAuth2 application */
  bot?: boolean;
  /**
   * whether the user is an Official Discord System user (part of the urgent
   * message system)
   */
  system?: boolean;
  /** whether the user has two factor enabled on their account */
  mfa_enabled: boolean;
  /**
   * the user's banner hash:
   * https://discord.com/developers/docs/reference#image-formatting
   */
  banner: string | null;

  /** the user's banner color encoded as an integer representation of hexadecimal color code */
  accent_color: number | null;

  /**
   * the user's chosen language option:
   * https://discord.com/developers/docs/reference#locales
   */
  locale: string;
  /** whether the email on this account has been verified */
  verified: boolean;
  /** the user's email */
  email: string | null;
  /**
   * the flags on a user's account:
   * https://discord.com/developers/docs/resources/user#user-object-user-flags
   */
  flags: number;
  /**
   * the type of Nitro subscription on a user's account:
   * https://discord.com/developers/docs/resources/user#user-object-premium-types
   */
  premium_type: number;
  /**
   * the public flags on a user's account:
   * https://discord.com/developers/docs/resources/user#user-object-user-flags
   */
  public_flags: number;
  /** undocumented field; corresponds to the user's custom nickname */
  display_name: string | null;
  /**
   * undocumented field; corresponds to the Discord feature where you can e.g.
   * put your avatar inside of an ice cube
   */
  avatar_decoration: string | null;
  /**
   * undocumented field; corresponds to the premium feature where you can
   * select a custom banner color
   */
  banner_color: string | null;
  /** undocumented field; the CDN URL of their profile picture */
  image_url: string;
}

const DiscordIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid"
    className="-ml-1 size-4"
    viewBox="0 0 256 199"
  >
    <path
      fill="#5865F2"
      d="M216.9 16.6A208.5 208.5 0 0 0 164 0c-2.2 4.1-4.9 9.6-6.7 14a194 194 0 0 0-58.6 0C97 9.6 94.2 4.1 92 0a207.8 207.8 0 0 0-53 16.6A221.5 221.5 0 0 0 1 165a211.2 211.2 0 0 0 65 33 161 161 0 0 0 13.8-22.8c-7.6-2.9-15-6.5-21.8-10.6l5.3-4.3a149.3 149.3 0 0 0 129.6 0c1.7 1.5 3.5 3 5.3 4.3a136 136 0 0 1-21.9 10.6c4 8 8.7 15.7 13.9 22.9a210.7 210.7 0 0 0 64.8-33.2c5.3-56.3-9-105.1-38-148.4ZM85.5 135.1c-12.7 0-23-11.8-23-26.2 0-14.4 10.1-26.2 23-26.2 12.8 0 23.2 11.8 23 26.2 0 14.4-10.2 26.2-23 26.2Zm85 0c-12.6 0-23-11.8-23-26.2 0-14.4 10.2-26.2 23-26.2 12.9 0 23.3 11.8 23 26.2 0 14.4-10.1 26.2-23 26.2Z"
    />
  </svg>
);

export default function Discord<P extends DiscordProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "discord",
    name: "Discord",
    type: "oauth",
    authorization: {
      url: "https://discord.com/api/oauth2/authorize",
      params: { scope: "identify email" },
    },
    token: "https://discord.com/api/oauth2/token",
    userinfo: "https://discord.com/api/users/@me",
    profile(profile) {
      if (profile.avatar === null) {
        const defaultAvatarNumber =
          profile.discriminator === "0"
            ? Number(BigInt(profile.id) >> BigInt(22)) % 6
            : parseInt(profile.discriminator) % 5;
        profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
      } else {
        const format = profile.avatar.startsWith("a_") ? "gif" : "png";
        profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
      }
      return {
        id: profile.id,
        name: profile.global_name ?? profile.username,
        email: profile.email,
        image: profile.image_url,
      };
    },
    style: { icon: <DiscordIcon /> },
    options,
  };
}

export { Discord, DiscordIcon };
