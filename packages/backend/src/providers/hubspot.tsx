import type { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/provider";

interface HubSpotProfile extends Record<string, any> {
  // https://legacydocs.hubspot.com/docs/methods/oauth2/get-access-token-information
  user: string;
  user_id: string;
  hub_domain: string;
  hub_id: string;
}

const HubspotIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="-ml-1 size-4"
    viewBox="6.21 0.64 244.27 251.25"
  >
    <path
      fill="#ff7a59"
      d="M191.39 85.7V56.18a22.72 22.72 0 0 0 13.1-20.48v-.68a22.72 22.72 0 0 0-22.73-22.72h-.67a22.72 22.72 0 0 0-22.73 22.72v.68a22.72 22.72 0 0 0 13.1 20.48v29.5a64.34 64.34 0 0 0-30.59 13.47L59.95 36.13a25 25 0 0 0 .91-6.37A25.6 25.6 0 1 0 35.23 55.3a25.32 25.32 0 0 0 12.6-3.43l79.7 62a64.54 64.54 0 0 0 .98 72.7l-24.24 24.25c-1.96-.63-4-.96-6.06-.99a21.02 21.02 0 1 0 21.05 21.04 20.75 20.75 0 0 0-1-6.05l23.98-23.99A64.65 64.65 0 1 0 191.38 85.7m-9.93 97.05a33.17 33.17 0 1 1 0-66.32 33.17 33.17 0 0 1 .03 66.3"
    />
  </svg>
);

export default function HubSpot<P extends HubSpotProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "hubspot",
    name: "HubSpot",
    type: "oauth",
    authorization: {
      url: "https://app.hubspot.com/oauth/authorize",
      params: { scope: "oauth", client_id: options.clientId },
    },
    client: {
      token_endpoint_auth_method: "client_secret_post",
    },
    token: "https://api.hubapi.com/oauth/v1/token",
    userinfo: {
      url: "https://api.hubapi.com/oauth/v1/access-tokens",
      async request({ tokens, provider }) {
        const url = `${provider.userinfo?.url}/${tokens.access_token}`;

        return await fetch(url, {
          headers: { "Content-Type": "application/json" },
          method: "GET",
        }).then(async (res) => await res.json());
      },
    },
    profile(profile) {
      return {
        id: profile.user_id,
        name: profile.user,
        email: profile.user,

        // TODO: get image from profile once it's available
        // Details available https://community.hubspot.com/t5/APIs-Integrations/Profile-photo-is-not-retrieved-with-User-API/m-p/325521
        image: null,
      };
    },
    style: { icon: <HubspotIcon /> },
    options,
  };
}

export { HubSpot, HubspotIcon };
