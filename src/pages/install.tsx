import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { getCurrentPort } from "../utils/getPort";
import Loading from "./loading";
import CopyIcon from "../../public/copy.svg";
import { motion, AnimatePresence } from 'framer-motion';

export default function Install() {
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<any | undefined>(undefined);
    const [logs, setLogs] = useState<string[]>([]);
    const { id } = useParams<{ id: string }>();
    const [showLogs, setShowLogs] = useState<boolean>(false); 

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
                    setLogs((prevLogs) => [...prevLogs, "Socket connected"]);
                });

                socket.on("disconnect", () => {
                    console.log("Socket disconnected");
                    setLogs((prevLogs) => [...prevLogs, "Socket disconnected"]);
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
        try {
            const port = await getCurrentPort();
            await fetch(`http://localhost:${port}/download/${id}`, {
                method: "GET",
            });
            setShowLogs(true);
        } catch (error) {
            console.error("Error initiating download:", error);
            setLogs((prevLogs) => [...prevLogs, "Error initiating download"]);
        }
    }


    const copyLogsToClipboard = () => {
        const logsText = logs.join("\n");
        navigator.clipboard
            .writeText(logsText)
    };

    const handleDownload = () => {
        download();
    };
    
    return (
        <div className="relative min-h-screen w-full overflow-hidden select-none">
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
                                <div className="bg-neutral-800/80 p-6 rounded-2xl shadow-lg relative overflow-hidden max-w-xl w-full border border-white/10 backdrop-blur-md">
                                    <div className="flex gap-4">
                                        <img
                                            src={data?.logo_url || "/icon.svg"}
                                            alt={`${data?.name} icon`}
                                            className="h-16 w-16 rounded-xl border border-white/10 object-cover object-center group-hover:border-white/20 transition-all duration-200"
                                        />
                                        <div className="flex flex-col pointer-events-none">
                                            <h1 className="text-2xl font-semibold mb-1 truncate text-white">{data?.name}</h1>
                                            <p className="text-xs text-[#BCB1E7] mb-1">
                                                {data?.script_url}
                                            </p>
                                            <p className="text-xs text-[#BCB1E7]">
                                                Published by @{data?.author}
                                            </p>
                                            <p className="text-xs text-neutral-400 mb-6 mt-2">
                                                {data?.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex justify-center gap-2 w-full">
                                        <button
                                            onClick={handleDownload}
                                            className="bg-white hover:bg-white/80 text-black font-semibold py-1 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-white transition-colors duration-200 cursor-pointer"
                                        >
                                            Download
                                        </button>

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
                                className="bg-neutral-800/80 rounded-2xl shadow-lg relative overflow-hidden max-w-xl w-full border border-white/10 backdrop-blur-md"
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