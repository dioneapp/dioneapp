import Messages from "@/components/ai/messages";
import Models from "@/components/ai/models";
import { useScriptsContext } from "@/components/contexts/ScriptsContext";
import { motion } from "framer-motion";
import {
	ArrowRight,
	BrushCleaning,
	CornerLeftDown,
	Play,
	Square,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { useAIContext } from "@/components/contexts/ai-context";
import { InstallAIModal } from "@/components/modals/install-ai";

export default function QuickAI() {
	const { logs } = useScriptsContext();
	const { chat, messages, setMessages, usingTool, messageLoading, checkOllama, handleStartOllama, handleStopOllama, showInstallModal, showModelHub, setShowModelHub, setOllamaModel, setOllamaSupport, ollamaModel, ollamaInstalled, ollamaRunning, installStep, setInstallStep, ollamaStatus, downloadOllama } = useAIContext();
	const logsEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		checkOllama();

		return () => {
			handleStopOllama();
		};
	}, []);

	return (
		<div className="w-full h-[calc(100vh-87px)]">
			{showInstallModal && (
				<InstallAIModal
					installStep={installStep}
					setInstallStep={setInstallStep}
					ollamaStatus={ollamaStatus}
					logs={logs}
					downloadOllama={downloadOllama}
				/>
			)}
			<div className="w-full max-w-3xl h-full flex flex-col items-center justify-center mx-auto relative">
				{showModelHub ? (
					<Models
						setOllamaModel={setOllamaModel}
						setOllamaSupport={setOllamaSupport}
						ollamaModel={ollamaModel}
					/>
				) : (
					<div className="flex justify-center items-center h-full w-full mt-auto">
						{messages.length === 0 && !showModelHub ? (
							<>
								<ul className="text-sm gap-2 flex flex-col items-start justify-start w-full text-pretty max-w-2xl text-neutral-300 ">
									<li
										onClick={() => chat("Open FaceFusion")}
										className="bg-white/10 px-4 py-1 rounded-lg flex gap-2 items-center hover:text-neutral-100 cursor-pointer transition-colors duration-200"
									>
										"Open FaceFusion" <ArrowRight className="ml-2" size={16} />
									</li>
									<li
										onClick={() => chat("Install Applio")}
										className="bg-white/10 px-4 py-1 rounded-lg flex gap-2 items-center hover:text-neutral-100 cursor-pointer transition-colors duration-200"
									>
										"Install Applio" <ArrowRight className="ml-2" size={16} />
									</li>
									<li
										onClick={() =>
											chat("What is the latest application in Dione?")
										}
										className="bg-white/10 px-4 py-1 rounded-lg flex gap-2 items-center hover:text-neutral-100 cursor-pointer transition-colors duration-200"
									>
										"What is the latest application in Dione?"{" "}
										<ArrowRight className="ml-2" size={16} />
									</li>
								</ul>
								{!ollamaRunning && ollamaInstalled && !showModelHub && (
									<div className="absolute left-9 bottom-45 w-44 p-4 h-12">
										<div className="w-full h-full flex items-center gap-2 text-neutral-400">
											<CornerLeftDown size={50} />
											<span>Click here to start Ollama</span>
										</div>
									</div>
								)}
							</>
						) : (
							<div className="w-full mx-auto flex justify-center items-center">
								<div ref={logsEndRef} />
								<Messages messages={messages} messageLoading={messageLoading} logsEndRef={logsEndRef} usingTool={usingTool} quickAI />
							</div>
						)}
					</div>
				)}
				<div className="w-full max-w-2xl h-full flex flex-col justify-end mx-auto items-center">
					<div className="flex items-center justify-between px-0.5 w-full">
						<div className="flex gap-2 items-center justify-start w-full">
							<button
								title={
									ollamaRunning && ollamaInstalled
										? "Stop Ollama"
										: "Start Ollama"
								}
								onClick={
									ollamaRunning && ollamaInstalled
										? handleStopOllama
										: handleStartOllama
								}
								className="w-6 h-full flex items-center justify-center cursor-pointer border border-white/40 hover:border-neutral-200 rounded-full p-1 group"
							>
								{ollamaRunning && ollamaInstalled ? (
									<Square className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-200" />
								) : (
									<Play className="w-4 h-4 text-neutral-400 group-hover:text-neutral-200" />
								)}
							</button>
							<button className="w-6 h-full flex items-center justify-center cursor-pointer border border-white/40 hover:border-neutral-200 rounded-full p-1 group"
								onClick={() => setMessages([])}
								title="Clear chat"
							>
								<BrushCleaning className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-200" />
							</button>
							<div
								className="w-fit h-6 flex items-center justify-center"
								onClick={() => setShowModelHub(!showModelHub)}
							>
								<button className="w-full h-full flex items-center justify-center cursor-pointer border border-white/10 outline-none rounded-full px-4 text-[11.5px] text-neutral-300 hover:text-neutral-200 hover:bg-white/10 hover:border-transparent transition-all duration-200">
									<span className="truncate text-center">{ollamaModel || "Loading..."}</span>
								</button>
							</div>
						</div>
						<div className="flex flex-col gap-2 items-end justify-center mr-auto w-full h-full text-[10px] text-neutral-400 font-medium">
							{ollamaRunning && (
								<div className="p-1 px-3 rounded-full bg-green-500/5 backdrop-blur-3xl">
									Ollama running
								</div>
							)}
							{!ollamaRunning && (
								<div className="p-1 px-3 rounded-full bg-red-500/5 backdrop-blur-3xl">
									Ollama not running
								</div>
							)}
						</div>
					</div>
					<div className="w-full overflow-visible h-24 rounded-xl flex flex-col justify-center items-center relative">
						<motion.div
							className="absolute -z-10 rounded-xl h-15 w-full backdrop-blur-3xl blur-xl shadow-xl"
							style={{
								background:
									"linear-gradient(45deg, #7c3aed, #6d28d9, #a855f7, #d946ef, #ec4899)",
								backgroundSize: "400% 400%",
								opacity: 0.12,
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
						<div className="flex max-w-2xl min-h-15 h-15 bg-white/5 backdrop-blur-3xl border hover:border-neutral-700 border-white/5 w-full rounded-xl overflow-hidden">
							<input
								className="w-full h-full focus:outline-neutral-800 rounded-xl border-none bg-transparent text-white px-4"
								type="text"
								placeholder="Ask Dio..."
								autoFocus
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										chat(e.currentTarget.value);
										e.currentTarget.value = "";
									}
								}}
							/>
						</div>
					</div>
					<p className="mt-4 text-[11px] text-white/50">
						AI can make mistakes, please check important information.
					</p>
				</div>
			</div>
		</div>
	);
}
