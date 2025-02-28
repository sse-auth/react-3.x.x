import type { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/provider";

export interface EventbriteProfile extends Record<string, any> {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  emails: { email: string; verified: boolean; primary: boolean }[];
  image_id: string;
}

const EventbriteIcon = () => (
  <svg
    version="1.0"
    xmlns="http://www.w3.org/2000/svg"
    width="192"
    height="192"
    className="-ml-1 size-4"
    viewBox="0 0 192 192"
  >
    <g
      transform="translate(0.000000,192.000000) scale(0.100000,-0.100000)"
      fill="#F05537"
      stroke="none"
    >
      <path
        d="M828 1830 c-295 -47 -548 -238 -669 -505 -97 -215 -104 -464 -19
-683 104 -267 339 -471 621 -539 108 -26 299 -24 405 5 210 56 395 184 511
353 33 48 76 129 71 134 -2 1 -90 23 -197 48 l-194 45 -61 -62 c-33 -34 -84
-73 -112 -88 -142 -76 -316 -76 -458 0 -59 31 -173 139 -160 151 5 4 292 73
638 152 l628 144 -6 65 c-31 356 -300 669 -655 761 -87 23 -259 32 -343 19z
m247 -405 c32 -9 81 -28 109 -43 49 -26 173 -138 164 -148 -3 -2 -191 -47
-419 -100 -228 -52 -422 -97 -431 -100 -15 -4 -17 0 -12 28 3 18 21 66 40 106
94 204 329 314 549 257z"
      />
    </g>
  </svg>
);

export default function Eventbrite<P extends EventbriteProfile>(
  config: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "eventbrite",
    name: "Eventbrite",
    type: "oauth",
    authorization: {
      url: "https://www.eventbrite.com/oauth/authorize",
      params: { scope: "user.profile" },
    },
    token: "https://www.eventbrite.com/oauth/token",
    userinfo: "https://www.eventbriteapi.com/v3/users/me/",
    profile(profile) {
      return {
        id: profile.id,
        name: profile.name,
        email: profile.emails.find((e) => e.primary)?.email,
        image: profile.image_id
          ? `https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F${profile.image_id}%2F1%2Foriginal.jpg`
          : null,
      };
    },
    client: {
      token_endpoint_auth_method: "client_secret_post",
    },
    style: { icon: <EventbriteIcon /> },
    options: config,
  };
}

export { Eventbrite, EventbriteIcon };
