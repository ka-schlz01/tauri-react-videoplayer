import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { convertFileSrc } from '@tauri-apps/api/core';
import { CustomVideoPlayer } from "../components/CustomVideoPlayer";
import { Button } from "../components/ui/button";
import { HelpCircle } from "lucide-react";

export default function VideoPlayer() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [videoSource, setVideoSource] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>("");
    const [rawPath, setRawPath] = useState<string | null>(null);

    useEffect(() => {
        async function fetchVideo() {
            const file = searchParams.get("file");
            if (file) {
                const src = convertFileSrc(file);
                setVideoSource(src);
                setRawPath(file);

                // Extract filename from path
                const name = file.split(/[\\/]/).pop() || "Unknown Video";
                setFileName(name);
            }
        }
        fetchVideo();
    }, [searchParams]);

    return (
        <div className="p-6 flex-1 flex flex-col relative">
            <div className="flex-1 relative rounded-2xl overflow-hidden shadow-2xl border border-white/5 bg-black">
                {videoSource ? (
                    <CustomVideoPlayer
                        src={videoSource}
                        title={fileName}
                        autoPlay={true}
                        filePath={rawPath || undefined}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        Loading video...
                    </div>
                )}
            </div>

            {/* Bottom Right Help */}
            <div className="absolute bottom-6 right-6 z-50">
                <Button variant="ghost" size="icon" className="rounded-full bg-secondary/50 hover:bg-secondary text-muted-foreground">
                    <HelpCircle className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
}
