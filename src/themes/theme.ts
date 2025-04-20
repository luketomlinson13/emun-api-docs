import { createTheme } from '@mui/material';

export const theme = (darkMode: boolean) => createTheme({
  palette: {
    mode: darkMode ? 'dark' : 'light', 
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});
