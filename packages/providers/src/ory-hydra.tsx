import type { OIDCConfig, OIDCUserConfig } from "@sse-auth/types/provider";
import { HydraDark, HydraLight } from "@sse-auth/icons";

export interface OryHydraProfile extends Record<string, any> {
  iss: string;
  ver: string;
  sub: string;
  aud: string;
  iat: string;
  exp: string;
  jti: string;
  amr: string;
  email?: string;
}

export default function OryHydra<P extends OryHydraProfile>(
  options: OIDCUserConfig<P>
): OIDCConfig<P> {
  return {
    id: "hydra",
    name: "Hydra",
    type: "oidc",
    style: {
      icon: {
        dark: <HydraDark />,
        light: <HydraLight />,
      },
    },
    options,
  };
}

export { OryHydra };
