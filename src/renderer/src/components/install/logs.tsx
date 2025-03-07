import { motion } from "framer-motion";
import { useEffect } from "react";
import Icon from "../icons/icon";

interface LogsProps {
	statusLog: { status: string; content: string };
	logs: string[];
	setLogs: (logs: string[]) => void;
	copyLogsToClipboard: () => void;
	handleStop: () => void;
}

export default function LogsComponent({
	statusLog,
	logs,
	setLogs,
	copyLogsToClipboard,
	handleStop,
}: LogsProps) {
	// clear logs on mount
	useEffect(() => {
		setLogs([]);
	}, []);

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
						className={`text-xs ${statusLog.status === "success" ? "text-green-400" : statusLog.status === "error" ? "text-red-400" : statusLog.status === "pending" || !statusLog.status ? "text-orange-400" : "text-neutral-200"} flex items-center gap-2`}
					>
						{(statusLog.status === "pending" || !statusLog.status) && (
							<Icon name="Pending" className="h-4 w-4 animate-spin" />
						)}
						{statusLog.status === "success" && (
							<Icon name="Success" className="h-4 w-4" />
						)}
						{statusLog.status === "error" && (
							<Icon name="Error" className="h-4 w-4" />
						)}
						{statusLog.content ? `${statusLog.content}` : "Loading..."}
					</p>
				</div>
			</div>
			<motion.div className="p-10 select-text rounded-tl-xl rounded-b-xl border-tl-0 border border-white/10 shadow-lg relative overflow-auto w-full bg-[#080808]/80 hide-scrollbar">
				<div
					className="max-h-96 hide-scrollbar overflow-auto p-4 pointer-events-auto select-text text-wrap"
					ref={(el) => {
						if (el) {
							el.scrollTop = el.scrollHeight;
						}
					}}
				>
					{logs.map((log) => (
						<p
							className={`text-xs select-text whitespace-pre-wrap text-wrap ${log.startsWith("ERROR") || log.includes("error") ? "text-red-400" : log.startsWith("WARN:") ? "text-yellow-400" : log.startsWith("INFO:") ? "text-blue-400" : "text-neutral-300"}`}
							key={log}
						>
							{log || "Loading..."}
						</p>
					))}
				</div>
				<div className="absolute bottom-2 right-2">
					<button
						type="button"
						className="bg-white hover:bg-white/80 transition-colors duration-400 rounded-full p-2 text-black font-medium text-center cursor-pointer mr-2"
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
			</motion.div>
		</motion.div>
	);
}
