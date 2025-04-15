import React from "react";
import { Card, CardContent, Typography, Chip, List, ListItem, ListItemText, Box, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { ExpandMore } from "@mui/icons-material"; // For the expand icon
import { Parameter, Schema } from "../interfaces/openApiInterfaces";
import { Response } from "../interfaces/openApiInterfaces";

interface EndpointCardProps {
  method: "get" | "post" | "put" | "delete";
  path: string;
  summary: string;
  description: string;
  parameters?: Parameter[];
  responses?: Response[];
  tag?: string;
  howItWorks?: string; // Extra details for the "How it works" section
  definitions: Record<string, Schema>;
}

const getSchemaFields = (ref: string, definitions: Record<string, any>) => {
  const refName = ref.replace("#/definitions/", "");
  const schema = definitions[refName];
  if (!schema) return null;

  const fields = schema.properties
    ? Object.entries(schema.properties).map(([name, prop]: any) => ({
        name,
        type: prop.type || "any",
        description: prop.description || "",
      }))
    : [];

    console.log(schema.description, fields);
  return {
    description: schema.description || "",
    fields,
  };
};


const EndpointCard: React.FC<EndpointCardProps> = ({
  method,
  path,
  summary,
  description,
  parameters,
  responses,
  tag,
  howItWorks,
  definitions
}) => {

  const colorMap: Record<string, string> = {
    get: "primary",
    post: "success",
    put: "warning",
    delete: "error",
  };

  return (
    <Card sx={{ marginBottom: 3, boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        {/* Method and Path (always visible) */}
        <Box display="flex" alignItems="center" gap={2} paddingBottom={2}>
          <Chip
            label={method.toUpperCase()}
            color={colorMap[method] as any}
            sx={{
              fontSize: "0.75rem",
              fontWeight: "bold",
              paddingX: 1,
              paddingY: 1,
            }}
          />
          <Typography
            variant="body2"
            color="textSecondary"
            component="code"
            sx={{ fontSize: "0.875rem" }}
          >
            {path.replace('/', '')}
          </Typography>
        </Box>
        <Typography variant="body2" paragraph>
          {description}
        </Typography>

        {parameters && definitions && parameters.find(p => p.in === "body" && p.schema?.$ref) && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Request Body</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {(() => {
                const ref = parameters.find(p => p.in === "body")!.schema.$ref;
                const schema = getSchemaFields(ref, definitions);

                if (!schema) return <Typography>No schema found for request body.</Typography>;

                return (
                  <>
                    <Typography variant="body2" gutterBottom>
                      {schema.description}
                    </Typography>
                    {schema.fields.length > 0 ? (
                      <List dense>
                        {schema.fields.map((field, idx) => (
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
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        This object has no defined properties.
                      </Typography>
                    )}
                  </>
                );
              })()}
            </AccordionDetails>
          </Accordion>
        )}

        {/* Accordion for Parameters */}
        {parameters && parameters.filter(p => p.in === "path" || p.in === "query").length > 0 && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Parameters</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box display={'flex'} textAlign={'left'}>
              {parameters.filter(p => p.in === "path").length > 0 && (
                <Box textAlign={'left'}>
                  <Typography variant="subtitle2" gutterBottom>Path Parameters</Typography>
                  <List dense>
                    {parameters.filter(p => p.in === "path").map((param, idx) => (
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

              {parameters.filter(p => p.in === "query").length > 0 && (
                <Box textAlign={'left'}>
                  <Typography variant="subtitle2" gutterBottom>Query Parameters</Typography>
                  <List dense>
                    {parameters.filter(p => p.in === "query").map((param, idx) => (
                      <ListItem key={`query-${idx}`}>
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
              </Box>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Accordion for Responses */}
        {responses && responses.length > 0 && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Response Body</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List dense>
                {responses.map((resp, idx) => (
                  <ListItem key={idx}>
                    <ListItemText
                      primary={
                        <span>
                          <code>{'resp.schema.type'}</code>: {resp.description}
                        </span>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Accordion for "How It Works" section */}
        {howItWorks && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">How It Works</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                {howItWorks}
              </Typography>
            </AccordionDetails>
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
};

export default EndpointCard;
