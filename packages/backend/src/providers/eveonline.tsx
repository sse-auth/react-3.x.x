import type { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/provider";

export interface EVEOnlineProfile extends Record<string, any> {
  CharacterID: number;
  CharacterName: string;
  ExpiresOn: string;
  Scopes: string;
  TokenType: string;
  CharacterOwnerHash: string;
  IntellectualProperty: string;
}

const EveonlineIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    className="-ml-1 size-5"
    viewBox="0 0 198.4 78.7"
  >
    <path d="M0 0v13.9h11v-3.6h49.7V0H0zm65.8 0 33.4 58 33.4-58h-11.9L99.2 37.2 77.7 0H65.9zm72 0v13.9h10.9v-3.6h49.7V0h-60.6zM0 19.1v10.4h60.7V19H0zm137.8 0v10.4h60.6V19h-60.6zM0 34.7v13.9h60.7V38.2H11v-3.5H0zm137.8 0v13.9h60.6V38.2h-49.7v-3.5h-10.9zm-95.6 35c-.9 0-1.5.2-1.8.5-.3.3-.4.8-.4 1.6v4.8c0 .8.1 1.3.4 1.6.3.3 1 .5 1.8.5h6.5c.9 0 1.5-.2 1.8-.5.3-.3.5-.8.5-1.6v-4.8c0-.8-.2-1.3-.5-1.6-.3-.3-1-.5-1.8-.5h-6.5zm22.2 0v9h1.8v-6.3l.3.4.4.4 6.6 5.5h1.4v-9H73V75l.1 1-.4-.4-.6-.5-6.3-5.3h-1.4zm24.1 0v9h8.8V77h-6.7v-7.3h-2zm20.9 0v9h2.1v-9h-2.1zm15.7 0v9h1.9v-4.9l-.1-.6v-.8l.3.4.4.4 6.6 5.5h1.4v-9h-1.8V76l-.4-.4-.6-.5-6.3-5.3h-1.4zm24.2 0v9h9.2V77h-7.2v-2.2h4.1v-1.5h-4.1v-2h7.1v-1.6h-9.1zM42 71.3h7V77h-7v-5.7z" />
  </svg>
);

export default function EVEOnline<P extends EVEOnlineProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "eveonline",
    name: "EVE Online",
    type: "oauth",
    authorization:
      "https://login.eveonline.com/v2/oauth/authorize?scope=publicData",
    token: "https://login.eveonline.com/v2/oauth/token",
    userinfo: "https://login.eveonline.com/oauth/verify",
    checks: ["state"],
    profile(profile) {
      return {
        id: String(profile.CharacterID),
        name: profile.CharacterName,
        email: null,
        image: `https://image.eveonline.com/Character/${profile.CharacterID}_128.jpg`,
      };
    },
    options,
    style: { icon: <EveonlineIcon /> },
  };
}

export { EVEOnline, EveonlineIcon };
