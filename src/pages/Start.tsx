import {Button} from "@nextui-org/react";
import {useState} from "react";
import {Api} from "../services/api.ts";
import {useNavigate} from "react-router";

export default function Start() {
    const [api, setApi] = useState<Api>(new Api());
    const navigate = useNavigate();

    const openFile = async () => {
        const file = await api.openFileDialog();
        navigate("/videoplayer?file=" + file);
    }

    return (
        <div className={"w-full h-full flex justify-center items-center"}>
            <div className={"flex flex-col justify-center"}>
                <div className={"w-64 h-64"}>
                    <img className={"opacity-60 pointer-events-none"} alt="" src="/icon.png"/>
                </div>
                <Button onPress={openFile} color="primary" variant={"ghost"}>Open file</Button>
            </div>
        </div>
    )
}
