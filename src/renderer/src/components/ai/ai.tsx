import Messages from "@/components/ai/messages";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useAIContext } from "../contexts/ai-context";
import { useScriptsContext } from "../contexts/scripts-context";
import { InstallAIModal } from "../modals/install-ai";

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
	const logsEndRef = useRef<HTMLDivElement>(null);

	// ai
	const {
		checkOllama,
		handleStopOllama,
		chat,
		messages,
		ollamaStatus,
		showInstallModal,
		installStep,
		setInstallStep,
		downloadOllama,
		ollamaRunning,
		messageLoading,
		usingTool,
		ollamaModel,
	} = useAIContext();
	const { logs } = useScriptsContext();

	useEffect(() => {
		if (open) {
			checkOllama();
		}

		return () => {
			if (ollamaRunning) {
				handleStopOllama();
			}
		};
	}, [open]);

	useEffect(() => {
		logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	useEffect(() => {
		if (!open && ollamaRunning) {
			handleStopOllama();
		}
	}, [open]);

	const handleChat = async (prompt: string) => {
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

		chat(prompt, false, {
			context: context.context,
			name: context.name,
			path: context.path,
			workspaceName: workspaceName,
			workspaceFiles: files,
			workspacePath: workspacePath,
		});
	};

	return (
		<>
			<div className="fixed bottom-6 right-6" style={{ zIndex: 1000 }}>
				{showInstallModal && (
					<InstallAIModal
						installStep={installStep}
						setInstallStep={setInstallStep}
						ollamaStatus={ollamaStatus}
						logs={logs}
						downloadOllama={downloadOllama}
					/>
				)}
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
								className="flex items-center justify-end w-79 gap-2 rounded-xl rounded-r-none"
							>
								<motion.div
									className="absolute inset-0 -z-10 rounded-xl -mr-12 blur"
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
									className="w-full h-10 px-4 text-sm rounded-xl text-white/90 placeholder-white/50 focus:outline-none"
									placeholder="Ask AI..."
									onKeyDown={(e) => {
										if (e.key === "Escape") {
											setOpen(false);
										}
										if (e.key === "Enter") {
											handleChat(e.currentTarget.value);
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
							className="h-10 w-10 rounded-xl backdrop-blur-3xl opacity-80 cursor-pointer"
						>
							<motion.div
								className="w-full h-full rounded-xl shadow-2xl blur-[6px] hover:blur-xs transition-all duration-300"
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
							<span className="bg-black rounded-xl text-sm blur-xl group-hover:blur-none group-hover:right-12 opacity-0 group-hover:opacity-100 transition-all duration-200 absolute right-4 top-1/2 -translate-y-1/2 px-3 whitespace-nowrap">
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
					<div className="flex flex-col gap-2 items-end justify-center mr-auto w-full h-full text-[10px] mb-2 text-neutral-400 font-medium">
						{ollamaRunning && (
							<div className="p-1 px-3 rounded-xl bg-green-500/05 backdrop-blur-3xl">
								Ollama running
							</div>
						)}
						{!ollamaRunning && (
							<div className="p-1 px-3 rounded-xl bg-red-500/05 backdrop-blur-3xl">
								Ollama not running
							</div>
						)}
					</div>
					{messages && messages.length > 0 && (
						<div
							id="logs"
							className="backdrop-blur-3xl rounded-ml p-4 pb-8 text-neutral-200 text-sm shadow-lg w-90 max-h-80 overflow-y-auto"
							style={{ scrollbarWidth: "none" }}
						>
							<Messages
								messages={messages}
								logsEndRef={logsEndRef}
								messageLoading={messageLoading}
								usingTool={usingTool}
								model={ollamaModel}
							/>
						</div>
					)}
				</motion.div>
			)}
		</>
	);
}
