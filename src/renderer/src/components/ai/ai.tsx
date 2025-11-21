import { getBackendPort } from "@/utils/api";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Messages from "./messages";

export default function AI({
	getContext,
	workspaceName,
	nodes,
	workspacePath,
}: {
	getContext: () => any;
	workspaceName: string;
	nodes: any[];
	workspacePath: string;
}) {
	const [open, setOpen] = useState(false);
	// const [loading, setLoading] = useState(false);
	const [messages, setMessages] = useState<any[]>([]);
	const [ollamaStatus, setOllamaStatus] = useState("");
	const logsEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const chat = async (prompt: string) => {
		const port = await getBackendPort();
		const context = getContext();
		const files = nodes.map((node) => ({
			name: node.name,
			type: node.type,
			path: node.path,
			children:
				node.children?.map((child: any) => ({
					name: child.name,
					type: child.type,
					path: child.path,
				})) || undefined,
		}));
		const response = await fetch(`http://localhost:${port}/ai/ollama/chat`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				prompt,
				model: "llama3.2",
				context: context.context,
				name: context.name,
				path: context.path,
				workspaceName: workspaceName,
				workspaceFiles: files,
				workspacePath: workspacePath,
			}),
		});

		if (response.status === 500) {
			console.log("ollama is closed");
			setOllamaStatus("closed");
		}

		const data = await response.json();
		setMessages((prev) => [...prev, data]);
	};

	return (
		<>
			<div className="fixed bottom-6 right-6" style={{ zIndex: 1000 }}>
				<div className="group relative flex gap-2">
					<AnimatePresence mode="wait">
						{open && (
							<motion.div
								initial={{ backdropFilter: "blur(10px)", opacity: 0, x: 30 }}
								animate={{ backdropFilter: "blur(10px)", opacity: 1, x: 0 }}
								exit={{
									backdropFilter: "blur(0px)",
									filter: "blur(5px)",
									opacity: 0,
									x: 100,
								}}
								transition={{ duration: 0.2 }}
								key="open-div"
								className="flex items-center justify-end w-79 gap-2 rounded-full rounded-r-none"
							>
								<motion.div
									className="absolute inset-0 -z-10 rounded-full -mr-12 blur"
									style={{
										background:
											"linear-gradient(45deg, #7c3aed, #6d28d9, #a855f7, #d946ef, #ec4899)",
										backgroundSize: "400% 400%",
										opacity: 0.3,
									}}
									animate={{
										backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
										transition: {
											duration: 8,
											ease: "easeInOut",
											repeat: Number.POSITIVE_INFINITY,
										},
									}}
								/>
								<motion.input
									type="text"
									autoFocus
									className="w-full h-10 px-4 text-sm rounded-full text-white/90 placeholder-white/50 focus:outline-none"
									placeholder="Ask AI..."
									onKeyDown={(e) => {
										if (e.key === "Escape") {
											setOpen(false);
										}
										if (e.key === "Enter") {
											chat(e.currentTarget.value);
											e.currentTarget.value = "";
										}
									}}
								/>
							</motion.div>
						)}
					</AnimatePresence>
					<motion.div key="closed-div" title={open ? "Close" : "Open"}>
						<div
							onClick={() => setOpen(!open)}
							className="h-10 w-10 rounded-full backdrop-blur-3xl opacity-80 cursor-pointer"
						>
							<motion.div
								className="w-full h-full rounded-full shadow-2xl blur-[6px] hover:blur-xs transition-all duration-300"
								style={{
									background:
										"linear-gradient(45deg, #7c3aed, #6d28d9, #a855f7, #d946ef, #ec4899)",
									backgroundSize: "400% 400%",
								}}
								animate={{
									backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
								}}
								transition={{
									duration: 8,
									ease: "easeInOut",
									repeat: Number.POSITIVE_INFINITY,
								}}
							/>
						</div>
						{!open && (
							<span className="bg-black rounded text-sm blur-xl group-hover:blur-none group-hover:right-12 opacity-0 group-hover:opacity-100 transition-all duration-200 absolute right-4 top-1/2 -translate-y-1/2 px-3 whitespace-nowrap">
								Use AI
							</span>
						)}
					</motion.div>
				</div>
			</div>
			{open && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2, delay: 0.7 }}
					className="fixed bottom-20 right-6"
					style={{ zIndex: 1001 }}
				>
					{ollamaStatus === "closed" && (
						<div className="w-fit text-[11px] mb-2 flex items-center justify-end ml-auto gap-2 backdrop-blur-3xl rounded-full overflow-hidden">
							<span className="bg-red-500/10 px-2 text-red-500 font-semibold">
								Ollama not found
							</span>
						</div>
					)}
					{messages && messages.length > 0 && !messages[0]?.error && (
						<div
							className="backdrop-blur-3xl bg-neutral-900/40 rounded-2xl p-4 text-neutral-200 text-sm shadow-lg w-90 max-h-80 overflow-y-auto"
							style={{ scrollbarWidth: "none" }}
						>
							<Messages messages={messages} logsEndRef={logsEndRef} />
						</div>
					)}
				</motion.div>
			)}
		</>
	);
}
