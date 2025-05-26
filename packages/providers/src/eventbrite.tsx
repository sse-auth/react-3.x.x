import type { OAuthConfig, OAuthUserConfig } from '@sse-auth/types/provider';
import { Eventbrite as EventbriteIcon } from '@sse-auth/icons';

export interface EventbriteProfile extends Record<string, any> {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  emails: { email: string; verified: boolean; primary: boolean }[];
  image_id: string;
}

export default function Eventbrite<P extends EventbriteProfile>(
  config: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: 'eventbrite',
    name: 'Eventbrite',
    type: 'oauth',
    authorization: {
      url: 'https://www.eventbrite.com/oauth/authorize',
      params: { scope: 'user.profile' },
    },
    token: 'https://www.eventbrite.com/oauth/token',
    userinfo: 'https://www.eventbriteapi.com/v3/users/me/',
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
      token_endpoint_auth_method: 'client_secret_post',
    },
    style: {
      icon: {
        dark: <EventbriteIcon />,
        light: <EventbriteIcon />,
      },
    },
    options: config,
  };
}

export { Eventbrite };
