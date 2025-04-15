import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import PersonIcon from '@mui/icons-material/Person';
import CallIcon from '@mui/icons-material/Call';
import { AppProvider, type Navigation } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { Outlet } from 'react-router-dom';
import { theme } from '../themes/theme';

const NESTED_NAV: Navigation = [
  {
    segment: 'child-1',
    title: 'child 1',
    icon: <Chip label="GET" color='success' />,
  },
  {
    segment: 'child-2',
    title: 'child 2',
    icon: <Chip label="PUT" color='warning' />,
  },
  {
    segment: 'child-3',
    title: 'child 3',
    icon: <Chip label="DELETE" color='error' />,
  },
];

export default function Layout() {
  return (
    <AppProvider
      branding={{
        logo: <img src="https://mui.com/static/logo.png" alt="MUI logo" />,
        title: 'Emun API Docs',
        homeUrl: '/',
      }}
      navigation={[
        {
          segment: 'parent-1',
          title: 'Parent 1',
          icon: <PersonIcon />,
        },
        {
          segment: 'parent-2',
          title: 'Parent 2',
          icon: <CallIcon />,
          children: NESTED_NAV,
        },
      ]}
      theme={theme}
    >
      <DashboardLayout>
        <Box sx={{ py: 4, px: 2 }}>
          <Outlet />
        </Box>
      </DashboardLayout>
    </AppProvider>
  );
}
