import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
  Box,
  TextField,
  Divider,
} from '@mui/material';
import { Parameter, Schema } from '../interfaces/openApiInterfaces';
import { Response } from '../interfaces/openApiInterfaces';
import CustomAccordion from './CustomAccordion';
import SchemaIcon from '@mui/icons-material/Schema';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HttpIcon from '@mui/icons-material/Http';
import TuneIcon from '@mui/icons-material/Tune';
import { colorMap } from '../functions/colorMap';
import { RequestTypes } from '../interfaces/RequestTypes';
import CopyButton from './CopyButton';
import { Field, generateExampleJson, getSchemaFields } from '../functions/generateExampleJson';
import ReactMarkdown from 'react-markdown';
import { JsonBlock } from './JsonBlock';

interface EndpointCardProps {
  method: RequestTypes;
  path: string;
  summary: string;
  description?: string; // What goes in the How It Works Section
  parameters?: Parameter[];
  responses?: Response[];
  tag?: string;
  definitions: Record<string, Schema>;
  forceExpand?: boolean | null;
}

const EndpointCard: React.FC<EndpointCardProps> = ({
  method,
  path,
  summary,
  description,
  parameters,
  responses,
  definitions,
  forceExpand,
}) => {
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [expanded, setExpanded] = useState(forceExpand ?? false);

  useEffect(() => {
    if (forceExpand !== null) {
      setExpanded(forceExpand || false);
    }
  }, [forceExpand]);

  const handleQueryParamChange = (param: string, value: string) => {
    setQueryParams((prevParams) => ({
      ...prevParams,
      [param]: value,
    }));
  };

  const buildPathWithQueryParams = () => {
    let newPath = path;
    const queryStrings = Object.entries(queryParams)
      .filter(([, value]) => value !== '') // Skip empty values
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    if (queryStrings) {
      newPath += `?${queryStrings}`;
    }

    return newPath;
  };

  return (
    <Card sx={{ marginBottom: 3, boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        {/* Method and Path (always visible) */}
        <Box display='flex' alignItems='center' gap={2} paddingBottom={2}>
          <Chip
            label={method.toUpperCase()}
            color={colorMap[method]}
            sx={{
              fontSize: '0.75rem',
              fontWeight: 'bold',
              paddingX: 2,
              paddingY: 2,
            }}
          />
          <Typography variant='body2' component='code' sx={{ fontSize: '1.275rem' }}>
            {buildPathWithQueryParams()}
          </Typography>
          {!!Object.entries(queryParams).length && <CopyButton textToCopy={buildPathWithQueryParams} />}
        </Box>
        <Typography variant='caption' color='textSecondary' paragraph>
          {summary}
        </Typography>

        {parameters && definitions && parameters.find((p) => p.in === 'body' && p.schema?.$ref) && (
          <CustomAccordion title='Request Body' icon={<SchemaIcon />} expandAll={expanded}>
            {(() => {
              const bodyParam = parameters.find((p) => p.in === 'body' && p.schema?.$ref);

              if (!bodyParam) {
                return <Typography>No schema found for request body.</Typography>;
              }
              const schema = bodyParam.schema;

              if (!schema) {
                return <Typography>No schema found for request body.</Typography>;
              }

              const ref = schema.$ref;
              const schemaFields = getSchemaFields(ref, definitions);

              if (!schemaFields) {
                return <Typography>No schema found for request body.</Typography>;
              }

              const exampleJson = generateExampleJson(schemaFields.fields);

              return schemaFields.fields.length > 0 ? (
                <Box display='flex' flexDirection={{ xs: 'column', sm: 'row' }} gap={2} width='100%'>
                  {/* Left side - field descriptions */}
                  <Box flex={1}>
                    <List dense>
                      {schemaFields.fields.map((field: Field, idx: number) => (
                        <ListItem key={idx}>
                          <ListItemText
                            primary={
                              <span>
                                <code>{field.name}</code> <em>({field.type})</em>
                              </span>
                            }
                            secondary={field.description}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>

                  {/* Right side - JSON Example */}
                  <JsonBlock json={exampleJson} />
                </Box>
              ) : (
                <Typography variant='body2' color='textSecondary'>
                  This object has no defined properties.
                </Typography>
              );
            })()}
          </CustomAccordion>
        )}

        {/* Accordion for Parameters */}
        {parameters && parameters.filter((p) => p.in === 'path' || p.in === 'query').length > 0 && (
          <CustomAccordion title='Parameters' icon={<TuneIcon />} expandAll={expanded}>
            <Box display={'flex'} textAlign={'left'} gap={2}>
              {parameters.filter((p) => p.in === 'path').length > 0 && (
                <Box textAlign={'left'}>
                  <Typography variant='h6' gutterBottom>
                    Path Parameters
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <List dense>
                    {parameters
                      .filter((p) => p.in === 'path')
                      .map((param, idx) => (
                        <ListItem key={`path-${idx}`}>
                          <ListItemText
                            primary={
                              <span>
                                <code>{param.name}</code> <em>({param.type})</em>
                              </span>
                            }
                          />
                        </ListItem>
                      ))}
                  </List>
                </Box>
              )}

              {parameters.filter((p) => p.in === 'query').length > 0 && (
                <Box textAlign={'left'}>
                  <Typography variant='h6' gutterBottom>
                    Query Parameters
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <List dense>
                    {parameters
                      .filter((p) => p.in === 'query')
                      .map((param, idx) => (
                        <ListItem key={`query-${idx}`}>
                          <ListItemText
                            primary={
                              <span>
                                <code>{param.name}</code>
                              </span>
                            }
                          />
                          <TextField
                            label={param.type}
                            variant='outlined'
                            size='small'
                            style={{
                              maxWidth: '400px',
                              marginLeft: '10px',
                            }}
                            value={queryParams[param.name] || ''}
                            onChange={(e) => handleQueryParamChange(param.name, e.target.value)}
                          />
                        </ListItem>
                      ))}
                  </List>
                </Box>
              )}
            </Box>
          </CustomAccordion>
        )}

        {/* Accordion for Responses */}
        {responses && Object.keys(responses).length > 0 && (
          <CustomAccordion title='Response' icon={<HttpIcon />} expandAll={expanded}>
            <List dense>
              {(() => {
                const successResponse = Object.values(responses).find((r) => r.description === 'Success');

                const ref = successResponse?.schema?.$ref;

                if (!ref) return <Typography>No successful response found for request body.</Typography>;

                const schema = getSchemaFields(ref, definitions);

                if (!schema) return <Typography>No schema found for response body.</Typography>;

                const exampleJson = generateExampleJson(schema.fields);

                return schema.fields.length > 0 ? (
                  <Box display='flex' flexDirection={{ xs: 'column', sm: 'row' }} gap={2} width='100%'>
                    {/* Left side - field descriptions */}
                    <Box flex={1}>
                      <Typography variant='h6' gutterBottom>
                        Properties
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <List dense>
                        {schema.fields.map((field: Field, idx: number) => (
                          <ListItem key={idx}>
                            <ListItemText
                              primary={
                                <span>
                                  <code>{field.name}</code> <em>({field.type})</em>
                                </span>
                              }
                              secondary={field.description}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>

                    {/* Right side - JSON Example */}
                    <JsonBlock json={exampleJson} />
                  </Box>
                ) : (
                  <Typography variant='body2' color='textSecondary'>
                    This object has no defined response body.
                  </Typography>
                );
              })()}
            </List>
          </CustomAccordion>
        )}

        {/* Accordion for "How It Works" section */}
        {description && (
          <CustomAccordion title='How It Works' icon={<HelpOutlineIcon />} expandAll={expanded}>
            <ReactMarkdown
            // We have some customization options based on the markdown tag if we want like this, but it comes with out of the box styles that look fine
            // components={{
            //   p: ({ children }) => (
            //     <Typography variant="body2" color="textSecondary" paragraph>
            //       {children}
            //     </Typography>
            //   ),
            //   code: ({ children }) => (
            //     <code style={{ backgroundColor: "#f5f5f5", padding: "0.2em 0.4em", borderRadius: "4px" }}>
            //       {children}
            //     </code>
            //   ),

            // }}
            >
              {description}
            </ReactMarkdown>
          </CustomAccordion>
        )}
      </CardContent>
    </Card>
  );
};

export default EndpointCard;
