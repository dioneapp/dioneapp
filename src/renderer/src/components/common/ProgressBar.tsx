interface ProgressBarProps {
  value?: number; // 0..100
  mode?: "determinate" | "indeterminate";
  label?: string;
  status?: "running" | "success" | "error";
}

export default function ProgressBar({ value = 0, mode = "indeterminate", label, status = "running" }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const color = status === "error" ? "bg-red-500" : status === "success" ? "bg-green-500" : "bg-[#BCB1E7]";
  const trackColor = status === "error" ? "bg-red-500/20" : status === "success" ? "bg-green-500/20" : "bg-white/10";

  return (
    <div className="w-full flex flex-col gap-1 select-none">
      <div className={`w-full h-2 rounded-full overflow-hidden ${trackColor}`}>
        {mode === "determinate" ? (
          <div
            className={`${color} h-full transition-all duration-150 ease-out`}
            style={{ width: `${clamped}%` }}
          />
        ) : (
          <div className="h-full w-1/3 animate-[progress_1.2s_ease_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        )}
      </div>
      <div className="flex justify-between text-[11px] text-neutral-400">
        <span className="truncate max-w-[80%]">{label || (status === "error" ? "Error" : status === "success" ? "Done" : "Working...")}</span>
        {mode === "determinate" && <span>{Math.round(clamped)}%</span>}
      </div>
      <style>{`@keyframes progress { 0% { transform: translateX(-100%); } 100% { transform: translateX(300%); } }`}</style>
    </div>
  );
}
