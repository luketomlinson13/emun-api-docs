import { ThemeProvider } from '@emotion/react';
import { theme } from './themes/theme';
import {Layout} from './components/layout/Layout';
import { BrowserRouter } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';

export default function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme(prefersDarkMode)}>
        <Layout />
      </ThemeProvider>
    </BrowserRouter>
  );
}

