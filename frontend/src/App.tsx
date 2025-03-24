import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';

import { MantineProvider } from '@mantine/core';
import { LocaleProvider } from '@/components/Locale/LocaleContext';
import { Router } from './Router';
import { theme } from './theme';

export default function App() {
  return (
    <LocaleProvider>
      <MantineProvider theme={theme}>
        <Router />
      </MantineProvider>
    </LocaleProvider>
  );
}
