import ReactPlayer from "react-player";
import {useEffect, useRef, useState} from "react";
import {useParams, useSearchParams} from "react-router";
import { convertFileSrc } from '@tauri-apps/api/core';
import {appDataDir, BaseDirectory, join} from "@tauri-apps/api/path";
import {readFile} from "@tauri-apps/plugin-fs";
import VideoPlayerControl from "../components/VideoPlayerControl.tsx";
import {Slider} from "@nextui-org/react";

interface PlayerState {
    isPlaying: boolean, volumeOpen: boolean, fullScreen: boolean, volume: number, showControls: boolean, loop: boolean, cinemaView: boolean
}

export default function VideoPlayer({autoplay = true}) {
    let [searchParams] = useSearchParams();
    const [videoSource, setVideoSource] = useState<string>()
    const [state, setState] = useState<PlayerState>({
        isPlaying: autoplay, volume: 0, fullScreen: false, volumeOpen: false, showControls: false, loop: false, cinemaView: false,
    })
    useEffect(() => {
        async function fetchVideo() {
            const file = searchParams.get("file");
            if(file) {
                const filePath = await join(file, 'assets/video.mp4');
                const src = convertFileSrc(file);
                console.log(src)
                setVideoSource(src)

            }
        }
        fetchVideo();
    }, []);

    const [time, setTime] = useState({duration: 0, played: 0})
    const playerRef = useRef<ReactPlayer>();
    const ref = (player: ReactPlayer) => {
        playerRef.current = player;
    };



    return (
        <div className={"bg-primary h-screen w-full"}>
            <div className={"flex flex-col h-full"}>
                {
                   videoSource != null &&
                    <div className={"grow border border-white"}>
                        <div className={"flex flex-col justify-center h-full"}>
                            <div className={"aspect-video w-full max-h-min"}>
                                <ReactPlayer
                                    width={"100%"}
                                    height="100%"
                                    style={{objectFit: 'cover'}}
                                    ref={ref}
                                    url={videoSource}
                                    controls={false}
                                    playing={state.isPlaying}
                                    volume={state.volume}
                                    onProgress={() => onPlaying()}
                                    loop={state.loop}
                                />
                            </div>
                        </div>
                    </div>
                }
                <div className={"basis-20 shrink-0"}>
                    {/* <VideoPlayerControl/>*/}
                </div>
            </div>
        </div>
    );

    function onPlaying() {
        if (playerRef.current) {
            let copy = {...time};
            copy.duration = playerRef.current.getDuration();
            copy.played = playerRef.current?.getCurrentTime();
            setTime(copy);
        } else {
            console.log("undef")
        }
    }
}
