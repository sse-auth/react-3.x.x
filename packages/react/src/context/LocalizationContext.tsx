import React from 'react';
import { Localization } from '@sse-auth/types/localization';

type LocalizationContextType = {
  localization: Localization;
  setLocalisation: (lang: string) => void;
  availableLocalizations: Localization[];
  t: (key: LocalizationKey) => void;
};
export type LocalizationKeys<T> =
  T extends Record<string, any>
    ? {
        [K in keyof T]: K extends string
          ? T[K] extends Record<string, any>
            ? `${K}` | `${K}.${LocalizationKeys<T[K]>}`
            : K
          : never;
      }[keyof T]
    : never;

export type LocalizationKey = LocalizationKeys<Localization>;

const LocalizationContext = React.createContext<LocalizationContextType>({
  localization: {} as Localization,
  setLocalisation: () => {},
  availableLocalizations: [],
  t: () => {},
});

// Create a Provider component that wraps your app and makes the localization object available to any child component that calls the useLocalization hook.
export const LocalizationProvider: React.FC<
  React.PropsWithChildren<{ localizations: Localization[] }>
> = ({ children, localizations }) => {
  const [currentLangId, setCurrentLangId] = React.useState<string>(localizations[0].id);
  const localization = localizations.find((loc) => loc.id === currentLangId) || localizations[0];

  const setLocalisation = (lang: string) => {
    setCurrentLangId(lang);
  };

  const t = (key: LocalizationKey): string => {
    const keys = key.split('.') as string[];
    let result: any = localization;

    for (const k of keys) {
      result = result[k];
      if (result === undefined) {
        return key;
      }
    }

    return result;
  };

  return (
    <LocalizationContext.Provider
      value={{
        localization,
        setLocalisation,
        availableLocalizations: localizations,
        t,
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => {
  const context = React.useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};
