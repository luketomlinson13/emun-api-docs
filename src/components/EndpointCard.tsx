import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
} from "@mui/material";
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
  howItWorks?: string; // this is for us Ty if we ever add any additional detail
  definitions: Record<string, Schema>;
  forceExpand?: boolean | null;
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
  definitions,
  forceExpand
}) => {
  const colorMap: Record<string, string> = {
    get: "primary",
    post: "success",
    put: "warning",
    delete: "error",
  };

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
      .filter(([_, value]) => value !== "") // Skip empty values
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");

    if (queryStrings) {
      newPath += `?${queryStrings}`;
    }

    return newPath;
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
            {buildPathWithQueryParams()}
          </Typography>
        </Box>
        <Typography variant="body2" paragraph>
          {description}
        </Typography>

        {parameters &&
          definitions &&
          parameters.find((p) => p.in === "body" && p.schema?.$ref) && (
            <Accordion expanded={expanded}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">Request Body</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {(() => {
                  const ref = parameters.find((p) => p.in === "body")!.schema
                    .$ref;
                  const schema = getSchemaFields(ref, definitions);

                  if (!schema)
                    return (
                      <Typography>No schema found for request body.</Typography>
                    );

                  const exampleJson = schema.fields.reduce(
                    (acc, field) => {
                      acc[field.name] =
                        field.type === "string"
                          ? "string"
                          : field.type === "number"
                            ? 0
                            : field.type;
                      return acc;
                    },
                    {} as Record<string, any>
                  );

                  return schema.fields.length > 0 ? (
                    <Box
                      display="flex"
                      flexDirection={{ xs: "column", sm: "row" }}
                      gap={2}
                      width="100%"
                    >
                      {/* Left side - field descriptions */}
                      <Box flex={1}>
                        <List dense>
                          {schema.fields.map((field, idx) => (
                            <ListItem key={idx}>
                              <ListItemText
                                primary={
                                  <span>
                                    <code>{field.name}</code>{" "}
                                    <em>({field.type})</em>
                                  </span>
                                }
                                secondary={field.description}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>

                      {/* Right side - JSON Example */}
                      <Box flex={1}>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                          Example JSON
                        </Typography>
                        <pre
                          style={{
                            backgroundColor: "black",
                            color: "lime",
                            padding: "1em",
                            borderRadius: "8px",
                            overflowX: "auto",
                            fontFamily: "monospace",
                            fontSize: "0.9rem",
                          }}
                        >
                          {JSON.stringify(exampleJson, null, 2)}
                        </pre>
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      This object has no defined properties.
                    </Typography>
                  );
                })()}
              </AccordionDetails>
            </Accordion>
          )}

        {/* Accordion for Parameters */}
        {parameters &&
          parameters.filter((p) => p.in === "path" || p.in === "query").length >
            0 && (
            <Accordion expanded={expanded}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">Parameters</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box display={"flex"} textAlign={"left"} gap={2}>
                  {parameters.filter((p) => p.in === "path").length > 0 && (
                    <Box textAlign={"left"}>
                      <Typography variant="subtitle2" gutterBottom>
                        Path Parameters
                      </Typography>
                      <List dense>
                        {parameters
                          .filter((p) => p.in === "path")
                          .map((param, idx) => (
                            <ListItem key={`path-${idx}`}>
                              <ListItemText
                                primary={
                                  <span>
                                    <code>{param.name}</code>{" "}
                                    <em>({param.type})</em>
                                  </span>
                                }
                              />
                            </ListItem>
                          ))}
                      </List>
                    </Box>
                  )}

                  {parameters.filter((p) => p.in === "query").length > 0 && (
                    <Box textAlign={"left"}>
                      <Typography variant="subtitle2" gutterBottom>
                        Query Parameters
                      </Typography>
                      <List dense>
                        {parameters
                          .filter((p) => p.in === "query")
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
                                variant="outlined"
                                size="small"
                                style={{
                                  maxWidth: "400px",
                                  marginLeft: "10px",
                                }}
                                value={queryParams[param.name] || ""}
                                onChange={(e) =>
                                  handleQueryParamChange(
                                    param.name,
                                    e.target.value
                                  )
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
          <Accordion expanded={expanded}>
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
                          <code>{"resp.schema.type"}</code>: {resp.description}
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
          <Accordion expanded={expanded}>
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
