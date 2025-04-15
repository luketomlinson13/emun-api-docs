import React from "react";

// Define the types for the props
interface Parameter {
  name: string;
  in: string;
}

interface Response {
  description: string;
}

interface EndpointCardProps {
  method: "get" | "post" | "put" | "delete";
  path: string;
  summary: string;
  description: string;
  parameters?: Parameter[];
  responses?: Record<string, Response>;
  tag?: string;
}

const EndpointCard: React.FC<EndpointCardProps> = ({
  method,
  path,
  summary,
  description,
  parameters,
  responses,
  tag,
}) => {
  const colorMap: Record<string, string> = {
    get: "bg-blue-100 text-blue-800",
    post: "bg-green-100 text-green-800",
    put: "bg-yellow-100 text-yellow-800",
    delete: "bg-red-100 text-red-800",
  };

  return (
    <div className="mb-6 border rounded-xl p-4 shadow-sm bg-white">
      <div className="flex items-center gap-4 mb-2">
        <span className={`px-3 py-1 text-xs font-semibold rounded ${colorMap[method] || "bg-gray-100"}`}>
          {method.toUpperCase()}
        </span>
        <code className="text-sm text-gray-700">{path}</code>
      </div>
      <h3 className="text-lg font-semibold">{summary}</h3>
      <p className="text-gray-600 mb-2">{description}</p>
      {parameters && parameters.length > 0 && (
        <div className="mt-2 text-sm">
          <strong>Parameters:</strong>
          <ul className="ml-4 list-disc">
            {parameters.map((param, idx) => (
              <li key={idx}>
                <code>{param.name}</code> <em>({param.in})</em>
              </li>
            ))}
          </ul>
        </div>
      )}
      {responses && (
        <div className="mt-2 text-sm">
          <strong>Responses:</strong>
          <ul className="ml-4 list-disc">
            {Object.entries(responses).map(([code, resp]) => (
              <li key={code}>
                <code>{code}</code>: {resp.description}
              </li>
            ))}
          </ul>
        </div>
      )}
      {tag && <div className="text-xs text-gray-500 mt-2">Tag: {tag}</div>}
    </div>
  );
};

export default EndpointCard;
