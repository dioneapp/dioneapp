// Terminal output normalizer for non-interactive rendering
// - Normalizes CRLF/CR to LF model
// - Applies carriage return (\r) to overwrite current line
// - Applies backspace (\b) to remove previous character
// - Strips ANSI escape sequences when colors are not rendered
// - Collapses duplicate blank lines

export const MAX_TERMINAL_LINES = 10000;

// Based on common ANSI regexes used in popular libraries (chalk/strip-ansi)
// This aims to match CSI, OSC, and other escape sequences so they can be safely stripped
const ANSI_REGEX =
	/[\u001B\u009B][[\]()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g; // eslint-disable-line no-control-regex

export interface TerminalState {
	lines: string[]; // committed lines (without trailing \n)
	current: string; // current line buffer
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

	// Feed a raw chunk from a process/stream
	feed(rawChunk: string) {
		if (!rawChunk) return;
		// Normalize CRLF first so Windows newlines are treated as a single break
		let chunk = rawChunk.replace(/\r\n/g, "\n");
		// Strip ANSI sequences if we are not rendering colors
		chunk = chunk.replace(ANSI_REGEX, "");

		// Iterate char-by-char to properly handle control characters
		for (let i = 0; i < chunk.length; i++) {
			const ch = chunk[i];
			if (ch === "\n") {
				this.commitLine();
				continue;
			}
			if (ch === "\r") {
				// Carriage return: reset current line (overwrite behavior)
				this.state.current = "";
				continue;
			}
			if (ch === "\b") {
				// Backspace: remove last char of current line if exists
				if (this.state.current.length > 0) {
					this.state.current = this.state.current.slice(0, -1);
				}
				continue;
			}
			// Ignore other C0 control chars except tab which we keep as-is
			const code = ch.charCodeAt(0);
			if (code < 32 && ch !== "\t") {
				continue;
			}
			this.state.current += ch;
		}
	}

	private commitLine() {
		const current = this.state.current;
		// Collapse duplicate blank lines
		const isCurrentBlank = current.trim().length === 0;
		const last = this.state.lines[this.state.lines.length - 1];
		const isLastBlank = last !== undefined && last.trim().length === 0;
		if (!(isCurrentBlank && isLastBlank)) {
			this.state.lines.push(current);
		}
		this.state.current = "";

		// Trim to last MAX_TERMINAL_LINES lines to keep UI responsive
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

// Convenience helpers
export function sanitizeForClipboard(lines: string[]): string {
	return lines.join("\n");
}
