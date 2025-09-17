export function stripDollar(value: any): number | null {
  if (typeof value === 'string') {
    const numeric = value.replace(/[^\d.]/g, '');
    return numeric ? parseFloat(numeric) : null;
  }
  return value;
}