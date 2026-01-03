import ProgressBar from "@/components/common/progress-bar";
import TerminalOutput from "@/components/install/terminal-output";
import { useTranslation } from "@/translations/translation-context";
import { useScriptsLogsContext } from "../contexts/scripts-context";

import { MAX_TERMINAL_LINES } from "@/utils/terminal";
import { Copy, ExternalLink, Square } from "lucide-react";
import { useMemo } from "react";

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
	const { progress } = useScriptsLogsContext();
	const { t } = useTranslation();

	const processedLogs = useMemo(() => {
		return logs?.[appId] || [];
	}, [logs, appId]);

	return (
		<div className="flex flex-col w-full h-full min-w-96 max-w-2xl justify-center items-center overflow-hidden">
			<div className="flex flex-col gap-2 p-10 select-text rounded-xl border-tl-0 border border-white/10 shadow-lg relative overflow-hidden w-full bg-[#080808]/40 h-[500px] hide-scrollbar">
				<TerminalOutput lines={processedLogs} />
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
				<div className="flex w-full justify-between items-center mx-auto">
					{iframeAvailable && (
						<button
							type="button"
							className="group bg-white hover:bg-white/90 transition-all duration-200 rounded-xl px-3 py-2 text-black font-medium text-center cursor-pointer shadow-sm hover:shadow-md flex items-center gap-2"
							onClick={() => setShow({ [appId]: "iframe" })}
						>
							<ExternalLink className="h-4 w-4" />
							<span className="text-sm">{t("logs.openPreview")}</span>
						</button>
					)}
					<div className={`flex gap-1.5 ${!iframeAvailable ? "ml-auto" : ""}`}>
						<button
							type="button"
							className="p-1.5 sm:p-2 bg-white/5 hover:bg-white/10 transition-colors duration-200 rounded-xl text-neutral-300 cursor-pointer border border-white/10"
							onClick={copyLogsToClipboard}
							title={t("logs.copyLogs")}
						>
							<Copy size={14} className="sm:w-4 sm:h-4" />
						</button>
						<button
							type="button"
							className="p-1.5 sm:p-2 bg-white/5 hover:bg-white/10 transition-colors duration-200 rounded-xl text-neutral-300 cursor-pointer border border-white/10"
							onClick={handleStop}
							title={t("logs.stop")}
						>
							<Square size={14} className="sm:w-4 sm:h-4" />
						</button>
					</div>
				</div>
			</div>
			<div className="text-[11px] text-neutral-500 mt-2 mb-2 text-center mx-auto justify-center items-center flex">
				{t("logs.disclaimer")}
			</div>
		</div>
	);
}
