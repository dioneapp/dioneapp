import { getCurrentPort } from "@renderer/utils/getPort";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { openLink } from "../../utils/openLink";
import QuickLaunch from "./quick-launch";
import dio from "@assets/svgs/dio.svg";
import settings from "@assets/svgs/settings.svg";
import discord from "@assets/svgs/discord.svg";
import github from "@assets/svgs/github.svg";

export default function Sidebar() {
    const [authToken, setAuthToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [logged, setLogged] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const session = localStorage.getItem('session');
        const user = localStorage.getItem('user');
        if (session && user) {
            setLogged(true);
        } else {
            setLogged(false);
        }
    }, [])

    useEffect(() => {
        const listenForAuthToken = () => {
            window.electron.ipcRenderer.on('auth-token', (_event, authToken) => {
                setAuthToken(authToken);
            });
            window.electron.ipcRenderer.on('refresh-token', (_event, refreshToken) => {
                setRefreshToken(refreshToken);
            });
        }

        const listenForDownloadToken = () => {
            window.electron.ipcRenderer.on('download', (_event, downloadID) => {
                console.log('go to download', downloadID);
                navigate(`/install/${downloadID}`);
            });
        }

        listenForAuthToken();
        listenForDownloadToken();
    }, [])

    useEffect(() => {
        if (authToken && refreshToken) {
            async function setSessionAPI(token: string, refreshToken: string) {
                const port = await getCurrentPort();
                const response = await fetch(`http://localhost:${port}/set-session`, {
                    headers: {
                        'accessToken': token,
                        'refreshToken': refreshToken
                    }
                });
                const data = await response.json();
                if (data.session) {
                    setSession(data.session);
                    setUser(data.user);
                    setLogged(true)
                }
            }

            setSessionAPI(authToken, refreshToken);
        }
    }, [authToken, refreshToken])

    async function setSession(session: any) {
        localStorage.setItem('session', JSON.stringify(session));
    }
    async function setUser(user: any) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    async function logout() {
        localStorage.removeItem('session');
        localStorage.removeItem('user');
        setLogged(false);
    }


    return (
        <div className="flex flex-col items-center justify-center h-screen w-70 border-r border-white/10 overflow-hidden">
            <div className="absolute -top-10 -left-14 bg-[#BCB1E7] blur-3xl w-64 h-64 rounded-full rounded-bl-none rounded-tl-none opacity-40" />
            <div className="flex flex-col items-center justify-start h-full w-full p-4 z-50 px-6">
                <div className="w-full h-44 flex flex-col justify-center items-start gap-2">
                    <Link
                        to={"/"}
                        className="flex gap-2 hover:opacity-80 transition-opacity"
                    >
                        <img src={dio} alt="Dione logo" className="h-8 w-8" />
                        <h1 className="font-semibold text-3xl">Dione</h1>
                    </Link>
                    <p className="text-xs text-neutral-400 px-0.5">Explore, Install, Innovate — in 1 Click.</p>
                    <div className="mt-2 w-full flex gap-2 px-0.5">
                        <button onClick={() => openLink("https://getdione.app/discord")}
                            className="flex items-center justify-center gap-2 text-xs w-full bg-white hover:bg-white/80 transition-colors duration-400 rounded-full text-black font-semibold py-1 text-center cursor-pointer"
                        >
                            <img src={discord} alt="Discord icon" className="h-4 w-4" />

                            <span className="font-semibold">Discord</span>
                        </button>

                        <button onClick={() => openLink("https://getdione.app/github")}
                            className="flex items-center justify-center gap-2 text-xs w-full bg-white hover:bg-white/80 transition-colors duration-400 rounded-full text-black font-semibold py-1 text-center cursor-pointer"
                        >
                            <img src={github} alt="GitHub icon" className="h-4 w-4" />

                            <span className="font-semibold">GitHub</span>
                        </button>
                    </div>
                </div>
                <QuickLaunch />
                <div className="h-0.5 rounded-full w-full from-transparent via-white/40 to-transparent bg-gradient-to-l mt-4" />
                <div className="mt-4 w-full flex items-center justify-between px-2 pb-4">
                    <Link
                        to={"/settings"}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <img src={settings} alt="Settings icon" className="h-6 w-6" />

                    </Link>
                    {logged ? (
                        <button
                            className="text-xs bg-white/10 transition-colors duration-400 rounded-full font-semibold py-2 px-10 text-center"
                            onClick={logout}
                        >
                            Logout
                        </button>
                    ) : (
                        <button
                            className="text-xs bg-white hover:bg-white/80 transition-colors duration-400 rounded-full text-black font-semibold py-2 px-10 text-center cursor-pointer"
                            onClick={() => openLink("https://getdione.app/auth/login")}
                        >
                            Login
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}