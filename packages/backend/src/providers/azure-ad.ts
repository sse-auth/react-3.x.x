import {
  MicrosoftEntraID,
  MicrosoftEntraIDProfile,
} from "./microsoft-entra-id.js";

export type AzureADProfile = MicrosoftEntraIDProfile;

export default function AzureAD(
  config: Parameters<typeof MicrosoftEntraID>[0]
): ReturnType<typeof MicrosoftEntraID> {
  return {
    ...MicrosoftEntraID(config),
    id: "azure-ad",
    name: "Azure Active Directory",
  };
}

export { AzureAD }