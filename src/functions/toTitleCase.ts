export function toTitleCase(input?: string): string {
  if (!input) return '';
  const spaced = input.replace(/([a-z])([A-Z])/g, '$1 $2');
  return spaced
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
