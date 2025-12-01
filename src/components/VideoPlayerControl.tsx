import React, {useState} from "react";
import {MdPlayArrow, MdSkipNext, MdSkipPrevious, MdVolumeUp, MdFullscreen, MdFullscreenExit, MdPause} from "react-icons/md";
import { Button, Slider, IconButton } from "./shadcn";


export default function VideoPlayerControl() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.8);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [progress, setProgress] = useState(0);

    return (
        <div className="w-full bg-[rgba(0,0,0,0.6)] text-white">
            <div className="px-4 pt-2">
                <div
                    onDoubleClick={() => setIsPlaying((s) => !s)}
                    title="Double-click to play/pause"
                >
                    <Slider
                        min={0}
                        max={100}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProgress(Number(e.target.value))}
                        aria-label="progress"
                    />
                </div>
            </div>

            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                    <IconButton aria-label="previous">
                        <MdSkipPrevious size={22} />
                    </IconButton>

                    <Button
                        onClick={() => setIsPlaying((s) => !s)}
                        variant="default"
                        className="w-12 h-12 flex items-center justify-center rounded-full p-0 bg-white text-black"
                        aria-label={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying ? <MdPause size={22} /> : <MdPlayArrow size={28} />}
                    </Button>

                    <IconButton aria-label="next">
                        <MdSkipNext size={22} />
                    </IconButton>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <MdVolumeUp size={18} />
                        <Slider
                            min={0}
                            max={1}
                            step={0.01}
                            value={[volume]}
                            onValueChange={(v: number[]) => setVolume(v?.[0] ?? 0)}
                            aria-label="volume"
                            className={
                                "w-28 " +
                                "[&>*:first-child]:h-2 [&>*:first-child]:rounded-full [&>*:first-child]:bg-white/20 " +
                                "[&>*:first-child>div]:bg-white [&>*:first-child>div]:rounded-full " +
                                "[&>*:nth-child(2)]:h-3 [&>*:nth-child(2)]:w-3 [&>*:nth-child(2)]:bg-white [&>*:nth-child(2)]:border [&>*:nth-child(2)]:border-white/20"
                            }
                        />
                    </div>

                    <div className="text-sm font-mono">0:00 / 9:56</div>

                    <button
                        onClick={() => setIsFullscreen((s) => !s)}
                        className="p-1 text-white opacity-90 hover:opacity-100"
                        aria-label="fullscreen"
                    >
                        {isFullscreen ? <MdFullscreenExit size={18}/> : <MdFullscreen size={18}/>}
                    </button>
                </div>
            </div>
        </div>
    );
}
