import type { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/provider";

export interface AuthentikProfile extends Record<string, any> {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  iat: number;
  auth_time: number;
  acr: string;
  c_hash: string;
  nonce: string;
  at_hash: string;
  email: string;
  email_verified: boolean;
  name: string;
  given_name: string;
  family_name: string;
  preferred_username: string;
  nickname: string;
  groups: string[];
}

const AuthentikIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    id="Layer_1"
    data-name="Layer 1"
    viewBox="0 0 1000 1000"
    className="-ml-1 size-3.5"
  >
    <defs></defs>
    <rect
      width="35"
      height="100"
      x="546.7"
      y="275.3"
      style={{ fill: "#fd4b2d" }}
    />
    <rect
      width="35"
      height="78.2"
      x="637.7"
      y="271.1"
      style={{ fill: "#fd4b2d" }}
    />
    <path
      d="M127.6 385.3a127.6 127.6 0 0 0-112 67h59.2c26.3-22.8 64.4-29.4 92 0h62.8c-24.5-33.2-61.2-67-102-67Z"
      style={{ fill: "#fd4b2d" }}
    />
    <path
      d="M212.4 512.5C130.6 683.6-13 537.8 74.8 452.2H15.5c-46.5 81.1 17.8 190.5 112.1 188 73 0 133.2-108.3 133.2-127.4 0-8.5-11.7-34.3-31.2-60.6h-62.8c20.8 18.9 39 46.4 45.6 60.3Zm2.2-5Z"
      style={{ fill: "#fd4b2d" }}
    />
    <path
      d="M1000 274.1V726c0 86.6-70.5 157-157.1 157h-66.7V729.2H458V883h-66.7c-86.6 0-157-70.5-157-157V583.7H739V312.1H495.2v152.7h-261V274a151.3 151.3 0 0 1 1-18 154.4 154.4 0 0 1 3.9-21.1 196 196 0 0 1 1.9-6.7 13.7 13.7 0 0 1 .5-1.6l1-3.2 1.2-3.3 1.4-3.6c.4-1.2 1-2.3 1.5-3.5a159 159 0 0 1 14.2-26.5l.2-.2a196.4 196.4 0 0 1 13-16.6l4.7-5.1.2-.2a36.5 36.5 0 0 1 2.7-2.7 159.8 159.8 0 0 1 18.6-15.6l5.6-3.8 6.4-3.9a143.1 143.1 0 0 1 16.7-8.5 152.8 152.8 0 0 1 18.4-6.6 144.4 144.4 0 0 1 10.8-2.8 158.5 158.5 0 0 1 21.3-3.1l3.1-.2h1.5c2.4-.2 4.8-.2 7.2-.2H843c2.4 0 4.8 0 7.2.2h1.5l3 .2a158.3 158.3 0 0 1 21.4 3l3.6.9c2.5.6 4.9 1.2 7.3 2a152.8 152.8 0 0 1 18.3 6.6 149.8 149.8 0 0 1 23.1 12.4l5.6 3.8a157.5 157.5 0 0 1 21.5 18.5l4.7 5a311.4 311.4 0 0 1 8.6 10.5l4.4 6.2.2.2a159.7 159.7 0 0 1 14.3 26.5l1.4 3.5 1.4 3.6 1.1 3.3c.3 1.2.7 2 1.1 3.2a15.7 15.7 0 0 1 .5 1.6l2 6.7A156 156 0 0 1 999 256a151.3 151.3 0 0 1 1 18Z"
      style={{ fill: "#fd4b2d" }}
    />
    <path
      d="M973.3 186.6H260.8A157 157 0 0 1 391.2 117h451.7a157 157 0 0 1 130.4 69.5Z"
      style={{ fill: "#fd4b2d" }}
    />
    <path
      d="M999 256.1H235.1a155.4 155.4 0 0 1 25.6-69.5h712.5a155.3 155.3 0 0 1 25.6 69.5Z"
      style={{ fill: "#fd4b2d" }}
    />
    <path
      d="M1000 274.1v51.5H738.9v-13.5H495.2v13.5H234.1v-51.5a153.4 153.4 0 0 1 1-18H999a151.3 151.3 0 0 1 1.1 18Z"
      style={{ fill: "#fd4b2d" }}
    />
    <rect
      width="261.1"
      height="69.5"
      x="234.1"
      y="325.6"
      style={{ fill: "#fd4b2d" }}
    />
    <rect
      width="261.1"
      height="69.5"
      x="738.9"
      y="325.6"
      style={{ fill: "#fd4b2d" }}
    />
    <rect
      width="261.1"
      height="69.5"
      x="234.1"
      y="395.2"
      style={{ fill: "#fd4b2d" }}
    />
    <rect
      width="261.1"
      height="69.5"
      x="738.9"
      y="395.2"
      style={{ fill: "#fd4b2d" }}
    />
  </svg>
);

export default function Authentik<P extends AuthentikProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "authentik",
    name: "Authentik",
    type: "oidc",
    options,
    style: {
      icon: <AuthentikIcon />,
    },
  };
}

export { Authentik, AuthentikIcon };
