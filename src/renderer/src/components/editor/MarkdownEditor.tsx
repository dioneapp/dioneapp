import Editor, { loader } from "@monaco-editor/react";
import { useTranslation } from "@renderer/translations/translationContext";
import {
    AlertCircle,
    AlertTriangle,
    GripVertical,
    Info,
    Lightbulb,
    XCircle,
} from "lucide-react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import remarkGithubBlockquoteAlert from "remark-github-blockquote-alert";
import "./markdown-preview.css";

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

interface MarkdownEditorProps {
	content: string;
	filePath: string;
	onContentChange: (value: string) => void;
}

const MarkdownEditor = ({
	content,
	filePath,
	onContentChange,
}: MarkdownEditorProps) => {
	const { t } = useTranslation();
	const [editorWidth, setEditorWidth] = useState(50); // Percentage
	const containerRef = useRef<HTMLDivElement>(null);
	const isDraggingRef = useRef(false);

	const handleMouseDown = useCallback((e: React.MouseEvent) => {
		e.preventDefault();
		isDraggingRef.current = true;
		document.body.style.cursor = "col-resize";
		document.body.style.userSelect = "none";
	}, []);

	const handleMouseMove = useCallback((e: MouseEvent) => {
		if (!isDraggingRef.current || !containerRef.current) return;

		const containerRect = containerRef.current.getBoundingClientRect();
		const newWidth =
			((e.clientX - containerRect.left) / containerRect.width) * 100;

		// Constrain between 20% and 80%
		const constrainedWidth = Math.max(20, Math.min(80, newWidth));
		setEditorWidth(constrainedWidth);
	}, []);

	const handleMouseUp = useCallback(() => {
		if (isDraggingRef.current) {
			isDraggingRef.current = false;
			document.body.style.cursor = "";
			document.body.style.userSelect = "";
		}
	}, []);

	useEffect(() => {
		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [handleMouseMove, handleMouseUp]);

	return (
		<div ref={containerRef} className="flex h-full w-full overflow-hidden">
			{/* Editor Pane */}
			<div
				className="flex flex-col h-full border-r border-white/10"
				style={{ width: `${editorWidth}%` }}
			>
				<div className="flex items-center border-b border-white/10 bg-neutral-950/80 px-3 py-1.5 shrink-0">
					<span className="text-xs font-semibold text-neutral-300">{t("editor.editorLabel")}</span>
				</div>
				<div className="flex-1 overflow-hidden">
					<Editor
						key={filePath}
						value={content}
						onChange={(value) => onContentChange(value ?? "")}
						language="markdown"
						className="h-full w-full"
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
							wordWrap: "on",
							wrappingStrategy: "advanced",
							bracketPairColorization: {
								enabled: true,
							},
						}}
						theme="dione-dark"
					/>
				</div>
			</div>

			{/* Resizer */}
			<div
				className="group relative flex w-1 cursor-col-resize items-center justify-center bg-white/5 transition-colors hover:bg-white/10"
				onMouseDown={handleMouseDown}
			>
				<div className="absolute inset-y-0 flex items-center">
					<GripVertical className="h-4 w-4 text-neutral-600 transition-colors group-hover:text-neutral-400" />
				</div>
			</div>

			{/* Preview Pane */}
			<div
				className="flex flex-col h-full"
				style={{ width: `${100 - editorWidth}%` }}
			>
				<div className="flex items-center border-b border-white/10 bg-neutral-950/80 px-3 py-1.5 shrink-0">
					<span className="text-xs font-semibold text-neutral-300">
						Preview
					</span>
				</div>
				<div
					className="flex-1 overflow-y-auto overflow-x-hidden bg-[#0a0a0a]"
					style={{ userSelect: "text" }}
				>
					<div className="markdown-preview p-6" style={{ userSelect: "text" }}>
						<div className="mx-auto max-w-4xl pb-24">
							<ReactMarkdown
								remarkPlugins={[remarkGfm, remarkGithubBlockquoteAlert]}
								rehypePlugins={[rehypeRaw, rehypeSanitize]}
								components={{
									blockquote: ({ children }) => {
										// Check if this is a GitHub alert
										const childArray = Array.isArray(children)
											? children
											: [children];
										const firstChild = childArray[0];

										// Try to detect alert type from the structure
										let alertType: string | null = null;

										if (
											firstChild &&
											typeof firstChild === "object" &&
											"props" in firstChild
										) {
											const props = firstChild.props as any;
											if (props?.children) {
												const text = String(props.children);
												// Check for GitHub alert syntax
												if (text.includes("[!NOTE]")) alertType = "note";
												else if (text.includes("[!TIP]")) alertType = "tip";
												else if (text.includes("[!IMPORTANT]"))
													alertType = "important";
												else if (text.includes("[!WARNING]"))
													alertType = "warning";
												else if (text.includes("[!CAUTION]"))
													alertType = "caution";
											}
										}

										if (alertType) {
											const icons = {
												note: <Info className="h-4 w-4" />,
												tip: <Lightbulb className="h-4 w-4" />,
												important: <AlertCircle className="h-4 w-4" />,
												warning: <AlertTriangle className="h-4 w-4" />,
												caution: <XCircle className="h-4 w-4" />,
											};

											const styles = {
												note: "border-blue-500/50 bg-blue-500/10 text-blue-200",
												tip: "border-green-500/50 bg-green-500/10 text-green-200",
												important:
													"border-purple-500/50 bg-purple-500/10 text-purple-200",
												warning:
													"border-yellow-500/50 bg-yellow-500/10 text-yellow-200",
												caution: "border-red-500/50 bg-red-500/10 text-red-200",
											};

											const labels = {
												note: "Note",
												tip: "Tip",
												important: "Important",
												warning: "Warning",
												caution: "Caution",
											};

											// Filter out the [!TYPE] marker from children
											const filteredChildren = Array.isArray(children)
												? children.filter((child) => {
														if (
															typeof child === "object" &&
															child &&
															"props" in child
														) {
															const text = String(
																(child.props as any)?.children || "",
															);
															return !text.includes(
																`[!${alertType?.toUpperCase()}]`,
															);
														}
														return true;
													})
												: children;

											return (
												<div
													className={`mb-4 rounded-lg border-l-4 p-4 ${styles[alertType as keyof typeof styles]}`}
												>
													<div className="mb-2 flex items-center gap-2 font-semibold">
														{icons[alertType as keyof typeof icons]}
														<span>
															{labels[alertType as keyof typeof labels]}
														</span>
													</div>
													<div className="ml-6">{filteredChildren}</div>
												</div>
											);
										}

										// Regular blockquote
										return (
											<blockquote className="mb-4 border-l-4 border-neutral-600 bg-neutral-900/50 py-2 pl-4 pr-3 italic text-neutral-400">
												{children}
											</blockquote>
										);
									},
								}}
							>
								{content}
							</ReactMarkdown>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MarkdownEditor;
