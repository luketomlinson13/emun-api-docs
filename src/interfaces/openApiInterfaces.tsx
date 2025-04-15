// openApiInterfaces.ts

export interface OpenApiSpec {
    swagger: string;
    info: Info;
    host: string;
    basePath: string;
    schemes: string[];
    consumes: string[];
    produces: string[];
    paths: Record<string, PathItem>;
  }
  
  export interface Info {
    title: string;
    version: string;
  }
  
  export interface PathItem {
    [method: string]: Operation;
  }
  
  export interface Operation {
    tags: string[];
    summary: string;
    description: string;
    operationId: string;
    consumes: string[];
    produces: string[];
    parameters: Parameter[];
    responses: Record<string, Response>;
    deprecated: boolean;
    security: Security[];
  }
  
  export interface Parameter {
    name: string;
    type: string;
    in: string;
    required?: boolean;
    schema: SchemaRef;
  }
  
  export interface Response {
    description: string;
    schema: SchemaRef;
  }
  
  export interface Security {
    Bearer: any[];
  }
  
  export interface SchemaRef {
    $ref: string;
  }
  
  // Example of how the "definitions" object could be defined
  export interface Definitions {
    [key: string]: Schema;
  }
  
  export interface Schema {
    title?: string;
    type?: string;
    description?: string;
    properties?: {
      [key: string]: {
        type?: string;
        description?: string;
        $ref?: string;
      };
    };
  }  
  
  export interface Property {
    type: string;
    description?: string;
    items?: Schema;
    format?: string;
    enum?: string[];
  }
  