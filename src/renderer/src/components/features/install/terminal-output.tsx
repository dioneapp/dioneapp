import { FitAddon } from "@xterm/addon-fit";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { useEffect, useRef } from "react";

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
	const userScrolledUp = useRef(false);

	useEffect(() => {
		if (!containerRef.current) return;

		const term = new Terminal({
			convertEol: true,
			allowTransparency: true,
			theme: {
				background: "#00000000",
				foreground: "#d4d4d8",
				cursor: "rgba(255, 255, 255, 0.8)",
				cursorAccent: "#000000",
				selectionBackground: "rgba(255, 255, 255, 0.2)",
				black: "#18181b",
				red: "#ef4444",
				green: "#22c55e",
				yellow: "#eab308",
				blue: "#3b82f6",
				magenta: "#a855f7",
				cyan: "#06b6d4",
				white: "#e4e4e7",
				brightBlack: "#52525b",
				brightRed: "#f87171",
				brightGreen: "#4ade80",
				brightYellow: "#facc15",
				brightBlue: "#60a5fa",
				brightMagenta: "#c084fc",
				brightCyan: "#22d3ee",
				brightWhite: "#fafafa",
			},
			fontSize: 12.5,
			fontFamily:
				"'Geist Mono', 'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', 'Monaco', monospace",
			fontWeight: "400",
			fontWeightBold: "600",
			lineHeight: 1.4,
			letterSpacing: 0,
			cursorBlink: true,
			cursorStyle: "bar",
			scrollback: 99999999,
			smoothScrollDuration: 120,
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

		const handleScroll = () => {
			if (!term) return;
			const buffer = term.buffer.active;
			const viewport = term.rows;
			const scrollPosition = buffer.viewportY;
			const maxScroll = buffer.baseY;

			const isAtBottom = scrollPosition >= maxScroll - viewport - 3;
			userScrolledUp.current = !isAtBottom;
		};

		term.onScroll(handleScroll);

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
			{ regex: /\b(warn(ing)?|caution)\b/i, color: 93, style: "\x1b[1m" }, // bright yellow bold
			{
				regex: /\b(error|fail(ed)?|fatal|critical)\b/i,
				color: 91,
				style: "\x1b[1m",
			}, // bright red bold
			{
				regex: /\b(success|complete(d)?|done|finished)\b/i,
				color: 92,
				style: "\x1b[1m",
			}, // bright green bold
			{ regex: /\b(info|note|notice)\b/i, color: 96, style: "\x1b[1m" }, // bright cyan bold
			{ regex: /\b(debug|trace)\b/i, color: 90, style: "" }, // bright black (gray)
			{
				regex: /\b(start(ing|ed)?|initializ(e|ing|ed)|launch(ing|ed)?)\b/i,
				color: 94,
				style: "\x1b[1m",
			}, // bright blue bold
		];

		newLines.forEach((line) => {
			// Detect ANSI sequences or lines ending with \r (carriage return)
			// These should be written as-is without adding line breaks
			const hasAnsi =
				line.includes("\x1b") ||
				line.endsWith("\r") ||
				/\x1b\[|\[\d+m|\[\d+;\d+H|\[K|\[\?25|[⠋⠙⠹⠸⠼⠴⠦⠧⠇]/.test(line);

			if (hasAnsi) {
				// Write directly - ANSI codes and \r handle positioning
				term.write(line);
				activeColorRef.current = null;
				return;
			}

			let matchFound = false;
			for (const { regex, color, style } of colorRules) {
				if (regex.test(line)) {
					activeColorRef.current = color;
					const formattedLine = style
						? `${style}\x1b[${color}m${line}\x1b[0m`
						: `\x1b[${color}m${line}\x1b[0m`;
					term.write(formattedLine + (line.includes("\n") ? "" : "\r\n"));
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

		if (!userScrolledUp.current) {
			setTimeout(() => {
				if (term && !userScrolledUp.current) {
					term.scrollToBottom();
				}
			}, 0);
		}
	}, [lines]);

	return (
		<div className="h-full w-full overflow-hidden rounded-xl p-1">
			<div ref={containerRef} className="w-full h-full" />
		</div>
	);
}
