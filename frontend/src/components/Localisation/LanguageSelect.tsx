import { useContext } from 'react';
import { Select } from '@mantine/core';
import { LocaleContext, SupportedLocales } from '@/components/Localisation/LocaleContext';

const LanguageSelector = () => {
  const { locale, setLocale, localeOptions } = useContext(LocaleContext);

  const optionsWithFlags = localeOptions.map(
    (option: { value: any; flagEmoji: any; label: any }) => ({
      value: option.value,
      label: `${option.flagEmoji} ${option.label}`,
    })
  );

  return (
    <Select
      data={optionsWithFlags}
      value={locale}
      onChange={(value) => setLocale(value as SupportedLocales)}
      placeholder="Select language"
      checkIconPosition="right"
      allowDeselect={false}
    />
  );
};

export default LanguageSelector;
