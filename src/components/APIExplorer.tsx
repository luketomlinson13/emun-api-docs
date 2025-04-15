import React from "react";
import spec from "../data/openapi_agency_api.json";
import EndpointCard from "./EndpointCard";

// Define the types for OpenAPI specification
interface Parameter {
  name: string;
  in: string;
}

interface Response {
  description: string;
}

interface Operation {
  operationId: string;
  summary: string;
  description: string;
  parameters?: Parameter[];
  responses: Record<string, Response>;
  tags?: string[];
}

interface Paths {
  [path: string]: Record<string, Operation>;
}

interface Tag {
  name: string;
}

interface Info {
  title: string;
  version: string;
}

interface OpenApiSpec {
  info: Info;
  paths: Paths;
  tags?: Tag[];
}

const ApiExplorer: React.FC = () => {
  const paths = spec.paths;
  const tag = spec.tags?.[0]?.name;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{spec.info.title}</h1>
      <p className="mb-8 text-gray-600">Version: {spec.info.version}</p>
      {Object.entries(paths).map(([path, methods]) =>
        Object.entries(methods).map(([method, details]) => (
          <EndpointCard
            key={details.operationId}
            method={method as "get" | "post" | "put" | "delete"} // Ensure method type is valid
            path={path}
            summary={details.summary}
            description={details.description}
            parameters={details.parameters}
            responses={details.responses}
            tag={details.tags?.[0] || tag}
          />
        ))
      )}
    </div>
  );
};

export default ApiExplorer;
