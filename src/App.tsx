import { useState, useEffect } from "react";
import "./styles/index.css";
import { BrowserRouter, Route, Routes, Outlet, useNavigate } from "react-router";
import Start from "./pages/Start.tsx";
import VideoPlayer from "./pages/VideoPlayer.tsx";
import Favorites from "./pages/Favorites";
import Recent from "./pages/Recent";
import SearchPage from "./pages/Search";
import Settings from "./pages/Settings";
import { Toaster } from "./components/ui/sonner";
import { Input } from "./components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { Home, Search, Clock, Heart, Settings as SettingsIcon, User } from "lucide-react";
import { cn } from "./lib/utils";
import Browse from "./pages/Browse";

function Layout() {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    return (
        <div className="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans selection:bg-primary/20">
            <aside className="w-16 flex flex-col items-center py-6 border-r border-border/40 bg-card/30 backdrop-blur-xl z-20">
                <div className="flex flex-col gap-6 w-full items-center">
                    <SidebarIcon icon={Home} active onClick={() => navigate('/')} />
                    <SidebarIcon icon={Search} onClick={() => navigate('/search')} />
                    <SidebarIcon icon={Clock} onClick={() => navigate('/recent')} />
                    <SidebarIcon icon={Heart} onClick={() => navigate('/favorites')} />
                </div>
                <div className="mt-auto flex flex-col gap-6 w-full items-center">
                    <SidebarIcon icon={SettingsIcon} onClick={() => navigate('/settings')} />
                </div>
            </aside>

            <main className="flex-1 flex flex-col relative bg-background">
                <header className="h-16 flex items-center justify-between px-8 pt-4">
                    <div className="flex-1 max-w-md mx-auto relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Search"
                            className="pl-10 bg-secondary/50 border-transparent focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary/50 rounded-lg h-10 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery((e.target as HTMLInputElement).value)}
                        />
                    </div>

                    <div className="w-20 flex justify-end">
                        <Avatar className="w-8 h-8 cursor-pointer hover:opacity-80 transition-opacity">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                        </Avatar>
                    </div>
                </header>

                <div className="flex-1 overflow-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

function SidebarIcon({ icon: Icon, active, onClick }: { icon: any, active?: boolean, onClick?: () => void }) {
    return (
        <button onClick={onClick} className={cn(
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

function App() {
    useEffect(() => {
        import("./lib/theme").then((m) => m.initTheme());
    }, []);

    return (
        <main className={"overflow-hidden"}>
            <Toaster />
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <Route index element={<Start />} />
                        <Route path="videoplayer" element={<VideoPlayer />} />
                        <Route path="recent" element={<Recent />} />
                        <Route path="search" element={<SearchPage />} />
                        <Route path="favorites" element={<Favorites />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="browse" element={<Browse />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </main>
    );
}

export default App;
