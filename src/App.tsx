import { ThemeProvider } from '@emotion/react';
import { theme } from './themes/theme';
import {Layout} from './components/layout/Layout';
import { BrowserRouter } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Layout />
      </ThemeProvider>
    </BrowserRouter>
  );
}

