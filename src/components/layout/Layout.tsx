/* eslint-disable @typescript-eslint/no-explicit-any */
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
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useState } from "react";
import spec from "../../data/openapi_agency_api_dev.json";
import { groupPaths } from "../../functions/groupPaths";
import ApiExplorer from "../../pages/APIExplorer";
import DefinitionViewer from "../DefinitionViewer";
import DefaultContent from "../../pages/DefaultContent";
import ApiLinks from "../ApiLinks";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";


const drawerWidth = 280;

export function Layout() {
  const pathsGroup = groupPaths(spec);
  const definitionsGroup = {
    label: "Definitions",
    children: Object.entries(spec.definitions).map(([key, value]) => ({
      label: key,
      children: value, // <-- normalized to 'children' for consistent access
    })),
  };

  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [selectedChildLabel, setSelectedChildLabel] = useState<string | null>(
    null
  );
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle initial load from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const group = params.get("group");
    const child = params.get("child");

    if (group && child) {
      // Expand the group
      setExpandedGroup(group);
      setSelectedChildLabel(child);

      // Lookup the corresponding content
      const groupContent =
        group === "Definitions"
          ? definitionsGroup.children.find((c) => c.label === child)
          : pathsGroup.find((g) => g.label === group)?.children.find((c) => c.label === child);

      if (groupContent) {
        setSelectedContent(groupContent.children);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);


  const handleGroupToggle = (label: string) => {
    setExpandedGroup((prev) => (prev === label ? null : label));
  };

   
  const handleChildClick = (label: string, content: any, groupLabel: string) => {
    setSelectedChildLabel(label);
    setSelectedContent(content);
    navigate(`?group=${encodeURIComponent(groupLabel)}&child=${encodeURIComponent(label)}`);
  };
  

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <img
            src="/emunlogo.svg"
            alt="API Logo"
            style={{ height: 25, marginRight: 16 }}
          />
          <Typography variant="h6" noWrap component="div">
            API Docs
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
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto", p: 2 }}>
          <List
            subheader={<ListSubheader component="div">Endpoints</ListSubheader>}
          >
            {pathsGroup.map((group) => {
              const isExpanded = expandedGroup === group.label;
              return (
                <Box key={group.label}>
                  <ListItemButton
                    onClick={() => handleGroupToggle(group.label)}
                  >
                    <ListItemText
                      primary={group.label}
                      primaryTypographyProps={{
                        fontWeight: isExpanded ? "bold" : "normal",
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
                          onClick={() =>
                            handleChildClick(child.label, child.children, group.label)
                          }                          
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
              <ListSubheader component="div" sx={{ mt: 2 }}>
                Objects
              </ListSubheader>
            }
          >
            <Box key={definitionsGroup.label}>
              <ListItemButton
                onClick={() => handleGroupToggle(definitionsGroup.label)}
              >
                <ListItemText
                  primary={definitionsGroup.label}
                  primaryTypographyProps={{
                    fontWeight:
                      expandedGroup === definitionsGroup.label
                        ? "bold"
                        : "normal",
                  }}
                />
                <ListItemIcon sx={{ minWidth: 0 }}>
                  {expandedGroup === definitionsGroup.label ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )}
                </ListItemIcon>
              </ListItemButton>

              <Collapse
                in={expandedGroup === definitionsGroup.label}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {definitionsGroup.children.map((child) => (
                    <ListItemButton
                      key={child.label}
                      sx={{ pl: 4 }}
                      selected={selectedChildLabel === child.label}
                      color="red"
                      onClick={() =>
                        handleChildClick(child.label, child.children, definitionsGroup.label)
                      }                      
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

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {selectedChildLabel && selectedContent ? (
          <>
            <Typography variant="h4" gutterBottom>
              {selectedChildLabel}
            </Typography>

            {"type" in selectedContent && selectedContent.type === "object" ? (
              <DefinitionViewer
                description={selectedContent.description}
                schema={selectedContent}
              />
            ) : (
              <ApiExplorer paths={selectedContent} />
            )}
          </>
        ) : (
          <DefaultContent></DefaultContent>
        )}
      </Box>
    </Box>
  );
}
