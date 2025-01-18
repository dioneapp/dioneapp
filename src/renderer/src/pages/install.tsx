import { useToast } from "@renderer/utils/useToast";
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import CopyIcon from "../assets/copy.svg";
import { getCurrentPort } from "../utils/getPort";
import { openLink } from "../utils/openLink";

export default function Install() {
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<any | undefined>(undefined);
    const [logs, setLogs] = useState<string[]>([]);
    const { id } = useParams<{ id: string }>();
    const [showLogs, setShowLogs] = useState<boolean>(false);
    const [_imgLoading, setImgLoading] = useState<boolean>(true);
    const { addToast } = useToast()
    const showToast = (variant: "default" | "success" | "error" | "warning", message: string) => {
        addToast({
            variant,
            children: message,
        })
    }

    // Fetch script data
    useEffect(() => {
        async function getData() {
            try {
                const port = await getCurrentPort();
                const response = await fetch(`http://localhost:${port}/search/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const script = await response.json();
                console.log("script retrieved:", script);
                setData(script[0]);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLogs((prevLogs) => [...prevLogs, "Error fetching script data"]);
            } finally {
                setLoading(false);
            }
        }

        getData();
    }, [id]);


    useEffect(() => {
        let socket: any = null;

        async function setupSocket() {
            try {
                const port = await getCurrentPort();
                socket = io(`http://localhost:${port}`);

                socket.on("clientUpdate", (message: string) => {
                    console.log("Received log:", message);
                    setLogs((prevLogs) => [...prevLogs, message]);
                });

                socket.on("connect", () => {
                    console.log("Connected to socket:", socket.id);
                    setLogs((prevLogs) => [...prevLogs, "Connected to server"]);
                });

                socket.on("disconnect", () => {
                    console.log("Socket disconnected");
                    setLogs((prevLogs) => [...prevLogs, "Disconnected from server"]);
                });

                socket.on("installUpdate", (message: string) => {
                    console.log("Received action update:", message);
                    setLogs((prevLogs) => [...prevLogs, message]);
                });
            } catch (error) {
                console.error("Error setting up socket:", error);
                setLogs((prevLogs) => [...prevLogs, "Error setting up socket"]);
            }

        }

        setupSocket();
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };

    }, []);

    async function download() {
        setShowLogs(true);
        try {
            const port = await getCurrentPort();
            await fetch(`http://localhost:${port}/download/${id}`, {
                method: "GET",
            });
        } catch (error) {
            console.error("Error initiating download:", error);
            setLogs((prevLogs) => [...prevLogs, "Error initiating download"]);
        }
    }


    const copyLogsToClipboard = () => {
        showToast("success", "Logs successfully copied to clipboard.")
        const logsText = logs.join("\n");
        navigator.clipboard
            .writeText(logsText)
    };

    const handleDownload = async () => {
        showToast("default", `Downloading ${data.name}...`)
        await download();
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            <div className="relative min-h-screen backdrop-blur-xl flex items-center justify-center p-8">
                {loading ? (
                    <div className="text-white">Loading...</div>
                ) : (
                    <AnimatePresence>
                        {!showLogs && (
                            <motion.div
                                key="actions"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.2 }}
                                className="flex flex-col gap-6 w-full max-w-xl"
                            >
                                <div className="p-6 rounded-xl border border-white/10 shadow-lg relative overflow-hidden max-w-xl w-full backdrop-blur-md">
                                    {/* background effects */}
                                    <div className="absolute top-0 left-0.5/4 w-32 h-32 bg-[#BCB1E7] rounded-full -translate-y-1/2 blur-3xl z-10" />
                                    <div className="relative z-10">

                                        <div className="flex gap-4">
                                            <img
                                                onLoad={() => setImgLoading(false)}
                                                onError={() => setImgLoading(false)}
                                                src={data?.logo_url || "/icon.svg"}
                                                alt={`${data?.name} icon`}
                                                className="h-16 w-16 rounded-xl border border-white/10 object-cover object-center group-hover:border-white/20 transition-all duration-200"
                                            />
                                            <div className="flex flex-col">
                                                <h1 className="text-2xl font-medium mb-1 truncate text-white">{data?.name}</h1>
                                                <p className="text-xs text-[#BCB1E7] mb-1 flex gap-1 hover:underline w-full cursor-pointer text-nowrap" onClick={() => openLink(data?.script_url)}>
                                                    <span className="w-fit h-full flex items-center">
                                                        <svg width="12" height="12" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M6.7623 8.01288L5.74356 6.96881C5.61475 6.83448 5.45386 6.76732 5.26089 6.76732C5.06792 6.76732 4.90094 6.84059 4.75995 6.98712C4.63115 7.12145 4.56674 7.29241 4.56674 7.5C4.56674 7.70759 4.63115 7.87855 4.75995 8.01288L6.27049 9.58814C6.41101 9.73468 6.57494 9.80795 6.7623 9.80795C6.94965 9.80795 7.11358 9.73468 7.2541 9.58814L10.24 6.47425C10.3806 6.32771 10.4478 6.15675 10.4417 5.96137C10.4356 5.76599 10.3684 5.59503 10.24 5.44849C10.0995 5.30195 9.93279 5.22576 9.73981 5.21989C9.54684 5.21403 9.37986 5.28413 9.23888 5.43017L6.7623 8.01288ZM4.79508 14.6436L3.77635 12.8486L1.84426 12.409C1.66862 12.3723 1.5281 12.2778 1.42272 12.1254C1.31733 11.973 1.27635 11.805 1.29977 11.6213L1.49297 9.55151L0.175644 7.97624C0.058548 7.84192 0 7.68317 0 7.5C0 7.31683 0.058548 7.15808 0.175644 7.02376L1.49297 5.44849L1.29977 3.37866C1.27635 3.19549 1.31733 3.02747 1.42272 2.87458C1.5281 2.72169 1.66862 2.62718 1.84426 2.59103L3.77635 2.15142L4.79508 0.356353C4.88876 0.197605 5.01756 0.0906333 5.1815 0.0354379C5.34543 -0.0197574 5.50937 -0.0104768 5.6733 0.0632798L7.5 0.86923L9.3267 0.0632798C9.49063 -0.00998835 9.65457 -0.019269 9.8185 0.0354379C9.98244 0.0901448 10.1112 0.197116 10.2049 0.356353L11.2237 2.15142L13.1557 2.59103C13.3314 2.62767 13.4719 2.72243 13.5773 2.87531C13.6827 3.0282 13.7237 3.19598 13.7002 3.37866L13.507 5.44849L14.8244 7.02376C14.9415 7.15808 15 7.31683 15 7.5C15 7.68317 14.9415 7.84192 14.8244 7.97624L13.507 9.55151L13.7002 11.6213C13.7237 11.8045 13.6827 11.9725 13.5773 12.1254C13.4719 12.2783 13.3314 12.3728 13.1557 12.409L11.2237 12.8486L10.2049 14.6436C10.1112 14.8024 9.98244 14.9094 9.8185 14.9646C9.65457 15.0198 9.49063 15.0105 9.3267 14.9367L7.5 14.1308L5.6733 14.9367C5.50937 15.01 5.34543 15.0193 5.1815 14.9646C5.01756 14.9099 4.88876 14.8029 4.79508 14.6436Z" fill="#BCB1E7" />
                                                        </svg>
                                                    </span>
                                                    {data?.script_url}
                                                </p>
                                                <p className="text-xs text-[#BCB1E7] flex gap-1">
                                                    <span className="w-fit h-full flex items-center">
                                                        <svg width="12" height="12" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M4.9002 9.21769L4.8966 9.20953C4.82417 9.19288 4.75215 9.1746 4.6806 9.15469L4.6752 9.15294C3.99077 8.96165 3.3587 8.6247 2.8248 8.1665C2.23763 7.6629 1.78609 7.02729 1.50954 6.3151C1.233 5.60291 1.13984 4.83576 1.23821 4.08054C1.33657 3.32532 1.62346 2.60495 2.07386 1.98226C2.52427 1.35957 3.12451 0.853453 3.82225 0.508045C4.51999 0.162637 5.29405 -0.0115756 6.07693 0.000596737C6.85981 0.0127691 7.62775 0.210957 8.31377 0.57788C8.9998 0.944802 9.58309 1.46932 10.0128 2.1057C10.4425 2.74207 10.7055 3.47099 10.779 4.22888C10.8024 4.4698 10.599 4.66639 10.35 4.66639C10.1016 4.66639 9.903 4.4698 9.8742 4.22946C9.79488 3.56636 9.53691 2.93538 9.12636 2.40029C8.71581 1.8652 8.16723 1.44497 7.53609 1.18209C6.90495 0.919206 6.2136 0.822987 5.53195 0.903156C4.8503 0.983326 4.2025 1.23704 3.65403 1.63866C3.10556 2.04028 2.67587 2.57556 2.4084 3.19039C2.14092 3.80522 2.04514 4.47782 2.13073 5.14018C2.21633 5.80254 2.48026 6.43119 2.89586 6.96258C3.31146 7.49398 3.86399 7.90927 4.4976 8.1665L4.5216 8.17641C4.6416 8.22425 4.7648 8.26644 4.8912 8.303C4.9974 8.05351 5.18932 7.84755 5.43423 7.72025C5.67915 7.59294 5.9619 7.55217 6.23428 7.60489C6.50666 7.6576 6.7518 7.80054 6.9279 8.00933C7.104 8.21812 7.20017 8.47983 7.2 8.74985C7.20027 9.01798 7.10553 9.27801 6.93174 9.48621C6.75795 9.6944 6.5157 9.83803 6.24576 9.89294C5.97582 9.94786 5.69467 9.9107 5.4496 9.78771C5.20454 9.66473 5.01052 9.46344 4.9002 9.21769ZM4.3086 9.95971C3.24272 9.63742 2.29764 9.01795 1.5906 8.17816C1.15243 8.22806 0.748362 8.43267 0.455136 8.75314C0.16191 9.07361 -5.42963e-05 9.48762 1.3654e-08 9.91655V10.3336C1.3654e-08 12.5025 2.526 14 6 14C9.474 14 12 12.4203 12 10.3336V9.91655C12 9.4524 11.8104 9.00727 11.4728 8.67907C11.1352 8.35088 10.6774 8.1665 10.2 8.1665H8.013C8.15453 8.62736 8.12418 9.12201 7.92728 9.56325C7.73039 10.0045 7.3796 10.364 6.93676 10.5783C6.49392 10.7927 5.98745 10.8482 5.50664 10.735C5.02583 10.6219 4.60155 10.3473 4.3086 9.95971ZM9 4.66639C9 3.78437 8.598 2.99393 7.9614 2.459C7.64199 2.1911 7.26806 1.99171 6.86402 1.87384C6.45997 1.75596 6.03491 1.72226 5.61656 1.77493C5.19822 1.8276 4.796 1.96545 4.43616 2.1795C4.07633 2.39354 3.76697 2.67895 3.52828 3.01711C3.28958 3.35527 3.12692 3.73857 3.05092 4.14199C2.97491 4.54541 2.98727 4.95988 3.08717 5.35835C3.18708 5.75681 3.3723 6.13031 3.63074 6.45446C3.88918 6.77861 4.21502 7.04613 4.587 7.23955C4.97358 6.89764 5.47739 6.70815 6 6.70812C6.52281 6.70801 7.02687 6.8975 7.4136 7.23955C7.89295 6.99058 8.29374 6.61968 8.57315 6.16647C8.85256 5.71327 9.00009 5.19478 9 4.66639Z" fill="#BCB1E7" />
                                                        </svg>
                                                    </span>
                                                    Published by @{data?.author}
                                                </p>
                                                <p className="text-xs text-neutral-400 mb-4 mt-2 line-clamp-3">
                                                    {data?.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex justify-center gap-2 w-full">
                                            <button
                                                onClick={handleDownload}
                                                className="bg-white hover:bg-white/80 text-black font-semibold py-1 px-4 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-white transition-colors duration-200 cursor-pointer"
                                            >
                                                Download
                                            </button>

                                        </div>
                                    </div>
                                    </div>
                            </motion.div>
                        )}

                        {showLogs && (
                            <motion.div
                                key="logs"
                                initial={{ opacity: 0, height: 0, y: 20 }}
                                animate={{ opacity: 1, height: 'auto', y: 0 }}
                                exit={{ opacity: 0, height: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="p-6 rounded-xl border border-white/10 shadow-lg relative overflow-hidden max-w-xl w-full backdrop-blur-md"
                            >
                                <div className="max-h-96 overflow-auto p-4 pointer-events-none">
                                    {logs.map((log, index) => (
                                        <p className="text-xs text-neutral-300 whitespace-pre-wrap" key={index}>
                                            {log || "loading"}
                                        </p>
                                    ))}
                                </div>
                                <div className="absolute bottom-4 right-4">
                                    <button
                                        className="bg-white hover:bg-white/80 transition-colors duration-400 rounded-full p-2 text-black font-medium text-center cursor-pointer"
                                        onClick={copyLogsToClipboard}
                                    >
                                        <img src={CopyIcon} alt="Copy Logs" className="h-4 w-4" />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};