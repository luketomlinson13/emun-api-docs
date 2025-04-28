export function removePrefix(str: string | undefined, prefix: string): string | undefined {
  if (!str) return undefined;
  const regex = new RegExp(`^${prefix}`, 'i');
  return str.replace(regex, '').trim();
}
