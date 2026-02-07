export function parseDateOnlyToStart(dateStr: string): Date {
  // dateStr no formato YYYY-MM-DD
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0));
}

export function parseDateOnlyToEnd(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 23, 59, 59, 999));
}
