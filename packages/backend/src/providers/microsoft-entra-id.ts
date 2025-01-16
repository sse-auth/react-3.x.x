import type { OIDCConfig, OIDCUserConfig } from "@sse-auth/types/oauth";
import { customFetch, conformInternal } from "@sse-auth/types/symbol";

export interface MicrosoftEntraIDProfile extends Record<string, any> {
  sub: string;
  nickname: string;
  email: string;
  picture: string;
}

export default function MicrosoftEntraID(
  config: OIDCUserConfig<MicrosoftEntraIDProfile> & {
    /**
     * https://learn.microsoft.com/en-us/graph/api/profilephoto-get?view=graph-rest-1.0&tabs=http#examples
     *
     * @default 48
     */
    profilePhotoSize?: 48 | 64 | 96 | 120 | 240 | 360 | 432 | 504 | 648;
  }
): OIDCConfig<MicrosoftEntraIDProfile> {
  const { profilePhotoSize = 48 } = config;
  config.issuer ??= "https://login.microsoftonline.com/common/v2.0";

  return {
    id: "microsoft-entra-id",
    name: "Microsoft Entra ID",
    type: "oidc",
    authorization: { params: { scope: "openid profile email User.Read" } },
    async profile(profile, tokens) {
      // https://learn.microsoft.com/en-us/graph/api/profilephoto-get?view=graph-rest-1.0&tabs=http#examples
      const response = await fetch(
        `https://graph.microsoft.com/v1.0/me/photos/${profilePhotoSize}x${profilePhotoSize}/$value`,
        { headers: { Authorization: `Bearer ${tokens.access_token}` } }
      );

      // Confirm that profile photo was returned
      let image;
      // TODO: Do this without Buffer
      if (response.ok && typeof Buffer !== "undefined") {
        try {
          const pictureBuffer = await response.arrayBuffer();
          const pictureBase64 = Buffer.from(pictureBuffer).toString("base64");
          image = `data:image/jpeg;base64, ${pictureBase64}`;
        } catch {}
      }

      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: image ?? null,
      };
    },
    async [customFetch](...args) {
      const url = new URL(args[0] instanceof Request ? args[0].url : args[0]);
      if (url.pathname.endsWith(".well-known/openid-configuration")) {
        const response = await fetch(...args);
        const json = await response.clone().json();
        const tenantRe = /microsoftonline\.com\/(\w+)\/v2\.0/;
        const tenantId = config.issuer?.match(tenantRe)?.[1] ?? "common";
        const issuer = json.issuer.replace("{tenantid}", tenantId);
        return Response.json({ ...json, issuer });
      }
      return fetch(...args);
    },
    [conformInternal]: true,
    options: config,
  };
}

export { MicrosoftEntraID };
