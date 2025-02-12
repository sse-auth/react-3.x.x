import type { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/provider";

const DropboxIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    id="Layer_1"
    viewBox="0 0 42.4 39.5"
    className="-ml-1 size-4"
  >
    <style></style>
    <path
      d="M10.6 1.7 0 8.5l10.6 6.7 10.6-6.7zm21.2 0L21.2 8.5l10.6 6.7 10.6-6.7zM0 22l10.6 6.8L21.2 22l-10.6-6.8zm31.8-6.8L21.2 22l10.6 6.8L42.4 22zM10.6 31l10.6 6.8L31.8 31l-10.6-6.7z"
      style={{ fill: "#0062ff" }}
    />
  </svg>
);

export default function Dropbox(
  options: OAuthUserConfig<Record<string, any>>
): OAuthConfig<Record<string, any>> {
  return {
    id: "dropbox",
    name: "Dropbox",
    type: "oauth",
    authorization: {
      url: "https://www.dropbox.com/oauth2/authorize",
      params: {
        token_access_type: "offline",
        scope: "account_info.read",
      },
    },
    token: "https://api.dropboxapi.com/oauth2/token",
    userinfo: {
      url: "https://api.dropboxapi.com/2/users/get_current_account",
      async request({ tokens, provider }) {
        return await fetch(provider.userinfo?.url as URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        }).then(async (res) => await res.json());
      },
    },
    profile(profile) {
      return {
        id: profile.account_id,
        name: profile.name.display_name,
        email: profile.email,
        image: profile.profile_photo_url,
      };
    },
    style: { icon: <DropboxIcon /> },
    options,
  };
}

export { Dropbox, DropboxIcon };
