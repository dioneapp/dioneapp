import Editor, { loader } from "@monaco-editor/react";
import { Folder, Loader2, RefreshCcw } from "lucide-react";
import "monaco-editor/esm/vs/basic-languages/monaco.contribution";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import "monaco-editor/esm/vs/language/css/monaco.contribution";
import "monaco-editor/esm/vs/language/html/monaco.contribution";
import "monaco-editor/esm/vs/language/json/monaco.contribution";
import "monaco-editor/esm/vs/language/typescript/monaco.contribution";
// import "monaco-editor/min/vs/editor/editor.main.css";
import type { FileEncoding, FileNode } from "./utils/types";

loader.config({ monaco });

// Define custom theme that matches the app's dark aesthetic
const defineCustomTheme = (monacoInstance: typeof monaco) => {
	monacoInstance.editor.defineTheme("dione-dark", {
		base: "vs-dark",
		inherit: true,
		rules: [
			{ token: "comment", foreground: "737373", fontStyle: "italic" },
			{ token: "keyword", foreground: "f472b6" },
			{ token: "string", foreground: "86efac" },
			{ token: "number", foreground: "7dd3fc" },
			{ token: "regexp", foreground: "c4b5fd" },
			{ token: "type", foreground: "c084fc" },
			{ token: "class", foreground: "c084fc" },
			{ token: "function", foreground: "a78bfa" },
			{ token: "variable", foreground: "e5e5e5" },
			{ token: "constant", foreground: "fbbf24" },
			{ token: "operator", foreground: "f472b6" },
			{ token: "delimiter", foreground: "a3a3a3" },
			{ token: "tag", foreground: "86efac" },
			{ token: "attribute.name", foreground: "7dd3fc" },
			{ token: "attribute.value", foreground: "86efac" },
		],
		colors: {
			"editor.background": "#0a0a0a",
			"editor.foreground": "#e5e5e5",
			"editorLineNumber.foreground": "#525252",
			"editorLineNumber.activeForeground": "#a3a3a3",
			"editor.lineHighlightBackground": "#171717",
			"editor.selectionBackground": "#334155",
			"editor.inactiveSelectionBackground": "#1e293b",
			"editorCursor.foreground": "#ffffff",
			"editorWhitespace.foreground": "#404040",
			"editorIndentGuide.background": "#262626",
			"editorIndentGuide.activeBackground": "#404040",
			"editor.findMatchBackground": "#475569",
			"editor.findMatchHighlightBackground": "#47556980",
			"editorWidget.background": "#171717",
			"editorWidget.border": "#ffffff1a",
			"editorSuggestWidget.background": "#171717",
			"editorSuggestWidget.border": "#ffffff1a",
			"editorSuggestWidget.selectedBackground": "#262626",
			"editorHoverWidget.background": "#171717",
			"editorHoverWidget.border": "#ffffff1a",
			"peekView.border": "#ffffff1a",
			"peekViewEditor.background": "#0a0a0a",
			"peekViewResult.background": "#171717",
			"scrollbar.shadow": "#00000000",
			"scrollbarSlider.background": "#ffffff20",
			"scrollbarSlider.hoverBackground": "#ffffff40",
			"scrollbarSlider.activeBackground": "#ffffff66",
		},
	});
};

interface PreviewPaneProps {
	selectedFileNode?: FileNode;
	fileEncoding: FileEncoding;
	fileContent: string;
	fileMimeType: string | null;
	filePreviewUrl: string | null;
	fileError: string | null;
	isLoadingFile: boolean;
	isDirty: boolean;
	language: string;
	onReloadFile: () => void;
	onContentChange: (value: string) => void;
}

const PreviewPane = ({
	selectedFileNode,
	fileEncoding,
	fileContent,
	fileMimeType,
	filePreviewUrl,
	fileError,
	isLoadingFile,
	isDirty,
	language,
	onReloadFile,
	onContentChange,
}: PreviewPaneProps) => {
	if (!selectedFileNode || selectedFileNode.type !== "file") {
		return (
			<div className="flex h-full flex-col items-center justify-center gap-3 text-center text-sm text-neutral-300">
				<Folder className="h-8 w-8 text-neutral-500" />
				<span>Select a file to start editing</span>
			</div>
		);
	}

	const renderMediaPreview = () => {
		if (!fileMimeType || !filePreviewUrl) {
			return (
				<div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-neutral-300">
					<span>Preview not available for this file.</span>
				</div>
			);
		}

		if (fileMimeType.startsWith("image/")) {
			return (
				<div className="flex h-full items-center justify-center bg-neutral-950 p-6">
					<img
						src={filePreviewUrl}
						alt={selectedFileNode.name}
						className="max-h-full max-w-full rounded-md shadow-lg"
					/>
				</div>
			);
		}

		if (fileMimeType.startsWith("audio/")) {
			return (
				<div className="flex h-full items-center justify-center bg-neutral-950">
					{/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
					<audio controls src={filePreviewUrl} className="w-full max-w-xl">
						Your browser does not support the audio element.
					</audio>
				</div>
			);
		}

		if (fileMimeType.startsWith("video/")) {
			return (
				<div className="flex h-full items-center justify-center bg-black">
					{/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
					<video src={filePreviewUrl} controls className="max-h-full w-full">
						Your browser does not support the video element.
					</video>
				</div>
			);
		}

		return (
			<div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-neutral-300">
				<span>Preview for this media type is not supported yet.</span>
				<span className="text-xs text-neutral-500">{fileMimeType}</span>
			</div>
		);
	};

	return (
		<>
			<div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-xs text-neutral-300">
				<span className="truncate" title={selectedFileNode.absolutePath}>
					{selectedFileNode.relativePath}
				</span>
				{(isDirty || fileEncoding === "base64") && (
					<div className="flex items-center gap-2">
						{fileEncoding === "base64" && (
							<span
								className="rounded-md bg-neutral-800 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-400"
								title={fileMimeType ?? undefined}
							>
								Preview only
							</span>
						)}
						{isDirty && (
							<span className="rounded-full bg-amber-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-300">
								Unsaved
							</span>
						)}
					</div>
				)}
			</div>
			<div className="relative flex-1">
				{isLoadingFile ? (
					<div className="flex h-full items-center justify-center">
						<Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
					</div>
				) : fileError ? (
					<div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-neutral-300">
						<span>{fileError}</span>
						<button
							type="button"
							onClick={onReloadFile}
							className="flex items-center gap-2 rounded-md border border-white/10 px-3 py-1 text-xs text-neutral-200 transition-colors hover:bg-white/10"
						>
							<RefreshCcw className="h-3.5 w-3.5" />
							<span>Retry</span>
						</button>
					</div>
				) : fileEncoding === "base64" ? (
					renderMediaPreview()
				) : (
					<Editor
						key={selectedFileNode.relativePath}
						value={fileContent}
						onChange={(value) => onContentChange(value ?? "")}
						language={language}
						className="h-full overflow-auto"
						beforeMount={(monacoInstance) => {
							defineCustomTheme(monacoInstance);
						}}
						options={{
							fontFamily:
								"'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace",
							fontLigatures: true,
							fontSize: 13,
							tabSize: 2,
							minimap: { enabled: false },
							scrollBeyondLastLine: false,
							automaticLayout: true,
							padding: { top: 16, bottom: 250 },
							cursorBlinking: "smooth",
							cursorSmoothCaretAnimation: "on",
							smoothScrolling: true,
							lineNumbers: "on",
							renderLineHighlight: "all",
							bracketPairColorization: {
								enabled: true,
							},
						}}
						theme="dione-dark"
					/>
				)}
			</div>
		</>
	);
};

export default PreviewPane;
