import { openLink } from "../../utils/openLink";
import QuickLaunch from "./quick-launch";

export default function Sidebar() {
    return (
        <div className="flex flex-col items-center justify-center h-screen w-96 border-r border-white/10 relative overflow-hidden">
            <div className="absolute -top-10 -left-14 bg-[#BCB1E7] blur-3xl w-64 h-64 rounded-full rounded-bl-none rounded-tl-none opacity-40" />
            <div className="flex flex-col items-center justify-start h-full w-full p-4 z-50 px-6">
                <div className="w-full h-44 flex flex-col justify-center items-start gap-2">
                    <a
                        href="/"
                        className="flex gap-2 hover:opacity-80 transition-opacity"
                    >
                        <img src="/Dio.svg" alt="Dione logo" className="h-8 w-8" />
                        <h1 className="font-semibold text-3xl">Dione</h1>
                    </a>
                    <p className="text-xs text-neutral-400 px-0.5">Explore, Install, Innovate — in 1 Click.</p>
                    <div className="mt-2 w-full flex gap-2 px-0.5">
                        <button onClick={() => openLink("https://applio.org/discord")} className="text-xs w-full bg-white hover:bg-white/80 transition-colors duration-400 rounded-full text-black font-semibold py-1 text-center">Discord</button>
                        <button onClick={() => openLink("https://github.com/dioneapp/dioneapp/issues")} className="text-xs w-full bg-white hover:bg-white/80 transition-colors duration-400 rounded-full text-black font-semibold py-1">Report a bug</button>
                    </div>
                    <div className="h-0.5 rounded-full w-full from-transparent via-white/80 to-transparent bg-gradient-to-l mt-4" />
                </div>
                <QuickLaunch />
            </div>
        </div>
    )
}