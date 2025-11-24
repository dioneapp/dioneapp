import Icon from "@/components/icons/icon";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

export default function Messages({
	messages,
	logsEndRef,
	quickAI,
}: {
	messages: any[];
	logsEndRef: React.RefObject<HTMLDivElement | null>;
	quickAI?: boolean;
}) {
	// scroll to bottom
	useEffect(() => {
		if (logsEndRef.current) {
			logsEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	return (
		<div
			id={`${quickAI ? "logs" : ""}`}
			className={`flex flex-col w-full h-full overflow-y-auto ${quickAI ? "max-h-110 min-h-110 h-full mt-20 -mx-24 pt-4" : ""}`}
		>
			{messages.map((message: any, index: number) => (
				<div
					key={index}
					className={`flex w-full ${quickAI ? `px-12 items-start gap-4 mb-2 ${message?.role === "user" ? "justify-end" : "justify-start"}` : "items-center justify-center"}`}
				>
					{message?.role !== "user" && quickAI && (
						<div className="rounded-full flex items-center justify-center">
							<Icon name="Dio" className="w-5 h-5" />
						</div>
					)}
					<div className={`flex flex-col ${quickAI ? "max-w-[70%]" : ""}`}>
						{message?.role !== "user" &&
							message?.message?.tool_calls &&
							message?.message?.tool_calls?.length > 0 && (
								<div className="mb-2">
									{message?.message?.tool_calls[0].function.name ===
										"read_file" && (
										<span className="text-xs text-gray-500 dark:text-gray-400">
											Reading files...
										</span>
									)}
								</div>
							)}
						<div
							className={`prose prose-invert text-sm leading-relaxed text-pretty ${message?.role === "user" ? "text-neutral-300" : ""}`}
						>
							<ReactMarkdown
								remarkPlugins={[remarkGfm]}
								rehypePlugins={[rehypeRaw, rehypeSanitize]}
								components={{
									code({
										node,
										inline,
										className,
										children,
										...props
									}: {
										node?: any;
										inline?: boolean;
										className?: string;
										children?: React.ReactNode;
									}) {
										const match = /language-(\w+)/.exec(className || "");
										const codeText = String(children).replace(/\n$/, "");

										const CodeBlockWithCopy = () => {
											const [copied, setCopied] = useState(false);
											const handleCopy = () => {
												navigator.clipboard.writeText(codeText).then(() => {
													setCopied(true);
													setTimeout(() => setCopied(false), 1500);
												});
											};
											return (
												<div className="relative group rounded-lg overflow-hidden text-wrap break-all">
													<button
														type="button"
														onClick={handleCopy}
														aria-label="Copy code"
														className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 cursor-pointer bg-white/10 backdrop-blur-3xl border border-white/5 text-xs px-4 py-1 rounded-full transition-opacity text-wrap break-all"
													>
														{copied ? "Copied!" : "Copy"}
													</button>
													{codeText}
												</div>
											);
										};

										return !inline && match ? (
											<CodeBlockWithCopy />
										) : (
											<code
												className="bg-neutral-800 rounded text-sm font-mono text-wrap break-all"
												{...props}
											>
												{children}
											</code>
										);
									},
								}}
							>
								{message.content || message.message?.content || "No content"}
							</ReactMarkdown>
						</div>
					</div>
				</div>
			))}
			<div ref={logsEndRef} />
		</div>
	);
}
