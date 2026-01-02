import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

interface TerminalOutputProps {
	lines: string[];
	id?: string;
}

// colorize lines based on content
const getColorizedLine = (line: string): string => {
	if (line.includes("\x1b[")) return line;

	const rules = [
		{ regex: /\bwarn(ing)?\b/i, color: 33 },
		{ regex: /\berror|fail(ed)?\b/i, color: 31 },
		{ regex: /\bsuccess|complete(d)?\b/i, color: 32 },
		{ regex: /\binfo\b/i, color: 34 },
	];

	for (const { regex, color } of rules) {
		if (regex.test(line)) {
			return `\x1b[${color}m${line}\x1b[0m`;
		}
	}

	return line;
};

export default function TerminalOutput({ lines, id }: TerminalOutputProps) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const terminalRef = useRef<Terminal | null>(null);
	const fitAddonRef = useRef<FitAddon | null>(null);
	const lastProcessedIndex = useRef<number>(0);

	useEffect(() => {
		if (!containerRef.current) return;

		const term = new Terminal({
			convertEol: true,
			allowTransparency: true,
			disableStdin: true,
			theme: {
				background: "#00000000",
				foreground: "#a3a3a3",
			},
			fontSize: 13,
			scrollback: 5000,
			lineHeight: 1.4,
		});

		const fitAddon = new FitAddon();
		term.loadAddon(fitAddon);
		term.blur();
		term.element?.setAttribute("tabindex", "-1");

		term.open(containerRef.current);
		fitAddon.fit();

		const canvas = containerRef.current?.querySelector(
			"canvas",
		) as HTMLCanvasElement;
		if (canvas) {
			canvas.style.backgroundColor = "transparent";
			const ctx = canvas.getContext("2d");
			if (ctx) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
			}
		}

		const viewport = containerRef.current?.querySelector(
			".xterm-viewport",
		) as HTMLElement;
		if (viewport) {
			viewport.style.backgroundColor = "transparent";
			viewport.style.scrollbarWidth = "none";
			viewport.style.overflowY = "scroll";
		}

		const screen = containerRef.current?.querySelector(
			".xterm-screen",
		) as HTMLElement;
		if (screen) {
			screen.style.backgroundColor = "transparent";
		}

		terminalRef.current = term;
		fitAddonRef.current = fitAddon;

		return () => {
			term.dispose();
			terminalRef.current = null;
			fitAddonRef.current = null;
			lastProcessedIndex.current = 0;
		};
	}, [id]);

	useEffect(() => {
		const handleResize = () => {
			fitAddonRef.current?.fit();
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		const term = terminalRef.current;
		if (!term) return;

		if (lines.length < lastProcessedIndex.current) {
			term.reset();
			lastProcessedIndex.current = 0;
		}
		const newLines = lines.slice(lastProcessedIndex.current);
		if (newLines.length > 0) {
			const chunk = newLines.map(getColorizedLine).join("\r\n");

			const wasAtBottom =
				term.buffer.active.cursorY >= term.buffer.active.length - 2;

			term.write(chunk + "\r\n");

			if (wasAtBottom) {
				term.scrollToBottom();
			}

			lastProcessedIndex.current = lines.length;
		}
	}, [lines]);

	return (
		<div id={id} className="mb-2">
			<div ref={containerRef} className="h-full w-full" />
		</div>
	);
}
