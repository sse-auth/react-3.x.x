import { Localization } from "../localization";

export type LocalizationContext = {
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