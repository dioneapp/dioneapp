import { motion } from "framer-motion";
import type { JSX } from "react";
import { useMemo } from "react";
import { useTranslation } from "../../translations/translationContext";
import Icon from "../icons/icon";
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
			return <Icon name="Pending" className="h-4 w-4 animate-spin" />;
		}
		return null;
	}, [statusLog[appId]?.status]);

	function cleanLogLine(log: string): string {
		return log
			.replace(/\x1B\[[0-9;]*[a-zA-Z]/g, "")
			.replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
			.replace(/\[[^\]]*\]\s*/g, "")
			.replace(/^(ERROR:|WARN:|INFO:|OUT:)\s*/i, "")
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
							<Icon name="Success" className="h-4 w-4" />
						)}
						{statusLog[appId]?.status === "error" && (
							<Icon name="Error" className="h-4 w-4" />
						)}
						{statusLog[appId]?.content
							? `${statusLog[appId]?.content}`
							: t("logs.loading")}
					</p>
				</div>
			</div>
			<motion.div className="p-10 select-text rounded-tl-xl rounded-b-xl border-tl-0 border border-white/10 shadow-lg relative overflow-auto w-full bg-[#080808]/80 hide-scrollbar">
				<div
					className="max-h-96 hide-scrollbar overflow-auto pointer-events-auto select-text text-wrap"
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
						let icon: JSX.Element | null = null;

						if (lowerLog.includes("error")) {
							textColor =
								"select-all bg-red-500/10 font-mono border border-white/5 my-4 backdrop-filter backdrop-blur-xl p-4 rounded-xl text-neutral-300 text-pretty";
							icon = <Icon name="NotInstalled" className="w-6 h-6" />;
						} else if (lowerLog.includes("warning")) {
							textColor = "text-yellow-400";
							icon = <Icon name="Warning" className="w-4 h-4" />;
						} else if (lowerLog.includes("info")) {
							textColor = "text-blue-400";
							icon = <Icon name="Info" className="w-4 h-4" />;
						}

						return (
							<p key={index} className={`text-xs flex ${textColor} my-1`}>
								<span className="flex justify-center gap-2 items-center">
									<span
										className={`w-4 h-4 flex justify-start items-center ${lowerLog.includes("error") && "mr-4"}`}
									>
										{icon || <span className="flex justify-start w-4 h-4">-</span>}
									</span>
									{cleanedLog || t("common.loading")}
								</span>
							</p>
						);
					})}
				</div>
				<div className="h-px w-full bg-white/10 my-4" />
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
								<Icon name="Iframe" className="h-4 w-4" />
							</button>
						)}
						<button
							type="button"
							className="bg-white hover:bg-white/80 transition-colors duration-400 rounded-full p-2 text-black font-medium text-center cursor-pointer"
							onClick={copyLogsToClipboard}
						>
							<Icon name="Copy" className="h-4 w-4" />
						</button>
						<button
							type="button"
							className="bg-white hover:bg-white/80 transition-colors duration-400 rounded-full p-2 text-black font-medium text-center cursor-pointer"
							onClick={handleStop}
						>
							<Icon name="Stop" className="h-4 w-4" />
						</button>
					</div>
				</div>
			</motion.div>
		</motion.div>
	);
}
