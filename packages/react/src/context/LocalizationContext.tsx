import React from "react";

interface Localization {
  id: string;
  [key: string]: string;
  signIn_title: string;
  signIn_subtitle: string;
  signIn_label_email: string;
  signIn_label_password: string;
  signIn_label_phone: string;
  signIn_link_forgotPassword: string;
  signIn_submit_text: string;
  signIn_divider_text: string;
  signIn_social_text: string;
  signIn_link_dontHaveAnAccount: string;

  signUp_title: string;
  signUp_subtitle: string;
  signUp_label_email: string;
  signUp_label_password: string;
  signUp_label_phone: string;
  signUp_label_name: string;
  signUp_submit_text: string;
  signUp_divider_text: string;
  signUp_link_haveAnAccount: string;
}

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
