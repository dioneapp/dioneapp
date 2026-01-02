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
	const containerRef = useRef<HTMLDivElement>(null);
	const terminalRef = useRef<Terminal | null>(null);
	const fitAddonRef = useRef<FitAddon | null>(null);
	const lastProcessedIndex = useRef(0);

	useEffect(() => {
		if (!containerRef.current) return;
		const term = new Terminal({
			convertEol: true,
			allowTransparency: true,
			allowProposedApi: true,
			screenReaderMode: true,
			altClickMovesCursor: false,
			macOptionIsMeta: true,
			theme: {
				background: "#00000000",
				foreground: "#a3a3a3",
				cursor: "#ffffff",
			},
			fontSize: 12.5,
			scrollback: 99999999999,
		});

		const fitAddon = new FitAddon();
		term.loadAddon(fitAddon);
		term.open(containerRef.current);
		fitAddon.fit();

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
		const handleResize = () => fitAddonRef.current?.fit();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		const term = terminalRef.current;
		if (!term || lines.length === 0) return;

		// Write línea por línea para evitar glitches ANSI
		const newLines = lines.slice(lastProcessedIndex.current);
		let wasAtBottom = term.buffer.active.cursorY >= term.buffer.active.baseY + term.rows - 1;

		newLines.forEach((line) => {
			const colored = getColorizedLine(line);  // Tu función OK
			term.write(colored + (colored.includes('\n') ? '' : '\r\n'));
		});

		lastProcessedIndex.current = lines.length;

		if (wasAtBottom) {
			term.scrollToBottom();
		}
	}, [lines]);

	return (
		<div id={id} className="h-[400px] w-full min-h-[200px]">  {/* Altura fija clave */}
			<div ref={containerRef} className="w-full h-full" />
		</div>
	);
}
