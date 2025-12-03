import { useState, useEffect, useCallback } from "react";
import useApi from '../hooks/useApi';
import { useNavigate } from "react-router";
import { Api } from "../services/api";
import { toast } from 'sonner';
import { Button } from "../components/ui/button";
import { ScrollArea } from "../components/ui/scroll-area";
import {
    Clock,
    Heart,
    Upload,
    FolderOpen,
    Star,
    Trash2,
    Play,
    HelpCircle
} from "lucide-react";
import { cn } from "../lib/utils";
import { getFileName, mapVideoToCard, confirmOrFallback } from '../lib/videoUtils';


export default function Start() {
    const api = useApi();
     const navigate = useNavigate();
     const [currentTime, setCurrentTime] = useState(new Date());
     const [searchQuery, setSearchQuery] = useState("");
    const [recentVideos, setRecentVideos] = useState<any[]>([]);

     useEffect(() => {
         const timer = setInterval(() => {
             setCurrentTime(new Date());
         }, 1000);
         return () => clearInterval(timer);
     }, []);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const recent = await api.listRecent(5, 0);
                const all = await api.listVideos();
                if (!mounted) return;
                const mappedRecent = (recent || []).map((v) => mapVideoToCard(v));
                setRecentVideos(mappedRecent);
                (api as any).__all_videos = all || [];
            } catch (e) {
                console.error('Failed to load recent/all videos', e);
            }
        })();
        return () => { mounted = false };
    }, [api]);
     const refresh = useCallback(async () => {
         try {
             const vids = await api.listRecent();
             const mapped = vids.map((v) => ({
                              ...mapVideoToCard(v),
             }));
             setRecentVideos(mapped);
         } catch (e) {
             console.error('Failed to refresh recent videos', e);
             toast.error('Failed to refresh videos');
         }
     }, [api]);

     const handleDelete = useCallback(async (id: number) => {
         try {
             const ok = await confirmOrFallback(api, 'Delete', 'Are you sure you want to delete this video?');
             if (!ok) return;

             await api.deleteVideo(id);
             await refresh();
             toast.success('Video deleted');
         } catch (e) {
             console.error('Failed to delete video', e);
             toast.error('Failed to delete video');
         }
     }, [api, refresh]);

     const handleToggleFavorite = useCallback(async (id: number, current: boolean) => {
         try {
             await api.setFavorite(id, !current);
             await refresh();
             toast.success(!current ? 'Added to favorites' : 'Removed from favorites');
         } catch (e) {
             console.error('Failed to set favorite', e);
             toast.error('Failed to update favorite');
         }
     }, [api, refresh]);

     const handleRate = useCallback(async (id: number) => {
         try {
             const raw = window.prompt('Rate this video (0-5):');
             if (!raw) return;
             const r = parseFloat(raw);
             if (isNaN(r) || r < 0 || r > 5) {
                 alert('Please enter a number between 0 and 5');
                 return;
             }
             await api.addRating(id, r);
             await refresh();
             toast.success('Rating saved');
         } catch (e) {
             console.error('Failed to rate video', e);
             toast.error('Failed to rate video');
         }
     }, [api, refresh]);

     const openFile = useCallback(async () => {
         const file = await api.openFileDialog();
         if (file) {
             try {
                 const title = getFileName(file);
                 await api.addVideo(file, title, null);
             } catch (e) {
                 console.warn('Failed to add video to DB', e);
             }
             navigate("/videoplayer?file=" + encodeURIComponent(file));
         }
     }, [api, navigate]);

     const onDrop = useCallback(async (e: React.DragEvent) => {
         e.preventDefault();
         if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
             const f = e.dataTransfer.files[0] as any;
             const filePath = f.path || f.name;
             if (filePath) {
                try {
                    const title = getFileName(filePath);
                    await api.addVideo(filePath, title, null);
                } catch (e) {
                    console.warn('Failed to add dropped video to DB', e);
                }
                navigate("/videoplayer?file=" + encodeURIComponent(filePath));
                 return;
             }
         }
         await openFile();
     }, [navigate]);

     const onDragOver = (e: React.DragEvent) => e.preventDefault();

     const formatTime = (date: Date) => {
         return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
     };

     const formatDate = (date: Date) => {
         return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
     };

    return (
        <div onDrop={onDrop} onDragOver={onDragOver} className="relative min-h-[calc(100vh-64px)]">
            <ScrollArea className="flex-1">
                <div className="p-10 max-w-5xl mx-auto pb-20">
                    <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <h1 className="text-7xl font-light tracking-tight text-foreground/90">
                            {formatTime(currentTime)}
                        </h1>
                        <p className="text-lg text-muted-foreground mt-2 font-medium">
                            {formatDate(currentTime)}
                        </p>
                    </div>

                    <div className="grid grid-cols-4 gap-6 mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        <ActionButton
                            icon={Upload}
                            label="Open File"
                            onClick={openFile}
                            delay={0}
                        />
                        <ActionButton
                            icon={Clock}
                            label="Recent"
                            delay={100}
                            onClick={() => navigate('/recent')}
                        />
                        <ActionButton
                            icon={Heart}
                            label="Favorites"
                            delay={200}
                            onClick={() => navigate('/favorites')}
                        />
                        <ActionButton
                            icon={FolderOpen}
                            label="Browse"
                            delay={300}
                            onClick={() => navigate('/browse')}
                        />
                    </div>

                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold tracking-tight">Hi there!</h2>
                            <p className="text-muted-foreground">Continue watching or open a new video</p>
                        </div>

                        <div className="flex flex-col gap-4">
                            {recentVideos.map((video, index) => (
                                 <VideoCard
                                     key={video.id}
                                     video={video}
                                     index={index}
                                     onDelete={() => handleDelete(video.id)}
                                     onToggleFavorite={() => handleToggleFavorite(video.id, !!video.favorite)}
                                     onRate={() => handleRate(video.id)}
                                 />
                            ))}
                         </div>

                    </div>
                </div>
            </ScrollArea>

            <div className="absolute bottom-6 right-6">
                <Button variant="ghost" size="icon" className="rounded-full bg-secondary/50 hover:bg-secondary text-muted-foreground">
                    <HelpCircle className="w-5 h-5" />
                </Button>
            </div>
        </div>
    )
}



function ActionButton({ icon: Icon, label, onClick, delay }: { icon: any, label: string, onClick?: () => void, delay: number }) {
    return (
        <button
            onClick={onClick}
            className="flex flex-col items-center gap-3 group"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="w-20 h-20 rounded-2xl bg-secondary/40 border border-white/5 flex items-center justify-center group-hover:bg-secondary/60 group-hover:scale-105 transition-all duration-300 shadow-sm group-hover:shadow-md group-active:scale-95">
                <Icon className="w-8 h-8 text-foreground/80 group-hover:text-foreground transition-colors" strokeWidth={1.5} />
            </div>
            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
        </button>
    )
}

function VideoCard({ video, index, onDelete, onToggleFavorite, onRate }: { video: any, index: number, onDelete: () => void, onToggleFavorite: () => void, onRate: () => void }) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => { if (video?.path) navigate('/videoplayer?file=' + encodeURIComponent(video.path)); }}
            className="group flex items-center gap-4 p-3 rounded-2xl bg-card/40 border border-white/5 hover:bg-card/60 hover:border-white/10 transition-all duration-300 cursor-pointer"
            style={{ animationDelay: `${400 + (index * 100)}ms` }}
        >
            <div className={cn(
                "w-24 h-16 rounded-lg shadow-inner flex items-center justify-center relative overflow-hidden",
                video.thumbnail
            )}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                <Play className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 drop-shadow-md" fill="currentColor" />
                <span className="absolute bottom-1 right-1 text-[10px] font-medium text-white bg-black/60 px-1 rounded">
                    {video.duration}
                </span>
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">{video.title}</h3>
                <p className="text-sm text-muted-foreground">{video.timeAgo}</p>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className={`rounded-full ${video.favorite ? 'text-red-400' : 'text-muted-foreground'}`} onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}>
                    <Heart className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={(e) => { e.stopPropagation(); onRate(); }}>
                    <Star className="w-5 h-5" />
                </Button>

                <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
                    <Trash2 className="w-5 h-5" />
                </Button>
            </div>
        </div>
    )
}
