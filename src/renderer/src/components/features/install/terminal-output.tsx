import { FitAddon } from "@xterm/addon-fit";
import { Terminal } from "@xterm/xterm";
import { useEffect, useRef } from "react";
import "@xterm/xterm/css/xterm.css";

interface TerminalOutputProps {
	lines: string[];
	id?: string;
}

export default function TerminalOutput({ lines, id }: TerminalOutputProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const terminalRef = useRef<Terminal | null>(null);
	const fitAddonRef = useRef<FitAddon | null>(null);
	const lastProcessedIndex = useRef(0);
	const activeColorRef = useRef<number | null>(null);

	useEffect(() => {
		if (!containerRef.current) return;

		const term = new Terminal({
			convertEol: true,
			allowTransparency: true,
			theme: {
				background: "#00000000",
				foreground: "#a3a3a3",
				cursor: "#ffffff",
			},
			fontSize: 12.5,
			scrollback: 99999999,
		});

		const fitAddon = new FitAddon();
		term.loadAddon(fitAddon);
		term.open(containerRef.current);

		terminalRef.current = term;
		fitAddonRef.current = fitAddon;

		const handleResize = () => {
			if (!fitAddonRef.current || !terminalRef.current) return;
			fitAddonRef.current.fit();
			const { cols, rows } = terminalRef.current;
			if (id) {
				window.electron?.ipcRenderer?.send("terminal:resize", {
					id,
					cols,
					rows,
				});
			}
		};

		const timeoutId = setTimeout(() => {
			handleResize();
		}, 10);

		const observer = new ResizeObserver(() => {
			handleResize();
		});
		observer.observe(containerRef.current);

		return () => {
			clearTimeout(timeoutId);
			observer.disconnect();
			term.dispose();
		};
	}, [id]);

	useEffect(() => {
		const term = terminalRef.current;
		if (!term || lines.length === 0) return;

		const newLines = lines.slice(lastProcessedIndex.current);
		const colorRules = [
			{ regex: /\bwarn(ing)?\b/i, color: 33 },
			{ regex: /\berror|fail(ed)?\b/i, color: 31 },
			{ regex: /\bsuccess|complete(d)?\b/i, color: 32 },
			{ regex: /\binfo\b/i, color: 34 },
		];

		newLines.forEach((line) => {
			if (line.includes("\x1b")) {
				term.write(line + (line.includes("\n") ? "" : "\r\n"));
				activeColorRef.current = null;
				return;
			}
			let matchFound = false;
			for (const { regex, color } of colorRules) {
				if (regex.test(line)) {
					activeColorRef.current = color;
					term.write(
						`\x1b[${color}m${line}${line.includes("\n") ? "" : "\r\n"}`,
					);
					matchFound = true;
					break;
				}
			}
			if (!matchFound) {
				const trimmed = line.trim();
				const isContinuation =
					activeColorRef.current &&
					trimmed.length > 0 &&
					/^[a-z]/.test(trimmed);

				if (isContinuation) {
					term.write(line + (line.includes("\n") ? "" : "\r\n"));
				} else {
					activeColorRef.current = null;
					term.write(`\x1b[0m${line}${line.includes("\n") ? "" : "\r\n"}`);
				}
			}
		});

		lastProcessedIndex.current = lines.length;
		term.scrollToBottom();
	}, [lines]);

	return (
		<div className="h-full w-full overflow-hidden rounded-lg p-2">
			<div ref={containerRef} className="w-full h-full" />
		</div>
	);
}
