import { motion } from "framer-motion";
import {
	AlertCircle,
	AlertTriangle,
	CheckCircle,
	Copy,
	ExternalLink,
	Info,
	Loader2,
	Square,
	XCircle,
	Dot,
} from "lucide-react";
import type { JSX } from "react";
import { useMemo } from "react";
import { useTranslation } from "../../translations/translationContext";
import { useAppContext } from "../layout/global-context";

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
	const { statusLog } = useAppContext();
	const { t } = useTranslation();
	const Spinner = useMemo(() => {
		if (statusLog[appId]?.status === "pending" || !statusLog[appId]?.status) {
			return <Loader2 className="h-4 w-4 animate-spin" />;
		}
		return null;
	}, [statusLog[appId]?.status]);

	function cleanLogLine(log: string): string {
		return log
			.replace(/\s*\x1B\[[0-9;]*[a-zA-Z]\s*/g, "")
			.replace(
				/\s*[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]\s*/g,
				"",
			)
			.replace(/\s*\[[^\]]*\]\s*/g, "")
			.replace(/^\s*(ERROR:|WARN:|INFO:|OUT:)\s*/i, "")
			.replace(/\s{2,}/g, " ")
			.trim();
	}

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
				<div className="w-52 h-12 rounded-t-xl border border-b-0 border-white/10 p-2 flex items-center justify-center">
					<p
						className={`text-xs ${statusLog[appId]?.status === "success" ? "text-green-400" : statusLog[appId]?.status === "error" ? "text-red-400" : statusLog[appId]?.status === "pending" || !statusLog[appId]?.status ? "text-orange-400" : "text-neutral-200"} flex items-center gap-2`}
					>
						{Spinner}
						{statusLog[appId]?.status === "success" && (
							<CheckCircle className="h-4 w-4" />
						)}
						{statusLog[appId]?.status === "error" && (
							<XCircle className="h-4 w-4" />
						)}
						{statusLog[appId]?.content
							? `${statusLog[appId]?.content}`
							: t("logs.loading")}
					</p>
				</div>
			</div>
			<motion.div className="p-10 select-text rounded-tl-xl rounded-b-xl border-tl-0 border border-white/10 shadow-lg relative overflow-auto w-full bg-[#080808]/80 hide-scrollbar">
				<div
					id="logs"
					className="flex flex-col mx-auto  max-h-96 hide-scrollbar overflow-auto pointer-events-auto select-text text-wrap pb-4"
					ref={(el) => {
						if (el) {
							el.scrollTop = el.scrollHeight;
						}
					}}
				>
					{(logs?.[appId] || []).map((log, index) => {
						const lowerLog = log.toLowerCase();
						const cleanedLog = cleanLogLine(log);
						let textColor = "text-neutral-400";
						let symbol: JSX.Element | null = null;
						let bg = "";

						if (lowerLog.includes("error")) {
							textColor = "text-red-400";
							symbol = <AlertCircle className="w-3 h-3" />;
							bg = "bg-red-500/10";
						} else if (lowerLog.includes("warning")) {
							textColor = "text-yellow-400";
							symbol = <AlertTriangle className="w-3 h-3" />;
							bg = "bg-yellow-500/10";
						} else if (lowerLog.includes("success")) {
							textColor = "text-green-400";
							symbol = <CheckCircle className="w-3 h-3" />;
							bg = "bg-green-500/10";
						} else if (lowerLog.includes("info")) {
							textColor = "text-blue-400";
							symbol = <Info className="w-3 h-3" />;
							bg = "bg-blue-500/10";
						} else {
							symbol = <Dot className="w-3 h-3" />;
						}

						const isLast = index === (logs?.[appId]?.length || 0) - 1;

						return (
							<div key={index} className="w-full">
								<div className={`flex items-center gap-2 py-1 px-2 ${bg} rounded-md w-full relative`}>
									<span className="flex items-center min-w-6">{symbol}</span>
									<pre className={`whitespace-pre-wrap break-words font-mono text-xs ${textColor} flex-1`}>{cleanedLog}</pre>
								</div>
								{!isLast && (
									<div className="w-full h-px bg-white/5 my-1" />
								)}
							</div>
						);
					})}
				</div>
				<div className="h-px w-full bg-white/10 mb-4" />
				<div className="text-xs text-neutral-500 mt-4 mb-2 text-center max-w-sm mx-auto justify-center items-center flex">
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
