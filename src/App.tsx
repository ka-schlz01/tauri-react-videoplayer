import {useState} from "react";
import reactLogo from "./assets/react.svg";
import {invoke} from "@tauri-apps/api/core";
import "./styles/index.css";
import IconButton from "./components/IconButton.tsx";
import {Button, NextUIProvider} from "@nextui-org/react";
import {open} from '@tauri-apps/plugin-dialog';
import {Api} from "./services/api.ts";
import {BrowserRouter, Route, Routes} from "react-router";
import Start from "./pages/Start.tsx";
import VideoPlayer from "./pages/VideoPlayer.tsx";


function App() {
    const [greetMsg, setGreetMsg] = useState("");
    const [name, setName] = useState("");

    return (
        <NextUIProvider>
            <main className={"overflow-hidden"}>
                <BrowserRouter>
                    <Routes>
                        <Route element={<Start />} path={""}/>
                        <Route element={<VideoPlayer />} path={"/videoplayer"}/>
                    </Routes>
                </BrowserRouter>
            </main>
        </NextUIProvider>
    );
}

export default App;
