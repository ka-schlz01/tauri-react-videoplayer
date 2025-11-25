
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { Api } from "../services/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { ScrollArea } from "../components/ui/scroll-area";
import {
  Home,
  Search,
  Clock,
  Heart,
  Settings,
  Upload,
  FolderOpen,
  FileVideo,
  MoreHorizontal,
  Play,
  User,
  HelpCircle
} from "lucide-react";
import { cn } from "../lib/utils";
import {RECENT_VIDEOS} from "@/data/mock.ts";




export default function Start() {
    const [api] = useState<Api>(new Api());
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const openFile = async () => {
        const file = await api.openFileDialog();
        if (file) navigate("/videoplayer?file=" + encodeURIComponent(file));
    }

    const onDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const f = e.dataTransfer.files[0] as any;
            const filePath = f.path || f.name;
            if (filePath) {
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
        <div className="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans selection:bg-primary/20">
            {/* Sidenav*/}
            <aside className="w-16 flex flex-col items-center py-6 border-r border-border/40 bg-card/30 backdrop-blur-xl z-20">
                <div className="flex flex-col gap-6 w-full items-center">
                    <SidebarIcon icon={Home} active />
                    <SidebarIcon icon={Search} />
                    <SidebarIcon icon={Clock} />
                    <SidebarIcon icon={Heart} />
                </div>
                <div className="mt-auto flex flex-col gap-6 w-full items-center">
                    <SidebarIcon icon={Settings} />
                </div>
            </aside>

            {/* Main Content */}
            <main
                className="flex-1 flex flex-col relative bg-background"
                onDrop={onDrop}
                onDragOver={onDragOver}
            >
                <header className="h-16 flex items-center justify-between px-8 pt-4">
                    <div className="flex gap-2 w-20">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>

                    <div className="flex-1 max-w-md mx-auto relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Search"
                            className="pl-10 bg-secondary/50 border-transparent focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary/50 rounded-lg h-10 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="w-20 flex justify-end">
                        <Avatar className="w-8 h-8 cursor-pointer hover:opacity-80 transition-opacity">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                        </Avatar>
                    </div>
                </header>

                <ScrollArea className="flex-1">
                    <div className="p-10 max-w-5xl mx-auto pb-20">
                        {/* Clock & Date */}
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
                            />
                            <ActionButton
                                icon={Heart}
                                label="Favorites"
                                delay={200}
                            />
                            <ActionButton
                                icon={FolderOpen}
                                label="Browse"
                                delay={300}
                            />
                        </div>

                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                            <div className="mb-6">
                                <h2 className="text-2xl font-semibold tracking-tight">Hi there!</h2>
                                <p className="text-muted-foreground">Continue watching or open a new video</p>
                            </div>

                            <div className="flex flex-col gap-4">
                                {RECENT_VIDEOS.map((video, index) => (
                                    <VideoCard key={video.id} video={video} index={index} />
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
            </main>
        </div>
    )
}

function SidebarIcon({ icon: Icon, active }: { icon: any, active?: boolean }) {
    return (
        <button className={cn(
            "p-3 rounded-xl transition-all duration-300 group relative",
            active ? "text-primary" : "text-muted-foreground hover:text-foreground"
        )}>
            <Icon className="w-6 h-6" strokeWidth={active ? 2.5 : 2} />
            {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
            )}
        </button>
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

function VideoCard({ video, index }: { video: any, index: number }) {
    return (
        <div
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

            {/* Info */}
            <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">{video.title}</h3>
                <p className="text-sm text-muted-foreground">{video.timeAgo}</p>
            </div>

            {/* Actions */}
            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">
                <MoreHorizontal className="w-5 h-5" />
            </Button>
        </div>
    )
}

