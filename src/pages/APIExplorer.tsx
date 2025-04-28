import React, { useEffect, useState } from 'react';
import { Box, TextField, Chip, Button, Autocomplete } from '@mui/material';
import EndpointCard from '../components/EndpointCard';
import { colorMap } from '../functions/colorMap';
import { RequestTypes } from '../interfaces/RequestTypes';
import { removePrefix } from '../functions/removePrefix';

type ApiExplorerProps = {
  paths: Record<string, any>;
};

const ApiExplorer: React.FC<ApiExplorerProps> = ({ paths }) => {
  const [spec, setSpec] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState<string[]>([]);
  const [expandAll, setExpandAll] = useState<boolean | null>(null);

  // 🔥 Fetch spec.json dynamically on mount
  useEffect(() => {
    const fetchSpec = async () => {
      try {
        const response = await fetch('./data/openapi_agency_api.json');
        const json = await response.json();
        setSpec(json);
      } catch (error) {
        console.error('Failed to load OpenAPI spec:', error);
      }
    };

    fetchSpec();
  }, []);

  useEffect(() => {
    setSearchTerm('');
    setMethodFilter([]);
  }, [paths]);

  const handleMethodChipClick = (method: string) => {
    setMethodFilter((prev) => (prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]));
  };

  const handleExpandAll = () => setExpandAll(true);
  const handleCollapseAll = () => setExpandAll(false);

  if (!spec) {
    // 🚀 You can show a loading spinner here if you want
    return <div>Loading API spec...</div>;
  }

  const definitions = spec.definitions;
  const tag = spec.tags?.[0]?.name;

  return (
    <div className='p-6'>
      <Box display='flex' flexWrap='wrap' justifyContent='space-between' alignItems='center' mb={3}>
        <Box display='flex' alignItems='center' gap={2} flexWrap='wrap'>
          <Autocomplete
            options={Object.entries(paths).map(([, api]) => api.path)}
            value={searchTerm}
            onChange={(_event: any, newValue: string | null) => {
              setSearchTerm(!newValue ? '' : newValue);
            }}
            renderInput={(params) => (
              <TextField {...params} label='Search Endpoints' variant='outlined' size='small' sx={{ minWidth: 300 }} />
            )}
          />
          {Array.from(new Set(Object.entries(paths).map(([, api]) => api.method))).map((method) => (
            <Chip
              key={method}
              label={method.toUpperCase()}
              color={colorMap[method]}
              variant={methodFilter.includes(method) ? 'filled' : 'outlined'}
              onClick={() => handleMethodChipClick(method)}
              sx={{
                fontSize: '0.75rem',
                fontWeight: 'bold',
                paddingX: 2,
                paddingY: 2,
                cursor: 'pointer',
              }}
            />
          ))}
        </Box>

        <Box display='flex' gap={1} mt={{ xs: 2, sm: 0 }}>
          <Button variant='outlined' size='small' onClick={handleExpandAll}>
            Expand All
          </Button>
          <Button variant='outlined' size='small' onClick={handleCollapseAll}>
            Collapse All
          </Button>
        </Box>
      </Box>

      {Object.entries(paths).map(([, api]) => {
        const { path, method, operation } = api;
        const matchesMethod = methodFilter.length === 0 || methodFilter.includes(method);
        const matchesSearch = path.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesMethod || !matchesSearch) return null;

        const howItWorksTag = operation.tags.find((tag: string) => tag.toLowerCase().includes('howitworks:'));
        const howItWorksMd = removePrefix(howItWorksTag, 'howitworks:');

        return (
          <EndpointCard
            key={operation.operationId}
            method={method as RequestTypes}
            path={path}
            summary={operation.summary}
            description={howItWorksMd}
            parameters={operation.parameters}
            responses={operation.responses}
            tag={operation.tags?.[0] || tag}
            definitions={definitions}
            forceExpand={expandAll}
          />
        );
      })}
    </div>
  );
};

export default ApiExplorer;
