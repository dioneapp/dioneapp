import { motion } from "framer-motion";
import { CheckCircle, Copy, ExternalLink, Loader2, Square, XCircle } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "../../translations/translationContext";
import { useScriptsContext } from "../contexts/ScriptsContext";
import { MAX_TERMINAL_LINES } from "@renderer/utils/terminal";
import TerminalOutput from "./TerminalOutput";

interface LogsProps {
    logs: Record<string, string[]>;
    copyLogsToClipboard: () => void;
    handleStop: () => void;
    iframeAvailable: boolean;
    setShow: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    appId: string;
}

export default function LogsComponent({
    logs,
    copyLogsToClipboard,
    handleStop,
    iframeAvailable,
    setShow,
    appId,
}: LogsProps) {
    const { statusLog } = useScriptsContext();
    const { t } = useTranslation();

    const Spinner = useMemo(() => {
        if (statusLog[appId]?.status === "pending" || !statusLog[appId]?.status) {
            return <Loader2 className="h-4 w-4 animate-spin" />;
        }
        return null;
    }, [statusLog[appId]?.status]);

    const processedLogs = useMemo(() => {
        return logs?.[appId] || [];
    }, [logs, appId]);

    return (
        <motion.div
            className="flex flex-col w-full h-full min-w-96 max-w-2xl justify-center items-center overflow-hidden"
            key="logs"
            initial={{ opacity: 0, height: 0, y: 20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <div className="w-full justify-end flex items-end mx-auto overflow-hidden">
                <div className="max-w-80 min-w-32 h-12 rounded-t-xl border border-b-0 border-white/10 p-4 flex items-center justify-center">
                    <p
                        className={`text-xs ${
                            statusLog[appId]?.status === "success"
                                ? "text-green-400"
                                : statusLog[appId]?.status === "error"
                                    ? "text-red-400"
                                    : statusLog[appId]?.status === "pending" ||
                                            !statusLog[appId]?.status
                                        ? "text-orange-400"
                                        : "text-neutral-200"
                        } flex items-center gap-2 whitespace-nowrap overflow-hidden`}
                    >
                        {Spinner}
                        {statusLog[appId]?.status === "success" && (
                            <CheckCircle className="h-4 w-4 flex-shrink-0" />
                        )}
                        {statusLog[appId]?.status === "error" && (
                            <XCircle className="h-4 w-4 flex-shrink-0" />
                        )}
                        <span className="truncate">
                            {statusLog[appId]?.content
                                ? `${statusLog[appId]?.content}`
                                : t("logs.loading")}
                        </span>
                    </p>
                </div>
            </div>
            <motion.div className="p-10 select-text rounded-tl-xl rounded-b-xl border-tl-0 border border-white/10 shadow-lg relative overflow-auto w-full bg-[#080808]/80 hide-scrollbar">
                <TerminalOutput
                    id="logs"
                    lines={processedLogs}
                    containerClassName="mx-auto max-h-96 hide-scrollbar overflow-auto pointer-events-auto select-text pb-4"
                    className="whitespace-pre-wrap break-words font-mono text-xs text-neutral-300 leading-5"
                    autoScroll
                />
                <div className="h-px w-full bg-white/10 mb-4" />
                {processedLogs.length >= MAX_TERMINAL_LINES && (
                    <div className="text-[11px] text-neutral-400 mt-1 mb-1 text-center max-w-sm mx-auto">
                        Showing last {MAX_TERMINAL_LINES.toLocaleString()} lines
                    </div>
                )}
                <div className="text-xs text-neutral-500 mt-2 mb-2 text-center max-w-sm mx-auto justify-center items-center flex">
                    {t("logs.disclaimer")}
                </div>
                <div className="absolute bottom-2 right-2">
                    <div className="flex gap-1.5">
                        {iframeAvailable && (
                            <button
                                type="button"
                                className="bg-white hover:bg-white/80 transition-colors duration-400 rounded-full p-2 text-black font-medium text-center cursor-pointer"
                                onClick={() => setShow({ [appId]: "iframe" })}
                            >
                                <ExternalLink className="h-4 w-4" />
                            </button>
                        )}
                        <button
                            type="button"
                            className="bg-white hover:bg-white/80 transition-colors duration-400 rounded-full p-2 text-black font-medium text-center cursor-pointer"
                            onClick={copyLogsToClipboard}
                        >
                            <Copy className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            className="bg-white hover:bg-white/80 transition-colors duration-400 rounded-full p-2 text-black font-medium text-center cursor-pointer"
                            onClick={handleStop}
                        >
                            <Square className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
