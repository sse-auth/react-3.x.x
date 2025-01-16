import type { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/oauth";

export interface BattleNetProfile extends Record<string, any> {
  sub: string;
  battle_tag: string;
}

/** See the [available regions](https://develop.battle.net/documentation/guides/regionality-and-apis) */
export type BattleNetIssuer =
  | "https://oauth.battle.net"
  | "https://oauth.battlenet.com.cn"
  | "https://www.battlenet.com.cn/oauth"
  | `https://${"us" | "eu" | "kr" | "tw"}.battle.net/oauth`;

export default function BattleNet<P extends BattleNetProfile>(
  options: OAuthUserConfig<P> & { issuer: BattleNetIssuer }
): OAuthConfig<P> {
  return {
    id: "battlenet",
    name: "Battle.net",
    type: "oidc",
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.battle_tag,
        email: null,
        image: null,
      };
    },
    options,
  };
}

export { BattleNet }