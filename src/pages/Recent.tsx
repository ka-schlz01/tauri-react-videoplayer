import { useEffect, useState, useCallback } from 'react';
import useApi from '../hooks/useApi';
import { Play } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { mapVideoToCard } from '../lib/videoUtils';

export default function Recent() {
  const api = useApi();
  const [videos, setVideos] = useState<any[]>([]);
  const navigate = useNavigate();
  const load = useCallback(async () => {
    try {
      const vids = await api.listRecent(100, 0);
      if (!vids) {
        setVideos([]);
        return;
      }
      const mapped = vids.map((v) => mapVideoToCard(v));
      setVideos(mapped);
    } catch (e) {
      console.error('Failed to load recent', e);
      toast.error('Failed to load recent videos');
    }
  }, [api]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="p-10 max-w-5xl mx-auto pb-20">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Recent Videos</h2>
          <p className="text-sm text-muted-foreground mt-1">{videos.length} videos in your history</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">{}</Button>
          <Button variant="ghost" size="icon">{}</Button>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {videos.map((v) => (
          <div key={v.id} className="flex items-center gap-4 p-4 rounded-2xl bg-card/40 border border-white/5">
            <div className={cn("w-28 h-16 rounded-md flex items-center justify-center relative overflow-hidden", v.thumbnail)}>
              <div className="absolute inset-0 bg-black/20" />
              <Play className="w-6 h-6 text-white opacity-90 z-10" />
              <span className="absolute left-2 bottom-2 text-xs font-medium text-white bg-black/60 px-2 rounded">{v.duration}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-foreground truncate">{v.title}</div>
              <div className="text-sm text-muted-foreground">{v.timeAgo}</div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => navigate('/videoplayer?file=' + encodeURIComponent(v.path))}>Play</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
