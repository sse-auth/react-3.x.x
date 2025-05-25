import { AzureIcon } from "./azure-ad-b2c";
import {
  MicrosoftEntraID,
  MicrosoftEntraIDProfile,
} from "./microsoft-entra-id";

export type AzureADProfile = MicrosoftEntraIDProfile;

export default function AzureAD(
  config: Parameters<typeof MicrosoftEntraID>[0]
): ReturnType<typeof MicrosoftEntraID> {
  return {
    ...MicrosoftEntraID(config),
    id: "azure-ad",
    name: "Azure Active Directory",
    style: {
      icon: {
        dark: <AzureIcon />,
        light: <AzureIcon />,
      }
    },
  };
}

export { AzureAD };
