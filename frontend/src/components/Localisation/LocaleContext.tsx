import React, { createContext, ReactNode, useState, useEffect } from "react";
import { IntlProvider } from "react-intl";
import English from './languages/en.json';
import Turkish from './languages/tr.json';

// Define the structure for locale metadata
interface LocaleOption {
  value: string;
  label: string;
  flagEmoji: string;
}

// Define supported locales with their metadata
export type SupportedLocales = 'en' | 'tr';

// Create an array of locale options for the Select component
export const localeOptions: LocaleOption[] = [
  {
    value: 'en',
    label: 'English',
    flagEmoji: '🇬🇧'
  },
  {
    value: 'tr',
    label: 'Turkish',
    flagEmoji: '🇹🇷'
  }
];

// Messages dictionary
const messages = {
  en: English,
  tr: Turkish
};

const DEFAULT_LOCALE: SupportedLocales = 'en';

interface LocaleContextType {
  locale: SupportedLocales;
  setLocale: (locale: SupportedLocales) => void;
  localeOptions: LocaleOption[]; // Include in the context type
}

const saveLocalePreference = (locale: SupportedLocales) => {
  localStorage.setItem('locale', locale);
};

const getLocalePreference = (): SupportedLocales => {
  const saved = localStorage.getItem('locale') as SupportedLocales;
  return saved && messages[saved] ? saved : DEFAULT_LOCALE;
};

// Make sure to include localeOptions in the default context value
export const LocaleContext = createContext<LocaleContextType>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  localeOptions
});

interface LocaleProviderProps {
  children: ReactNode;
}

export const LocaleProvider: React.FC<LocaleProviderProps> = ({children}) => {
  // Get browser locale and check if it's supported
  const browserLocale = navigator.language.split(/[-_]/)[0];
  const initialLocale = getLocalePreference() ||
    (browserLocale in messages ? browserLocale as SupportedLocales : DEFAULT_LOCALE);

  const [locale, setLocaleState] = useState<SupportedLocales>(initialLocale);

  // Wrapper function that both updates state and saves to localStorage
  const setLocale = (newLocale: SupportedLocales) => {
    saveLocalePreference(newLocale);
    setLocaleState(newLocale);
  };

  return (
    <LocaleContext.Provider value={{
      locale,
      setLocale,
      localeOptions // Make sure to include it in the Provider value
    }}>
      <IntlProvider
        locale={locale}
        messages={messages[locale]}
        defaultLocale={DEFAULT_LOCALE}
      >
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  );
};