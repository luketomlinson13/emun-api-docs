import { Operation, OpenApiSpec } from '../interfaces/openApiInterfaces';

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

      const parentTag = tags.find((tag) => tag.toLowerCase().startsWith('parent:'));
      if (!parentTag) return; // Must have Parent at least

      const parent = parentTag.replace(/parent:/i, '').trim();
      const subParentTag = tags.find((tag) => tag.toLowerCase().startsWith('subparent:'));
      const subParent = subParentTag ? subParentTag.replace(/subparent:/i, '').trim() : undefined;

      if (!grouped[parent]) {
        grouped[parent] = {};
      }

      const subParentKey = subParent || '__ungrouped__'; // fallback if no SubParent

      if (!grouped[parent][subParentKey]) {
        grouped[parent][subParentKey] = [];
      }

      grouped[parent][subParentKey].push({
        path,
        method,
        operation,
      });
    });
  });

  const navigation: NavigationItem[] = Object.entries(grouped).map(([parentLabel, subParents]) => ({
    label: parentLabel,
    children: Object.entries(subParents).map(([subParentLabel, items]) => ({
      label: subParentLabel === '__ungrouped__' ? '' : subParentLabel,
      children: items,
    })),
  }));

  return navigation;
}

