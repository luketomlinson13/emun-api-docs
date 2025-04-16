import React, { useState } from "react";
import { Box, TextField, Chip, Typography, Button } from "@mui/material";
import spec from "../data/openapi_agency_api.json";
import EndpointCard from "./EndpointCard";

const ApiExplorer: React.FC = () => {
  const paths = spec.paths;
  const definitions = spec.definitions;
  const tag = spec.tags?.[0]?.name;

  const [searchTerm, setSearchTerm] = useState("");
  const [methodFilter, setMethodFilter] = useState<string[]>([]);
  const [expandAll, setExpandAll] = useState<boolean | null>(null);

  const handleMethodChipClick = (method: string) => {
    setMethodFilter((prev) =>
      prev.includes(method)
        ? prev.filter((m) => m !== method)
        : [...prev, method]
    );
  };

  const handleExpandAll = () => setExpandAll(true);
  const handleCollapseAll = () => setExpandAll(false);

  const methodColors: Record<
    string,
    "primary" | "success" | "warning" | "error"
  > = {
    get: "primary",
    post: "success",
    put: "warning",
    delete: "error",
  };

  return (
    <div className="p-6">
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {spec.info.title}
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Version: {spec.info.version}
      </Typography>

      {/* Search and Method Filter */}
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        {/* Left: Search + Method Chips */}
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <TextField
            label="Search endpoints"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 300 }}
          />
          {["get", "post", "put", "delete"].map((method) => (
            <Chip
              key={method}
              label={method.toUpperCase()}
              color={methodColors[method]}
              variant={methodFilter.includes(method) ? "filled" : "outlined"}
              onClick={() => handleMethodChipClick(method)}
              sx={{
                fontSize: "0.75rem",
                fontWeight: "bold",
                paddingX: 1,
                paddingY: 1,
                cursor: "pointer",
              }}
            />
          ))}
        </Box>

        {/* Right: Expand/Collapse */}
        <Box display="flex" gap={1} mt={{ xs: 2, sm: 0 }}>
          <Button variant="outlined" size="small" onClick={handleExpandAll}>
            Expand All
          </Button>
          <Button variant="outlined" size="small" onClick={handleCollapseAll}>
            Collapse All
          </Button>
        </Box>
      </Box>

      {/* Endpoint Cards */}
      {Object.entries(paths).map(([path, methods]) =>
        Object.entries(methods).map(([method, details]: any) => {
          const matchesMethod =
            methodFilter.length === 0 || methodFilter.includes(method);
          const matchesSearch = path
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

          if (!matchesMethod || !matchesSearch) return null;

          return (
            <EndpointCard
              key={details.operationId}
              method={method as "get" | "post" | "put" | "delete"}
              path={path}
              summary={details.summary}
              description={details.description}
              parameters={details.parameters}
              responses={details.responses}
              tag={details.tags?.[0] || tag}
              howItWorks="This is an expanded detail where we can add specific information for how to use this particular endpoint."
              definitions={definitions}
              forceExpand={expandAll}
            />
          );
        })
      )}
    </div>
  );
};

export default ApiExplorer;
