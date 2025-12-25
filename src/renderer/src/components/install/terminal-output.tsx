import { useEffect, useMemo, useRef } from "react";

interface TerminalOutputProps {
	lines: string[];
	id?: string;
	className?: string;
	containerClassName?: string;
	autoScroll?: boolean;
}

const removePrefix = (line: string): string => {
	return line.replace(/^\s*(INFO:|WARN:|OUT:)\s*/i, "");
};

const getLineStyle = (line: string): string => {
	const lower = line.toLowerCase();
	if (lower.includes("warn"))
		return "text-yellow-400/90 bg-gradient-to-r from-yellow-500/8 to-transparent border-l-2 border-yellow-500/60 pl-3 py-1 my-0.5 rounded-r-xl";
	if (lower.includes("error") || lower.includes("fail"))
		return "text-red-400/90 bg-gradient-to-r from-red-500/8 to-transparent border-l-2 border-red-500/60 pl-3 py-1 my-0.5 rounded-r-xl";
	if (lower.includes("success") || lower.includes("complete"))
		return "text-green-400/90 bg-gradient-to-r from-green-500/8 to-transparent border-l-2 border-green-500/60 pl-3 py-1 my-0.5 rounded-r-xl";
	if (lower.includes("info"))
		return "text-blue-400/90 bg-gradient-to-r from-blue-500/8 to-transparent border-l-2 border-blue-500/60 pl-3 py-1 my-0.5 rounded-r-xl";
	return "text-neutral-400/90 hover:bg-white/[0.03] transition-all duration-150 py-0.5 px-2 rounded-xl";
};

export default function TerminalOutput({
	lines,
	id,
	className,
	containerClassName,
	autoScroll = true,
}: TerminalOutputProps) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const prevLengthRef = useRef<number>(0);

	const processedLines = useMemo(() => {
		if (!Array.isArray(lines)) return [];
		return lines
			.filter((l) => !l.trim().startsWith("warnings.warn("))
			.map((l, i) => {
				const content = removePrefix(l.trimStart());
				const style = getLineStyle(l);
				return {
					key: i,
					content,
					style,
				};
			});
	}, [lines]);

	useEffect(() => {
		const el = containerRef.current;
		if (!el || !autoScroll) return;

		const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
		const grew = lines.length >= prevLengthRef.current;

		if (nearBottom || grew) el.scrollTop = el.scrollHeight;
		prevLengthRef.current = lines.length;
	}, [lines, autoScroll]);

	return (
		<div
			id={id}
			ref={containerRef}
			role="log"
			aria-live="polite"
			aria-relevant="additions text"
			className={
				containerClassName ??
				"mx-auto max-h-96 overflow-auto hide-scrollbar select-text bg-neutral-950 rounded-xl p-4 border border-neutral-800"
			}
		>
			<pre
				className={
					className ??
					"whitespace-pre-wrap break-words text-justify font-mono text-[13px] leading-relaxed space-y-1"
				}
			>
				{processedLines.map((line) => (
					<div key={line.key} className={`${line.style} group relative`}>
						{line.content}
					</div>
				))}
			</pre>
		</div>
	);
}
