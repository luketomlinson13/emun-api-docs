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
      const tags = operation.tags || [];

      const parentTag = tags.find(tag => tag.startsWith("Parent:"));
      const subParentTag = tags.find(tag => tag.startsWith("SubParent:"));

      if (!parentTag || !subParentTag) return;

      const parent = parentTag.replace("Parent:", "").trim();
      const subParent = subParentTag.replace("SubParent:", "").trim();

      if (!grouped[parent]) {
        grouped[parent] = {};
      }

      if (!grouped[parent][subParent]) {
        grouped[parent][subParent] = [];
      }

      grouped[parent][subParent].push({
        path,
        method,
        operation,
      });
    });
  });

  const navigation: NavigationItem[] = Object.entries(grouped).map(
    ([parentLabel, subParents]) => ({
      label: parentLabel,
      children: Object.entries(subParents).map(([subParentLabel, items]) => ({
        label: subParentLabel,
        children: items,
      })),
    })
  );

  return navigation;
}
