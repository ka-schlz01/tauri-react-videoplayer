import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize,
  Minimize
} from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { cn } from "../lib/utils";
import useApi from '../hooks/useApi';

interface CustomVideoPlayerProps {
  src: string;
  title?: string;
  autoPlay?: boolean;
  onBack?: () => void;
  filePath?: string;
}

export function CustomVideoPlayer({ src, title, autoPlay = false, onBack, filePath }: CustomVideoPlayerProps) {
  const api = useApi();
  const _onBack = onBack;
  const [viewIncremented, setViewIncremented] = useState(false);
  const [durationUpdated, setDurationUpdated] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playerHeight, setPlayerHeight] = useState<string | undefined>(undefined);
  const [isCinema, setIsCinema] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onDurationChange = () => setDuration(video.duration);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onWaiting = () => setIsBuffering(true);
    const onPlaying = () => setIsBuffering(false);
    const onEnded = () => setIsPlaying(false);

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("durationchange", onDurationChange);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("ended", onEnded);

    if (autoPlay) {
      video.play().catch(() => {
      });
    }
    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("durationchange", onDurationChange);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("ended", onEnded);
    };
  }, [src, autoPlay]);

  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    let mounted = true;

    const handleFirstPlay = async () => {
      if (!mounted) return;
      if (viewIncremented) return;
      if (!filePath) {
        setViewIncremented(true);
        return;
      }
      try {
        const vids = await api.listVideos();
        let vid = vids.find(v => v.path === filePath);
        if (!vid) {
          const dur = duration && duration > 0 ? Math.round(duration) : null;
          vid = await api.addVideo(filePath, title || undefined, dur);
        }
        if (vid && typeof (vid as any).id === 'number') {
          await api.incrementView((vid as any).id);
        }
      } catch (e) {
        console.warn('Failed to increment view', e);
      } finally {
        setViewIncremented(true);
      }
    };

    video.addEventListener('play', handleFirstPlay, { once: true });

    return () => {
      mounted = false;
      video.removeEventListener('play', handleFirstPlay);
    };
  }, [filePath, api, viewIncremented, duration, title]);

  useEffect(() => {
    if (durationUpdated) return;
    if (!filePath) return;
    if (!duration || duration <= 0) return;

    let mounted = true;
    (async () => {
      try {
        await api.updateVideoDurationByPath(filePath, Math.round(duration));
        if (mounted) setDurationUpdated(true);
      } catch (e) {
        console.warn('Failed to update video duration in DB', e);
      }
    })();

    return () => { mounted = false };
  }, [duration, filePath, api, durationUpdated]);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) {
      setShowControls(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    } else {
      handleMouseMove();
    }
  }, [isPlaying, handleMouseMove]);

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const handleVolumeChange = useCallback((value: number[]) => {
    const newVolume = value[0];
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  }, []);

  const handleSeek = useCallback((value: number[]) => {
    const newTime = value[0];
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const cont = containerRef.current;
    if (!cont) return;

    const update = () => {
      const w = cont.clientWidth || 0;
      let h = Math.round((w * 9) / 16);
      const maxH = Math.max(200, window.innerHeight - 160);
      if (h > maxH) h = maxH;
      setPlayerHeight(h + 'px');
    };

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => update());
      ro.observe(cont);
      update();
      return () => ro.disconnect();
    }

    window.addEventListener('resize', update);
    update();
    return () => window.removeEventListener('resize', update);
  }, [src]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    if (isCinema) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = prev;
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCinema) setIsCinema(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [isCinema]);

  return (
    <div
      ref={containerRef}
       style={{ height: isCinema ? '100vh' : (playerHeight ?? undefined), position: isCinema ? 'fixed' as const : undefined, left: isCinema ? 0 : undefined, top: isCinema ? 0 : undefined, width: isCinema ? '100vw' : undefined, zIndex: isCinema ? 60 : undefined }}
       className={cn(
         "relative w-full bg-black group overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/10",
         isCinema && "bg-black/95"
       )}
       onMouseMove={handleMouseMove}
       onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-contain"
        onClick={togglePlay}
      />

      {!isPlaying && !isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center animate-in fade-in zoom-in duration-300">
            <Play className="w-10 h-10 text-white fill-white ml-1" />
          </div>
        </div>
      )}

      <div
        className={cn(
          "absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/40 transition-opacity duration-300 flex flex-col justify-between p-6",
          showControls ? "opacity-100" : "opacity-0 cursor-none"
        )}
      >
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-sm font-medium text-white/70 uppercase tracking-wider mb-1">Now Playing</h2>
            <h1 className="text-2xl font-semibold text-white">{title || "Unknown Video"}</h1>
          </div>
        </div>

        <div className="space-y-4">
          <div className="group/slider">
            <Slider
              value={[currentTime]}
              min={0}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full" onClick={() => videoRef.current && (videoRef.current.currentTime -= 10)}>
                <SkipBack className="w-5 h-5" />
              </Button>

              <Button
                variant="default"
                size="icon"
                className="w-12 h-12 rounded-full bg-white text-black hover:bg-white/90 hover:scale-105 transition-all"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 fill-current" />
                ) : (
                  <Play className="w-6 h-6 fill-current ml-0.5" />
                )}
              </Button>

              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full" onClick={() => videoRef.current && (videoRef.current.currentTime += 10)}>
                <SkipForward className="w-5 h-5" />
              </Button>

              <div className="flex items-center gap-2 ml-2 group/volume">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full" onClick={toggleMute}>
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </Button>
                <div className="w-0 overflow-hidden group-hover/volume:w-24 transition-all duration-300">
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    min={0}
                    max={1}
                    step={0.01}
                    onValueChange={handleVolumeChange}
                    className="w-24"
                  />
                </div>
              </div>

              <span className="text-sm font-medium text-white/80 font-mono ml-2">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full" onClick={() => setIsCinema((c) => !c)}>
                {isCinema ? (
                  <span className="sr-only">Exit cinema</span>
                ) : (
                  <span className="sr-only">Cinema mode</span>
                )}
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><path d="M8 21h8"></path></svg>
              </Button>

              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full" onClick={toggleFullscreen}>
                {isFullscreen ? (
                  <Minimize className="w-5 h-5" />
                ) : (
                  <Maximize className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showControls && (
         <div className="absolute bottom-6 right-6 pointer-events-none">
         </div>
      )}
    </div>
  );
}
