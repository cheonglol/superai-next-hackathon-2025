export function formatNumber(value: number): string {
  return value.toLocaleString();
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function formatPercentage(value: number): string {
  return `${Math.abs(value)}%`;
}

export function formatTrend(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}`;
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
