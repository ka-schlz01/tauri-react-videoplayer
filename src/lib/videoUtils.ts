import { Api } from '../services/api';
import { formatDuration as _formatDuration } from './formatters';

export function getFileName(p?: string): string {
  if (!p) return 'Unknown';
  const idx = Math.max(p.lastIndexOf('/'), p.lastIndexOf('\\'));
  return idx >= 0 ? p.slice(idx + 1) : p;
}

export function formatDuration(secs: number | null | undefined): string {
  return _formatDuration(secs);
}

export async function confirmOrFallback(api: Api, title: string, message: string): Promise<boolean> {
  try {
    const res = await api.confirmDialog(title, message);
    return !!res;
  } catch (err) {
    return window.confirm(message);
  }
}

export function timeAgo(v: any): string {
  if (v?.last_watched) {
    try {
      const d = new Date(v.last_watched);
      const diff = Date.now() - d.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      if (days === 0) return 'Today';
      if (days === 1) return '1 day ago';
      if (days < 7) return `${days} days ago`;
      if (days < 30) return `${Math.floor(days / 7)} week(s) ago`;
      return `${Math.floor(days / 30)} month(s) ago`;
    } catch (e) {
      return 'Some time ago';
    }
  }
  return 'New';
}

export function mapVideoToCard(v: any) {
  return {
    id: v.id,
    title: v.title || getFileName(v.path),
    duration: v.duration ? formatDuration(v.duration) : '—',
    timeAgo: timeAgo(v),
    thumbnail: 'bg-gradient-to-br from-slate-600 to-slate-400',
    favorite: v.favorite === 1 || v.favorite === true,
    path: v.path,
  };
}

export default {
  getFileName,
  formatDuration,
  confirmOrFallback,
  timeAgo,
  mapVideoToCard,
};
