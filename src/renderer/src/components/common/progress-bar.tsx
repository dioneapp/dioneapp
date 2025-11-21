import { useTranslation } from "@/translations/translation-context";

interface ProgressBarProps {
	value?: number; // 0..100
	mode?: "determinate" | "indeterminate";
	label?: string;
	status?: "running" | "success" | "error";
}

export default function ProgressBar({
	value = 0,
	mode = "indeterminate",
	label,
	status = "running",
}: ProgressBarProps) {
	const { t } = useTranslation();
	const clamped = Math.max(0, Math.min(100, value));

	const color =
		status === "error"
			? "bg-red-500/20"
			: status === "success"
				? "bg-white/80"
				: "bg-white/30";

	const trackColor =
		status === "error"
			? "bg-red-500/20"
			: status === "success"
				? "bg-white/10"
				: "bg-white/5";

	return (
		<div className="w-full flex flex-col gap-1.5 select-none">
			<div
				className={`w-full h-1 rounded-full overflow-hidden ${trackColor} relative`}
			>
				{mode === "determinate" ? (
					<div
						className={`${color} h-full transition-all duration-300 ease-out rounded-full`}
						style={{ width: `${clamped}%` }}
					/>
				) : (
					<div className="absolute inset-0 overflow-hidden">
						<div className="h-full w-1/3 animate-[progress_1.2s_ease-in-out_infinite] bg-linear-to-r from-transparent via-white/30 to-transparent" />
					</div>
				)}
			</div>

			<div className="flex justify-between text-[11px] text-neutral-500 font-mono">
				<span className="truncate max-w-[80%]">
					{label ||
						(status === "error"
							? t("common.error")
							: status === "success"
								? t("logs.status.success")
								: t("progress.running"))}
				</span>
				{mode === "determinate" && (
					<span className="text-neutral-400">{Math.round(clamped)}%</span>
				)}
			</div>

			<style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
		</div>
	);
}
