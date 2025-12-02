export function formatDuration(secs: number | null | undefined): string {
  if (!secs && secs !== 0) return '—';
  const s = Number(secs ?? 0);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

export default {
  formatDuration,
};
