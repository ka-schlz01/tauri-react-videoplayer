import React, { useEffect, useState, useCallback } from 'react';
import useApi from '../hooks/useApi';
import { Button } from '../components/ui/button';
import { Play, Heart, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { getFileName, confirmOrFallback } from '../lib/videoUtils';
import { formatDuration } from '../lib/formatters';

export default function Favorites() {
  const api = useApi();
  const [videos, setVideos] = useState<any[]>([]);

  const load = useCallback(async (pageIndex = 0) => {
    try {
      const vids = await api.listFavorites();

      const favs = vids.map(v => ({
        id: v.id,
        title: v.title || getFileName(v.path),
        duration: v.duration ? formatDuration(v.duration) : '—',
        path: v.path,
        favorite: true,
      }));
      setVideos(favs);
    } catch (e) {
      console.error('Failed to load favorites', e);
      toast.error('Failed to load favorites');
    }
  }, [api]);

  useEffect(() => { load(); }, [load]);

  const handleUnfavorite = async (id:number) => {
    try {
      await api.setFavorite(id, false);
      toast.success('Removed from favorites');
      await load();
    } catch (e) {
      console.error(e);
      toast.error('Failed to update favorite');
    }
  }

  const handleDelete = async (id:number) => {
    try {
      const confirmed = await confirmOrFallback(api, 'Delete', 'Are you sure you want to delete this video?');
      if (!confirmed) return;

      await api.deleteVideo(id);
      toast.success('Video deleted');
      await load();
    } catch (e) {
      console.error(e);
      toast.error('Failed to delete video');
    }
  }

  return (
    <div className="p-10 max-w-5xl mx-auto pb-20">
      <h2 className="text-2xl font-semibold mb-6">Favorites</h2>
      <div className="flex flex-col gap-4">
        {videos.map((video) => (
          <div key={video.id} className="flex items-center gap-4 p-3 rounded-2xl bg-card/40 border border-white/5">
            <div className={cn("w-24 h-16 rounded-lg shadow-inner flex items-center justify-center relative overflow-hidden", 'bg-linear-to-br from-slate-600 to-slate-400')}>
              <Play className="w-6 h-6 text-white" />
              <span className="absolute bottom-1 right-1 text-[10px] font-medium text-white bg-black/60 px-1 rounded">{video.duration}</span>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground">{video.title}</h3>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => handleUnfavorite(video.id)}><Heart className="w-5 h-5 text-red-400"/></Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(video.id)}><Trash2 className="w-5 h-5"/></Button>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
