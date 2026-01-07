import { FitAddon } from "@xterm/addon-fit";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { RefObject, useEffect, useRef } from "react";

interface TerminalOutputProps {
	content: string;
	id: string;
	terminalStatesRef: RefObject<Record<string, Terminal>>;
}
export default function TerminalOutput({ content, id, terminalStatesRef }: TerminalOutputProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const fitAddonRef = useRef<FitAddon | null>(null);
	const lastContentLength = useRef(0);
	const userScrolledUp = useRef(false);

	useEffect(() => {
		if (!containerRef.current) return;

		const term = new Terminal({
			convertEol: true,
			allowTransparency: true,
			disableStdin: false,
			wordSeparator: " ()[]{}',\"`",
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

		terminalStatesRef.current[id] = term;
		fitAddonRef.current = fitAddon;

		const handleResize = () => {
			if (!fitAddonRef.current || !terminalStatesRef.current[id]) return;
			try {
				fitAddonRef.current.fit();
			} catch (e) {
				console.error("Fit addon failed:", e);
			}
			const { cols, rows } = terminalStatesRef.current[id];
			if (id) {
				window.electron?.ipcRenderer?.send("terminal:resize", {
					id,
					cols,
					rows,
				});
			}
		};

		requestAnimationFrame(() => handleResize());

		const observer = new ResizeObserver(() => {
			handleResize();
		});
		observer.observe(containerRef.current);

		window.addEventListener("resize", handleResize);

		const handleScroll = () => {
			if (!term) return;
			const buffer = term.buffer.active;
			const viewport = term.rows;
			const scrollPosition = buffer.viewportY;
			const maxScroll = buffer.baseY;

			const isAtBottom = scrollPosition >= maxScroll - viewport - 1;
			userScrolledUp.current = !isAtBottom;
		};

		term.onScroll(handleScroll);

		return () => {
			observer.disconnect();
			window.removeEventListener("resize", handleResize);
			term.dispose();
			lastContentLength.current = 0;
		};
	}, [id]);

	useEffect(() => {
		const term = terminalStatesRef.current[id];
		if (!term) return;

		if (!content || content.length === lastContentLength.current) return;

		const newContent = content.substring(lastContentLength.current);

		if (newContent) {
			const colorizedContent = newContent
				.replace(/^(ERROR[^•\r\n]*)/gim, "\x1b[91m$1\x1b[0m")
				.replace(/^(INFO[^•\r\n]*)/gim, "\x1b[94m$1\x1b[0m")
				.replace(/^(WARN[^•\r\n]*)/gim, "\x1b[93m$1\x1b[0m");
			term.write(colorizedContent);
			lastContentLength.current = content.length;

			if (!userScrolledUp.current) {
				requestAnimationFrame(() => {
					if (term && !userScrolledUp.current) {
						term.scrollToBottom();
					}
				});
			}
		}
	}, [content]);

	return (
		<div className="h-full w-full overflow-hidden rounded-xl">
			<div ref={containerRef} className="w-full h-full" />
		</div>
	);
}
