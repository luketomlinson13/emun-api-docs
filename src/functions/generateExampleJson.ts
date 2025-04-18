/* eslint-disable @typescript-eslint/no-explicit-any */
type SchemaProperty = {
  type?: string;
  description?: string;
  $ref?: string;
  items?: {
    $ref?: string;
    type?: string;
  };
  properties?: Record<string, SchemaProperty>;
  additionalProperties?: boolean | SchemaProperty;
};

export type Field = {
  name: string;
  type: string;
  description: string;
  nestedFields?: Field[];
};

export const getSchemaFields = (
  ref: string,
  definitions: Record<string, any>,
  depth: number = 3
): { description: string; fields: Field[] } | null => {
  const refName = ref.replace("#/definitions/", "");
  const schema = definitions[refName];
  if (!schema) return null;

  const fields: Field[] = [];

  if (schema.properties) {
    for (const [name, propRaw] of Object.entries(schema.properties)) {
      const prop = propRaw as SchemaProperty;

      let type = prop.type || "any";
      let nestedFields: Field[] | undefined;

      // Case 1: Direct $ref
      if (prop.$ref && depth > 0) {
        const nested = getSchemaFields(prop.$ref, definitions, depth - 1);
        type = prop.$ref.replace("#/definitions/", "");
        if (nested) nestedFields = nested.fields;

        // Case 2: Array of $ref
      } else if (prop.type === "array" && prop.items?.$ref && depth > 0) {
        const nested = getSchemaFields(prop.items.$ref, definitions, depth - 1);
        type = `array of ${prop.items.$ref.replace("#/definitions/", "")}`;
        if (nested) nestedFields = nested.fields;
      }

      fields.push({
        name,
        type,
        description: prop.description || "",
        nestedFields,
      });
    }
  }

  return {
    description: schema.description || "",
    fields,
  };
};

export const generateExampleJson = (
  fields: { name: string; type: string; nestedFields?: any }[]
): Record<string, any> => {
  return fields.reduce(
    (acc, field) => {
      if (field.nestedFields) {
        acc[field.name] = generateExampleJson(field.nestedFields);
      } else {
        acc[field.name] =
          field.type === "string"
            ? "string"
            : field.type === "number"
              ? 0
              : field.type === "boolean"
                ? true
                : field.type;
      }
      return acc;
    },
    {} as Record<string, any>
  );
};
