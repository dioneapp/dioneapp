import { motion } from "framer-motion";
import CopyIcon from "@renderer/assets/svgs/copy.svg";
import StopIcon from "@renderer/assets/svgs/stop.svg";
import { useEffect } from "react";

interface LogsProps {
    statusLog: { status: string; content: string; };
    logs: string[];
    setLogs: (logs: string[]) => void;
    copyLogsToClipboard: () => void;
    handleStop: () => void;
}

export default function LogsComponent({ statusLog, logs, setLogs, copyLogsToClipboard, handleStop }: LogsProps) {
    
    // clear logs on mount 
    useEffect(() => {
        setLogs([])
    }, []);

    return (
        <motion.div
        className="flex flex-col w-full h-full min-w-96 max-w-2xl justify-center items-center overflow-hidden"
        key="logs"
        initial={{ opacity: 0, height: 0, y: 20 }}
        animate={{ opacity: 1, height: 'auto', y: 0 }}
        exit={{ opacity: 0, height: 0, y: -20 }}
        transition={{ duration: 0.3 }}
    >
        <div className="w-full justify-end flex items-end mx-auto overflow-hidden">
            <div className="w-52 h-12 rounded-t-xl border border-b-0 border-white/10 p-2 flex items-center justify-center">
                <p className={`text-xs ${statusLog.status === "success" ? "text-green-400" : statusLog.status === "error" ? "text-red-400" : statusLog.status === "pending" || !statusLog.status ? "text-orange-400" : "text-neutral-200"} flex items-center gap-2`}>
                    {(statusLog.status === "pending" || !statusLog.status) && (
                        <svg className="animate-spin h-4 w-4 text-orange-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                    )}
                    {statusLog.status === "success" && (
                        <svg className="h-4 w-4 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                    {statusLog.status === "error" && (
                        <svg className="h-4 w-4 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    )}
                    {statusLog.content ? `${statusLog.content}` : "Loading..."}
                </p>
            </div>
        </div>
        <motion.div
            className="p-10 rounded-tl-xl rounded-b-xl border-tl-0 border border-white/10 shadow-lg relative overflow-auto w-full backdrop-blur-md"
        >
            <div className="max-h-96 overflow-auto p-4 pointer-events-auto">
                {logs.map((log, index) => (
                    <p className="text-xs text-neutral-300 whitespace-pre-wrap" key={index}>
                        {log || "loading"}
                    </p>
                ))}
            </div>
            <div className="absolute bottom-4 right-4">
                <button
                    className="bg-white hover:bg-white/80 transition-colors duration-400 rounded-full p-2 text-black font-medium text-center cursor-pointer mr-2"
                    onClick={copyLogsToClipboard}
                >
                    <img src={CopyIcon} alt="Copy Logs" className="h-4 w-4" />
                </button>
                <button
                    className="bg-white hover:bg-white/80 transition-colors duration-400 rounded-full p-2 text-black font-medium text-center cursor-pointer"
                    onClick={handleStop}
                >
                                        <img src={StopIcon} alt="Stop Install" className="h-4 w-4" />

                </button>
            </div>
        </motion.div>
    </motion.div>
    
    )
}