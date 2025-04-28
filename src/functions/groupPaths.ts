import { Operation, OpenApiSpec } from '../interfaces/openApiInterfaces';
import { removePrefix } from './removePrefix';
import { toTitleCase } from './toTitleCase';

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
      const subParentTag = tags.find((tag) => tag.toLowerCase().startsWith('subparent:'));

      if (!parentTag || !subParentTag) return;

      const parent = toTitleCase(removePrefix(parentTag, 'parent:'));
      const subParent = toTitleCase(removePrefix(subParentTag, 'subparent:'));

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
