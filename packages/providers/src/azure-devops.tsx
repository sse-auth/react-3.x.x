import { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/provider";
import { AzureIcon } from "./azure-ad-b2c";

/** @see [Azure DevOps Services REST API 7.0 · Profiles · Get](https://learn.microsoft.com/en-us/rest/api/azure/devops/profile/profiles/get?view=azure-devops-rest-7.0&tabs=HTTP#examples) */
export interface AzureDevOpsProfile extends Record<string, any> {
  id: string;
  displayName: string;
  emailAddress: string;
  coreAttributes: { Avatar: { value: { value: string } } };
}

export default function AzureDevOpsProvider<P extends AzureDevOpsProfile>(
  options: OAuthUserConfig<P> & {
    /**
     * https://docs.microsoft.com/en-us/azure/devops/integrate/get-started/authentication/oauth?view=azure-devops#scopes
     * @default vso.profile
     */
    scope?: string;
  }
): OAuthConfig<P> {
  const scope = options.scope ?? "vso.profile";
  const tokenEndpointUrl =
    "https://app.vssps.visualstudio.com/oauth2/authorize";
  const userInfoEndpointUrl =
    "https://app.vssps.visualstudio.com/_apis/profile/profiles/me?details=true&coreAttributes=Avatar&api-version=6.0";

  return {
    id: "azure-devops",
    name: "Azure DevOps",
    type: "oauth",

    authorization: {
      url: "https://app.vssps.visualstudio.com/oauth2/authorize",
      params: { response_type: "Assertion", scope },
    },

    token: {
      url: tokenEndpointUrl,
      async request(context) {
        const params = new URLSearchParams();
        params.append(
          "client_assertion_type",
          "urn:ietf:params:oauth:client-assertion-type:jwt-bearer"
        );
        params.append(
          "client_assertion",
          context.provider.clientSecret as string
        );
        params.append(
          "grant_type",
          "urn:ietf:params:oauth:grant-type:jwt-bearer"
        );
        params.append("assertion", context.params.code as string);
        params.append("redirect_uri", "");
        const response = await fetch(tokenEndpointUrl, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          method: "POST",
          body: params,
        });
        return { tokens: await response.json() };
      },
    },

    userinfo: {
      url: userInfoEndpointUrl,
      async request(context) {
        const accessToken = context.tokens.access_token as string;
        const response = await fetch(userInfoEndpointUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        return response.json();
      },
    },

    profile(profile) {
      return {
        id: profile.id,
        name: profile.displayName,
        email: profile.emailAddress,
        image: `data:image/jpeg;base64,${profile.coreAttributes.Avatar.value.value}`,
      };
    },

    options,
    style: {
      icon: <AzureIcon />,
    },
  };
}

export { AzureDevOpsProvider };
