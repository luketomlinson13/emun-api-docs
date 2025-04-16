import {
  Box,
  CssBaseline,
  Drawer,
  Toolbar,
  Typography,
  AppBar,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Collapse,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useState } from 'react';
import openapi_json_dev from '../../data/openapi_agency_api_dev.json';
import { groupPaths } from '../../functions/groupPaths';
import ApiExplorer from '../APIExplorer';

const drawerWidth = 280;

export function Layout() {
  const groups = groupPaths(openapi_json_dev);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [selectedChildLabel, setSelectedChildLabel] = useState<string | null>(null);
  const [selectedChildPaths, setSelectedChildPaths] = useState<Record<string, any> | null>(null);

  const handleGroupToggle = (label: string) => {
    setExpandedGroup((prev) => (prev === label ? null : label));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChildClick = (label: string, paths: Record<string, any>) => {
    setSelectedChildLabel(label);
    setSelectedChildPaths(paths);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <img src="https://mui.com/static/logo.png" alt="Logo" style={{ height: 32, marginRight: 16 }} />
          <Typography variant="h6" noWrap component="div">
            Emun API Docs
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', p: 2 }}>
          <List>
            {groups.map((group) => {
              const isExpanded = expandedGroup === group.label;
              return (
                <Box key={group.label}>
                  <ListItemButton onClick={() => handleGroupToggle(group.label)}>
                    <ListItemText
                      primary={group.label}
                      primaryTypographyProps={{
                        fontWeight: isExpanded ? 'bold' : 'normal',
                      }}
                    />
                    <ListItemIcon sx={{ minWidth: 0 }}>
                      {isExpanded ? <ExpandLess /> : <ExpandMore />}
                    </ListItemIcon>
                  </ListItemButton>

                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {group.children.map((child) => (
                        <ListItemButton
                          key={child.label}
                          sx={{ pl: 4 }}
                          selected={selectedChildLabel === child.label}
                          onClick={() => handleChildClick(child.label, child.children)}
                        >
                          <ListItemText primary={child.label} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                </Box>
              );
            })}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {selectedChildLabel && selectedChildPaths ? (
          <>
            <Typography variant="h4" gutterBottom>
              {selectedChildLabel}
            </Typography>
            <ApiExplorer paths={selectedChildPaths} />
          </>
        ) : (
          <Typography variant="h6" color="text.secondary">
            Select an endpoint from the sidebar to get started.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
