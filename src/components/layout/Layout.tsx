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
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useState } from "react";
import spec from "../../data/openapi_agency_api_dev.json";
import { groupPaths } from "../../functions/groupPaths";
import ApiExplorer from "../APIExplorer";
import DefinitionViewer from "../DefinitionViewer";

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

  // Include it in the groups list
  const groups = [...pathsGroup, definitionsGroup];

  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [selectedChildLabel, setSelectedChildLabel] = useState<string | null>(
    null
  );
  const [selectedContent, setSelectedContent] = useState<any>(null);

  const handleGroupToggle = (label: string) => {
    setExpandedGroup((prev) => (prev === label ? null : label));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // Accept either a path group or a definition schema as 'children'
  const handleChildClick = (label: string, content: any) => {
    setSelectedChildLabel(label);
    setSelectedContent(content);
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
            src="https://mui.com/static/logo.png"
            alt="Logo"
            style={{ height: 32, marginRight: 16 }}
          />
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
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto", p: 2 }}>
          <List>
            {groups.map((group) => {
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
                      {group.children?.map((child) => (
                        <ListItemButton
                          key={child.label}
                          sx={{ pl: 4 }}
                          selected={selectedChildLabel === child.label}
                          onClick={() =>
                            handleChildClick(child.label, child.children)
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
                title={selectedChildLabel}
                description={selectedContent.description}
                schema={selectedContent}
              />
            ) : (
              <ApiExplorer paths={selectedContent} />
            )}
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
