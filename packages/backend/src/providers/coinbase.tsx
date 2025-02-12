import type { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/provider";

const CoinbaseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    version="1.2"
    viewBox="0 0 1527 1551"
    className="-ml-1 size-4"
  >
    <defs>
      <clipPath id="cp1" clipPathUnits="userSpaceOnUse">
        <path d="M0-600.5h12041.2V1551H0z" />
      </clipPath>
    </defs>
    <style></style>
    <g id="Clip-Path" clipPath="url(#cp1)">
      <path
        id="Layer"
        d="M350.4 777.1c0 259.8 176.7 453.3 428.7 453.3 182.5 0 327.4-115.5 379.5-283h365.1c-66.7 361-367.9 603.6-744.5 603.6C333.2 1551 0 1221.8 0 777.1 0 332.3 341.8.2 779.2.2c385.2 0 680.6 242.6 747.3 600.6h-367.9c-55-167.5-199.8-280.1-382.3-280.1-252 0-425.8 193.5-425.9 456.4z"
        style={{ fill: "#0052ff" }}
      />
    </g>
  </svg>
);

export default function Coinbase(
  options: OAuthUserConfig<Record<string, any>>
): OAuthConfig<Record<string, any>> {
  return {
    id: "coinbase",
    name: "Coinbase",
    type: "oauth",
    authorization:
      "https://login.coinbase.com/oauth2/auth?scope=wallet:user:email+wallet:user:read",
    token: "https://login.coinbase.com/oauth2/token",
    userinfo: "https://api.coinbase.com/v2/user",
    profile(profile) {
      return {
        id: profile.data.id,
        name: profile.data.name,
        email: profile.data.email,
        image: profile.data.avatar_url,
      };
    },
    options,
    style: { icon: <CoinbaseIcon /> },
  };
}

export { Coinbase, CoinbaseIcon };
