import { ThemeProvider } from '@emotion/react';
import { theme } from './themes/theme';
import {Layout} from './components/layout/Layout';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Layout />
    </ThemeProvider>
  );
}

