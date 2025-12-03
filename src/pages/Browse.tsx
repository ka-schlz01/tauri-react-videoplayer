import React, { useState, useCallback } from 'react';
import useApi from '../hooks/useApi';
import { Button } from '../components/ui/button';
import { Play, FolderOpen, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

const VIDEO_EXTS = ['.mp4', '.mkv', '.mov', '.webm', '.avi', '.flv', '.m4v', '.ts', '.m2ts', '.wmv', '.mp3'];

export default function Browse() {
  const api = useApi();
  const [files, setFiles] = useState<string[]>([]);
  const [dir, setDir] = useState<string | null>(null);
  const navigate = useNavigate();

  const pickFolder = useCallback(async () => {
    try {
      const p = await api.pickFolder();
      if (!p) {
        toast.info('No folder selected');
        return;
      }
      setDir(p);
      try {
        const paths = await api.readDirRecursive(p);
        setFiles(paths || []);
      } catch (err) {
        console.error('readDirRecursive failed', err);
        toast.error('Failed to read folder contents');
      }
    } catch (e) {
      console.error('Folder pick cancelled or failed', e);
      toast.error('Failed to pick folder');
    }
  }, [api]);

  const addToLibrary = useCallback(async (path: string) => {
    try {
      const title = path.split(/\\|\//).pop() || path;
      await api.addVideo(path, title, null);
      toast.success('Added to library');
    } catch (e) {
      console.error('Failed to add', e);
      toast.error('Failed to add file');
    }
  }, [api]);

  const addAllToLibrary = useCallback(async () => {
    if (files.length === 0) return;
    const results = await Promise.allSettled(files.map(async (f) => {
      try {
        const title = f.split(/\\|\//).pop() || f;
        await api.addVideo(f, title, null);
        return { path: f, ok: true };
      } catch (err) {
        return { path: f, ok: false };
      }
    }));
    const added = results.filter((r: any) => r.status === 'fulfilled' && r.value?.ok).length;
    toast.success(`Added ${added} of ${files.length} files to library`);
  }, [api, files]);

  const play = useCallback((path: string) => {
    navigate('/videoplayer?file=' + encodeURIComponent(path));
  }, [navigate]);

  return (
    <div className="p-10 max-w-5xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}><ArrowLeft className="w-4 h-4 mr-2"/>Back</Button>
        <h2 className="text-2xl font-semibold">Browse</h2>
        <Button onClick={pickFolder} variant="ghost" size="sm"><FolderOpen className="w-4 h-4 mr-2"/>Choose folder</Button>
        {files.length > 0 && (
          <Button onClick={addAllToLibrary} variant="default" size="sm">Add all to library</Button>
        )}
      </div>

      {!dir && (
        <div className="text-muted-foreground">No folder selected. Click "Choose folder" to pick a directory to browse.</div>
      )}

      {dir && (
        <div>
          <p className="text-sm text-muted-foreground mb-4">{dir}</p>
          <div className="flex flex-col gap-3">
            {files.length === 0 && <div className="text-sm text-muted-foreground">No video files found in this folder.</div>}
            {files.map((f) => (
              <div key={f} className="flex items-center gap-4 p-3 rounded-2xl bg-card/40 border border-white/5">
                <div className="w-24 h-16 rounded-lg bg-gradient-to-br from-slate-600 to-slate-400 flex items-center justify-center">
                  <Play className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{f.split(/\\|\//).pop()}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => play(f)}><Play className="w-4 h-4"/></Button>
                  <Button variant="ghost" size="icon" onClick={() => addToLibrary(f)}>Add</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
