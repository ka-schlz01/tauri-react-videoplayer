import {Button, Slider, Input} from "@nextui-org/react";
import {MdPlayArrow, MdSkipNext, MdSkipPrevious} from "react-icons/md";



export default function VideoPlayerControl() {
    return (
        <div className={"h-screen w-full bg-primary"}>
            <div className={"w-full flex items-center justify-center"}>
                <div className={"w-full flex justify-center"}>
                    <Slider
                        color={"danger"}
                        size="sm"
                        step={0.01}
                        maxValue={1}
                        minValue={0}
                        aria-label="Temperature"
                        defaultValue={0.2}
                        className="w-9/12"
                    />
                </div>
            </div>
            <div>
                <Button isIconOnly color={"default"} variant={"light"} aria-label="Like">
                    <MdSkipPrevious color={"white"} size={64}/>
                </Button>
                <Button isIconOnly color={"default"} variant={"light"} aria-label="Like">
                    <MdPlayArrow color={"white"} size={64}/>
                </Button>
                <Button isIconOnly color={"default"} variant={"light"} aria-label="Like">
                    <MdSkipNext color={"white"} size={64}/>
                </Button>
            </div>
            </div>
            )
            }
