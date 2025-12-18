import Icon from "@/components/icons/icon";
import { reportBadContent } from "@/utils/report-bad-content";
import { CircleNotchIcon, FlagIcon, HammerIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

export default function Messages({
	messages,
	logsEndRef,
	quickAI,
	messageLoading,
	usingTool,
	model,
}: {
	messages: any[];
	logsEndRef: React.RefObject<HTMLDivElement | null>;
	quickAI?: boolean;
	messageLoading?: boolean;
	usingTool?: { name: string; message: string };
	model?: string;
}) {
	const [reportedMessages, setReportedMessages] = useState<Set<number>>(
		new Set(),
	);
	const [reportingMessages, setReportingMessages] = useState<Set<number>>(
		new Set(),
	);

	const handleReportMessage = async (index: number, message: any) => {
		if (reportedMessages.has(index) || reportingMessages.has(index)) return;

		setReportingMessages((prev) => new Set(prev).add(index));

		try {
			const result = await reportBadContent("ai", undefined, {
				output: message.content || message.message?.content,
				model: model,
				input:
					messages[index - 1].content || messages[index - 1].message?.content,
			});

			if (result === "reported") {
				setReportedMessages((prev) => new Set(prev).add(index));
			}
		} finally {
			setReportingMessages((prev) => {
				const newSet = new Set(prev);
				newSet.delete(index);
				return newSet;
			});
		}
	};

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
					className={`flex w-full ${quickAI ? `px-12 items-start gap-4 mb-2 ${message?.role === "user" ? "justify-end" : "justify-start"}` : `flex gap-2 ${message?.role === "user" ? "justify-end items-center pt-4 first:pt-0" : "justify-start items-start"}`}`}
				>
					{message?.role !== "user" && (
						<div
							className={`rounded-full flex items-center justify-center ${quickAI ? "" : "pt-1"}`}
						>
							<Icon name="Dio" className="w-4 h-4" />
						</div>
					)}
					<div className={`flex flex-col group ${quickAI ? "max-w-full" : ""}`}>
						{message?.role !== "user" &&
							message?.message?.tool_calls &&
							message?.message?.tool_calls?.length > 0 && (
								<div className="my-2 first:mt-0">
									{message?.message?.tool_calls[0].function.name ===
										"read_file" && (
										<span className="text-xs text-gray-500 dark:text-gray-400">
											Reading files...
										</span>
									)}
								</div>
							)}
						<div
							className={`prose prose-invert text-sm leading-relaxed ${quickAI ? "" : `${message?.role === "user" ? "text-right" : "text-pretty"}`} ${message?.role === "user" ? "text-neutral-300" : ""}`}
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
												window.copyToClipboard.writeText(codeText);
												setCopied(true);
												setTimeout(() => setCopied(false), 1500);
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
						{message?.role !== "user" && (
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									handleReportMessage(index, message);
								}}
								disabled={
									reportedMessages.has(index) || reportingMessages.has(index)
								}
								className={`flex items-center gap-1 text-xs mt-1 cursor-pointer ${
									reportedMessages.has(index)
										? "text-green-500"
										: reportingMessages.has(index)
											? "text-neutral-400 animate-pulse"
											: "text-neutral-500 hover:text-red-400"
								}`}
								aria-label="Report bad content"
							>
								<FlagIcon weight="bold" className="w-3 h-3" />
								<span className="inline-block w-[60px]">
									{reportedMessages.has(index)
										? "Reported!"
										: reportingMessages.has(index)
											? "Reporting..."
											: "Report"}
								</span>
							</button>
						)}
					</div>
				</div>
			))}
			{messageLoading && !usingTool?.name && (
				<div
					className={`flex gap-2 text-xs ${quickAI ? "items-center justify-center mx-12" : "items-start justify-start"} animate-pulse rounded-full w-fit text-neutral-500 p-1 px-2`}
				>
					<CircleNotchIcon
						weight="bold"
						className="w-3.5 h-3.5 animate-spin duration-100"
					/>
					<span>Loading...</span>
					{messages.length <= 2 && " (first time loading, maybe take a while)"}
				</div>
			)}
			{usingTool?.name && messageLoading && (
				<div
					className={`flex gap-2 text-xs ${quickAI ? "items-center justify-center mx-12" : "items-start justify-start"} animate-pulse rounded-full w-fit text-neutral-500 p-1 px-2`}
				>
					<HammerIcon weight="bold" className="w-3.5 h-3.5 duration-100" />
					<span>{usingTool.message}...</span>
				</div>
			)}
			<div ref={logsEndRef} />
		</div>
	);
}
