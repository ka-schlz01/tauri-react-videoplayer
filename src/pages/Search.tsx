import { useEffect, useState, useMemo } from 'react';
import { Input } from '../components/ui/input';
import { Api } from '../services/api';
import useApi from '../hooks/useApi';
import { useNavigate } from 'react-router';
import { Search as SearchIcon } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function SearchPage() {
  const api = useApi();
  const [query, setQuery] = useState('');
  const [videos, setVideos] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const all = await api.listVideos();
        if (!mounted) return;
        setVideos(all || []);
      } catch (e) {
        console.error('Failed to load videos for search', e);
      }
    })();
    return () => { mounted = false };
  }, [api]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return videos.filter(v => {
      const title = (v.title || v.path || '').toString().toLowerCase();
      return title.includes(q) || (v.path||'').toLowerCase().includes(q);
    });
  }, [query, videos]);

  return (
    <div className="p-10 max-w-5xl mx-auto pb-20">
      <h2 className="text-2xl font-semibold mb-6">Search Videos</h2>

      <div className="mb-12">
        <Input
          placeholder="Search for videos..."
          value={query}
          onChange={(e) => setQuery((e.target as HTMLInputElement).value)}
          className="max-w-3xl"
        />
      </div>

      {query === '' ? (
        <div className="flex flex-col items-center justify-start mt-20 text-muted-foreground">
          <SearchIcon className="w-12 h-12 mb-4" />
          <div className="text-lg font-medium">Start searching</div>
          <div className="mt-2">Enter a keyword to find your videos</div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {results.length === 0 && (
            <div className="text-sm text-muted-foreground">No results for "{query}"</div>
          )}
          {results.map(r => (
            <div key={r.id || r.path} className="flex items-center gap-4 p-3 rounded-2xl bg-card/40 border border-white/5">
              <div className="w-24 h-14 rounded-md bg-gradient-to-br from-slate-600 to-slate-400 flex items-center justify-center">
                <SearchIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-medium truncate">{r.title || r.path}</div>
                <div className="text-sm text-muted-foreground">{r.path}</div>
              </div>
              <div>
                <Button variant="ghost" size="icon" onClick={() => navigate('/videoplayer?file=' + encodeURIComponent(r.path))}>Play</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
