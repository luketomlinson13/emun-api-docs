import { Operation, OpenApiSpec } from "../interfaces/openApiInterfaces";

interface PathMeta {
    path: string;
    method: string;
    operation: Operation;
  }
  
  interface NavigationItem {
    label: string;
    children: {
      label: string;
      children: PathMeta[];
    }[];
  }
  
  export function groupPaths(spec: OpenApiSpec): NavigationItem[] {
    const grouped: Record<string, Record<string, PathMeta[]>> = {};
  
    Object.entries(spec.paths).forEach(([path, pathItem]) => {
      Object.entries(pathItem).forEach(([method, operation]) => {
        if (!operation.parent || !operation.subParent) return;
  
        const parent = operation.parent;
        const subParent = operation.subParent;
  
        if (!grouped[parent]) {
          grouped[parent] = {};
        }
  
        if (!grouped[parent][subParent]) {
          grouped[parent][subParent] = [];
        }
  
        grouped[parent][subParent].push({
          path,
          method,
          operation
        });
      });
    });
  
    const navigation: NavigationItem[] = Object.entries(grouped).map(
      ([parentLabel, subParents]) => ({
        label: parentLabel,
        children: Object.entries(subParents).map(([subParentLabel, items]) => ({
          label: subParentLabel,
          children: items
        }))
      })
    );
  
    return navigation;
  }
  