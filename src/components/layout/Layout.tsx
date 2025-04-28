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
  ListSubheader,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { groupPaths } from '../../functions/groupPaths';
import ApiExplorer from '../../pages/APIExplorer';
import DefinitionViewer from '../DefinitionViewer';
import DefaultContent from '../../pages/DefaultContent';
import ApiLinks from '../ApiLinks';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 280;

export function Layout() {
  const [json, setJson] = useState<any | null>(null);
  const [sidebarPaths, setSidebarPaths] = useState<any[]>([]);
  const [definitionsGroup, setDefinitionsGroup] = useState<any>({
    label: 'Definitions',
    children: [],
  });

  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [selectedChildLabel, setSelectedChildLabel] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadSpec = async () => {
      let data;

      // If in dev, load from local or proxy
      try {
        // Try loading from the public directory first
        const response = await fetch('/data/openapi_agency_api.json');
        if (response.ok) {
          data = await response.json();
        } else {
          throw new Error('Failed to load local JSON');
        }
      } catch (error) {
        console.error('Error loading spec:', error);
      }

      // Parse and set the spec data if successfully loaded
      if (data) {
        const specData = data.default || data;
        setJson(specData);
        setSidebarPaths(groupPaths(specData));
        setDefinitionsGroup({
          label: 'Definitions',
          children: Object.entries(specData.definitions).map(([key, value]) => ({
            label: key,
            children: value,
          })),
        });
      }
    };

    loadSpec();
  }, []);

  useEffect(() => {
    if (!json) return;

    const params = new URLSearchParams(location.search);
    const group = params.get('group');
    const child = params.get('child');

    if (group && child) {
      setExpandedGroup(group);
      setSelectedChildLabel(child);

      const groupContent =
        group === 'Definitions'
          ? definitionsGroup.children.find((c: { label: string }) => c.label === child)
          : sidebarPaths.find((g) => g.label === group)?.children.find((c: { label: string }) => c.label === child);

      if (groupContent) {
        setSelectedContent(groupContent.children);
      }
    }
  }, [location.search, json, definitionsGroup, sidebarPaths]);

  const handleGroupToggle = (label: string) => {
    setExpandedGroup((prev) => (prev === label ? null : label));
  };

  const handleChildClick = (label: string, content: any, groupLabel: string) => {
    setSelectedChildLabel(label);
    setSelectedContent(content);
    navigate(`?group=${encodeURIComponent(groupLabel)}&child=${encodeURIComponent(label)}`);
  };

  if (!json) return <Typography>Loading API Documentation...</Typography>;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar position='fixed' sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <img src='/emunlogo.svg' alt='API Logo' style={{ height: 25, marginRight: 16 }} />
          <Typography variant='h6' noWrap component='div'>
            API Docs
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant='permanent'
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
          <List subheader={<ListSubheader component='div'>Endpoints</ListSubheader>}>
            {sidebarPaths.map((group) => {
              const isExpanded = expandedGroup === group.label;
              return (
                <Box key={group.label}>
                  <ListItemButton onClick={() => handleGroupToggle(group.label)}>
                    <ListItemText
                      primary={group.label}
                      slotProps={{
                        primary: {
                          fontWeight: expandedGroup === definitionsGroup.label ? 'bold' : 'normal',
                        },
                      }}
                    />
                    <ListItemIcon sx={{ minWidth: 0 }}>{isExpanded ? <ExpandLess /> : <ExpandMore />}</ListItemIcon>
                  </ListItemButton>

                  <Collapse in={isExpanded} timeout='auto' unmountOnExit>
                    <List component='div' disablePadding>
                      {group.children.map((child: { label: string; children: any }) => (
                        <ListItemButton
                          key={child.label}
                          sx={{ pl: 4 }}
                          selected={selectedChildLabel === child.label}
                          onClick={() => handleChildClick(child.label, child.children, group.label)}
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

          <List
            subheader={
              <ListSubheader component='div' sx={{ mt: 2 }}>
                Objects
              </ListSubheader>
            }
          >
            <Box key={definitionsGroup.label}>
              <ListItemButton onClick={() => handleGroupToggle(definitionsGroup.label)}>
                <ListItemText
                  primary={definitionsGroup.label}
                  slotProps={{
                    primary: {
                      fontWeight: expandedGroup === definitionsGroup.label ? 'bold' : 'normal',
                    },
                  }}
                />
                <ListItemIcon sx={{ minWidth: 0 }}>
                  {expandedGroup === definitionsGroup.label ? <ExpandLess /> : <ExpandMore />}
                </ListItemIcon>
              </ListItemButton>

              <Collapse in={expandedGroup === definitionsGroup.label} timeout='auto' unmountOnExit>
                <List component='div' disablePadding>
                  {definitionsGroup.children.map((child: { label: string; children: any }) => (
                    <ListItemButton
                      key={child.label}
                      sx={{ pl: 4 }}
                      selected={selectedChildLabel === child.label}
                      onClick={() => handleChildClick(child.label, child.children, definitionsGroup.label)}
                    >
                      <ListItemText primary={child.label} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </Box>
          </List>

          <ApiLinks />
        </Box>
      </Drawer>

      <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {selectedChildLabel && selectedContent ? (
          <>
            <Typography variant='h4' gutterBottom>
              {selectedChildLabel}
            </Typography>

            {'type' in selectedContent && selectedContent.type === 'object' ? (
              <DefinitionViewer description={selectedContent.description} schema={selectedContent} />
            ) : (
              <ApiExplorer paths={selectedContent} />
            )}
          </>
        ) : (
          <DefaultContent />
        )}
      </Box>
    </Box>
  );
}
