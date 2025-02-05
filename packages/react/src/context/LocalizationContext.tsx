import React from "react";
import { Localization } from "@sse-auth/types/localization";

type LocalizationContextType = {
  localization: Localization;
  setLocalisation: (lang: string) => void;
  availableLocalizations: Localization[];
};

const LocalizationContext = React.createContext<LocalizationContextType>({
  localization: {} as Localization,
  setLocalisation: () => {},
  availableLocalizations: [],
});

// Create a Provider component that wraps your app and makes the localization object available to any child component that calls the useLocalization hook.
export const LocalizationProvider: React.FC<
  React.PropsWithChildren<{ localizations: Localization[] }>
> = ({ children, localizations }) => {
  const [currentLangId, setCurrentLangId] = React.useState<string>(
    localizations[0].id
  );
  const localization =
    localizations.find((loc) => loc.id === currentLangId) || localizations[0];

  const setLocalisation = (lang: string) => {
    setCurrentLangId(lang);
  };

  return (
    <LocalizationContext.Provider
      value={{
        localization,
        setLocalisation,
        availableLocalizations: localizations,
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => {
  const context = React.useContext(LocalizationContext);
  if (!context) {
    throw new Error(
      "useLocalization must be used within a LocalizationProvider"
    );
  }
  return context;
};
