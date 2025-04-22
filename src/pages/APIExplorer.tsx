 
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Box, TextField, Chip, Button, Autocomplete } from "@mui/material";
import spec from "../data/openapi_agency_api.json";
import EndpointCard from "../components/EndpointCard";
import { colorMap } from "../functions/colorMap";
import { RequestTypes } from "../interfaces/RequestTypes";

type ApiExplorerProps = {
  paths: Record<string, any>;
};

const ApiExplorer: React.FC<ApiExplorerProps> = ({ paths }) => {
  const definitions = spec.definitions;
  const tag = spec.tags?.[0]?.name;

  const [searchTerm, setSearchTerm] = useState("");
  const [methodFilter, setMethodFilter] = useState<string[]>([]);
  const [expandAll, setExpandAll] = useState<boolean | null>(null);

  useEffect(() => {
    setSearchTerm("");
    setMethodFilter([])
  }, [paths])

  const handleMethodChipClick = (method: string) => {
    setMethodFilter((prev) =>
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]
    );
  };

  const handleExpandAll = () => setExpandAll(true);
  const handleCollapseAll = () => setExpandAll(false);

  return (
    <div className="p-6">
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <Autocomplete
            options={Object.entries(paths).map(([,api]) => api.path)}
            value={searchTerm}
            onChange={(event: any, newValue: string | null) => {
              console.log(newValue)
              setSearchTerm(!newValue ? "" : newValue);
            }}
            renderInput={(params) => <TextField {...params} label="Search Endpoints" variant="outlined" size="small" sx={{ minWidth: 300 }} />}
          />
          {Array.from(new Set(Object.entries(paths).map(([, api]) => api.method))).map((method) => (
            <Chip
              key={method}
              label={method.toUpperCase()}
              color={colorMap[method]}
              variant={methodFilter.includes(method) ? "filled" : "outlined"}
              onClick={() => handleMethodChipClick(method)}
              sx={{
                fontSize: "0.75rem",
                fontWeight: "bold",
                paddingX: 2,
                paddingY: 2,
                cursor: "pointer",
              }}
            />
          ))}
        </Box>

        <Box display="flex" gap={1} mt={{ xs: 2, sm: 0 }}>
          <Button variant="outlined" size="small" onClick={handleExpandAll}>
            Expand All
          </Button>
          <Button variant="outlined" size="small" onClick={handleCollapseAll}>
            Collapse All
          </Button>
        </Box>
      </Box>

      {Object.entries(paths).map(([, api]) => 
      {
          const {path, method, operation} = api;
            const matchesMethod =
            methodFilter.length === 0 || methodFilter.includes(method);
            const matchesSearch = path
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
            
            if (!matchesMethod || !matchesSearch) return null;
            
            return (
              <EndpointCard
                key={operation.operationId} 
                method={method as RequestTypes}
                path={path}
                summary={operation.summary}
                description={operation.description}
                parameters={operation.parameters}
                responses={operation.responses}
                tag={operation.tags?.[0] || tag}
                definitions={definitions}
                forceExpand={expandAll}
              />
            );
          })
      }
    </div>
  );
};

export default ApiExplorer;
