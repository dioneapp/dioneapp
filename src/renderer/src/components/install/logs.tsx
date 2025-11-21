import ProgressBar from "@/components/common/progress-bar";
import { useScriptsContext } from "@/components/contexts/ScriptsContext";
import TerminalOutput from "@/components/install/terminal-output";
import { useTranslation } from "@/translations/translation-context";
import { MAX_TERMINAL_LINES } from "@/utils/terminal";
import { motion } from "framer-motion";
import { Copy, ExternalLink, Square } from "lucide-react";
import { useEffect, useMemo } from "react";

interface LogsProps {
	logs: Record<string, string[]>;
	copyLogsToClipboard: () => void;
	handleStop: () => void;
	iframeAvailable: boolean;
	setShow: React.Dispatch<React.SetStateAction<Record<string, string>>>;
	appId: string;
	executing: string | null;
}

export default function LogsComponent({
	logs,
	copyLogsToClipboard,
	handleStop,
	iframeAvailable,
	setShow,
	appId,
	executing,
}: LogsProps) {
	const { progress } = useScriptsContext();
	const { t } = useTranslation();

	const processedLogs = useMemo(() => {
		return logs?.[appId] || [];
	}, [logs, appId]);

	useEffect(() => {
		console.log(progress?.[appId]?.steps?.length);
	}, [progress?.[appId]?.steps?.length]);

	return (
		<motion.div
			className="flex flex-col w-full h-full min-w-96 max-w-2xl justify-center items-center overflow-hidden"
			key="logs"
			initial={{ opacity: 0, height: 0, y: 20 }}
			animate={{ opacity: 1, height: "auto", y: 0 }}
			exit={{ opacity: 0, height: 0, y: -20 }}
			transition={{ duration: 0.3 }}
		>
			{/* <div className="w-full justify-end flex items-end mx-auto overflow-hidden">
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
            </div> */}
			<motion.div className="p-10 select-text rounded-xl border-tl-0 border border-white/10 shadow-lg relative overflow-auto w-full bg-[#080808]/40 hide-scrollbar">
				<TerminalOutput
					id="logs"
					lines={processedLogs}
					containerClassName="mx-auto max-h-96 hide-scrollbar overflow-auto pointer-events-auto select-text pb-4"
					className="whitespace-pre-wrap break-words font-mono text-xs text-left flex gap-1 flex-col text-neutral-400 leading-5"
					autoScroll
				/>
				{progress &&
					progress[appId]?.steps &&
					progress[appId].steps.length > 1 &&
					executing !== "start" && (
						<div className="mb-4">
							<ProgressBar
								value={progress?.[appId]?.percent || 0}
								mode={progress?.[appId]?.mode || "indeterminate"}
								label={progress?.[appId]?.label}
								status={progress?.[appId]?.status || "running"}
							/>
						</div>
					)}
				{processedLogs.length >= MAX_TERMINAL_LINES && (
					<div className="text-[11px] text-neutral-400 mt-1 mb-1 text-center max-w-sm mx-auto">
						Showing last {MAX_TERMINAL_LINES.toLocaleString()} lines
					</div>
				)}
				<div className="flex w-full justify-end items-center mx-auto">
					<div className="flex gap-1.5">
						{iframeAvailable && (
							<button
								type="button"
								className="group bg-white hover:bg-white/80 transition-colors duration-300 rounded-full p-2 text-black font-medium text-center cursor-pointer flex items-center gap-2"
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
			<div className="text-[11px] text-neutral-500 mt-2 mb-2 text-center mx-auto justify-center items-center flex">
				{t("logs.disclaimer")}
			</div>
		</motion.div>
	);
}
