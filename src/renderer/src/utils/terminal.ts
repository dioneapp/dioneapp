export const MAX_TERMINAL_LINES = 10000;

const ANSI_REGEX =
	/[\u001B\u009B][[\]()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;

export interface TerminalState {
	lines: string[];
	current: string;
}

export class TerminalNormalizer {
	private state: TerminalState;

	constructor(initial?: Partial<TerminalState>) {
		this.state = {
			lines: initial?.lines ? [...initial.lines] : [],
			current: initial?.current ?? "",
		};
	}

	clear() {
		this.state.lines = [];
		this.state.current = "";
	}

	feed(rawChunk: string) {
		if (!rawChunk) return;
		const chunk = rawChunk.replace(/\r\n/g, "\n");

		for (let i = 0; i < chunk.length; i++) {
			const ch = chunk[i];
			if (ch === "\n") {
				this.commitLine();
				continue;
			}
			const code = ch.charCodeAt(0);
			if (code < 32 && ch !== "\t" && ch !== "\r" && ch !== "\b" && code !== 27) {
				continue;
			}
			this.state.current += ch;
		}
	}

	private commitLine() {
		const current = this.state.current;
		const isCurrentBlank = current.trim().length === 0;
		const last = this.state.lines[this.state.lines.length - 1];
		const isLastBlank = last !== undefined && last.trim().length === 0;
		if (!(isCurrentBlank && isLastBlank)) {
			this.state.lines.push(current);
		}
		this.state.current = "";

		if (this.state.lines.length > MAX_TERMINAL_LINES) {
			this.state.lines = this.state.lines.slice(
				this.state.lines.length - MAX_TERMINAL_LINES,
			);
		}
	}

	getRenderableLines(): string[] {
		if (this.state.current.length > 0) {
			return [...this.state.lines, this.state.current];
		}
		return this.state.lines.slice();
	}
}

export function sanitizeForClipboard(lines: string[]): string {
	return lines.map(line => line.replace(ANSI_REGEX, "")).join("\n");
}
