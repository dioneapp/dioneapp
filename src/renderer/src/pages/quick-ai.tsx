import Messages from "@renderer/components/ai/messages";
import { useScriptsContext } from "@renderer/components/contexts/ScriptsContext";
import TerminalOutput from "@renderer/components/install/TerminalOutput";
import { apiFetch, getBackendPort } from "@renderer/utils/api";
import { motion } from "framer-motion";
import {
	ArrowRight,
	CornerLeftDown,
	Loader2,
	Play,
	Square,
	StopCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function QuickAI() {
	const [messages, setMessages] = useState<{ role: string; content: string }[]>(
		[],
	);
	const [ollamaStatus, setOllamaStatus] = useState("");
	const [ollamaInstalled, setOllamaInstalled] = useState(false);
	const [ollamaRunning, setOllamaRunning] = useState(false);
	const [showInstallModal, setShowInstallModal] = useState<boolean | string>(
		false,
	);
	const { sockets, connectApp, logs } = useScriptsContext();
	const logsEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		checkOllama();

		return () => {
			handleStopOllama();
		};
	}, []);

	const checkOllama = async () => {
		const response = await apiFetch(`/ai/ollama/isinstalled`, {
			method: "GET",
		});
		const data = await response.json();
		setOllamaInstalled(data?.installed);
		if (!data?.installed) {
			setOllamaStatus("not installed");
			setShowInstallModal(true);
		} else {
			setOllamaStatus("starting");
			const response = await handleStartOllama();
			const result = await response?.json();
			if (result?.message.includes("Ollama server started")) {
				setOllamaStatus("running");
				setOllamaRunning(true);
			} else {
				setOllamaStatus("error");
			}
		}
		return data;
	};

	async function downloadOllama() {
		const isInstalled = await apiFetch("/ai/ollama/isinstalled", {
			method: "GET",
		});
		const data = await isInstalled.json();
		if (data?.installed) {
			console.log("Ollama is already installed");
			return;
		}

		setOllamaStatus("installing");
		if (!sockets["ollama"]) {
			await connectApp("ollama", true);
			await new Promise((resolve) => setTimeout(resolve, 500)); // wait for socket to connect
		}

		window.electron.ipcRenderer.invoke(
			"notify",
			"Downloading...",
			`Starting download of Ollama`,
		);
		await apiFetch("/ai/ollama/install", {
			method: "POST",
		});
		setOllamaStatus("installed");
		setOllamaInstalled(true);
		setShowInstallModal(false);
	}

	async function handleStopOllama() {
		await apiFetch("/ai/ollama/stop", {
			method: "POST",
		});
		setOllamaRunning(false);
	}

	async function handleStartOllama() {
		const response = await apiFetch("/ai/ollama/start", {
			method: "POST",
		});
		if (response.status === 200) {
			setOllamaRunning(true);
		}
		return response;
	}

	const chat = async (prompt: string) => {
		const userMessage = { role: "user", content: prompt };
		setMessages((prev) => [...prev, userMessage]);

		try {
			const port = await getBackendPort();
			const response = await fetch(`http://localhost:${port}/ai/ollama/chat`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					prompt,
					model: "llama3.2",
					quickAI: true,
				}),
			});

			const data = await response.json();

			if (data?.error) {
				console.error(data?.message);
				setOllamaStatus(data?.error);
				setMessages((prev) => [
					...prev,
					{ role: "assistant", content: data?.message },
				]);
				return;
			}

			setMessages((prev) => [
				...prev,
				{ role: "assistant", content: data?.message?.content },
			]);
		} catch (error) {
			console.error("Error fetching data:", error);
			setMessages((prev) => [
				...prev,
				{
					role: "assistant",
					content: "An error occurred while fetching data. Please try again.",
				},
			]);
		}
	};

	return (
		<div className="w-full h-[calc(100vh-87px)]">
			{showInstallModal === true && (
				<div className="absolute inset-0 w-full h-screen bg-black/90 backdrop-blur-sm z-50">
					<div className="w-full h-full flex items-center justify-center max-w-xl mx-auto">
						<div className="flex flex-col items-center justify-center p-8 rounded-xl border border-white/10 backdrop-blur-3xl bg-neutral-900/50 w-full h-90">
							<div className="flex gap-1 flex-col items-start justify-start w-full h-fit">
								<h1 className="text-4xl font-bold text-white">
									This is Dio AI
								</h1>
								<p className="text-white/70 text-pretty px-0.5 text-sm">
									A new way to use any app inside Dione quickly, simple and
									without clicks.
								</p>
							</div>
							<div className="flex items-center pb-12 h-full w-full text-white/80 text-xl">
								<ul className="list-disc px-7">
									<li className="px-0.5 text-balance">Free to use</li>
									<li className="px-0.5 text-balance">
										Runs entirely on your system
									</li>
									<li className="px-0.5 text-balance">
										Can interact with any app
									</li>
								</ul>
							</div>
							<button
								title="Next"
								onClick={() => setShowInstallModal("install")}
								className="flex items-center justify-end w-fit ml-auto border border-white/5 rounded-xl px-4 py-1 font-medium text-black cursor-pointer hover:bg-white/80 text-sm bg-white gap-2"
							>
								Next
								<ArrowRight className="w-4 h-4" />
							</button>
						</div>
					</div>
				</div>
			)}
			{showInstallModal === "install" && (
				<div className="absolute inset-0 w-full h-screen bg-black/90 backdrop-blur-sm z-50">
					<div className="w-full h-full flex items-center justify-center max-w-xl mx-auto">
						<div className="flex gap-6 flex-col items-center justify-center p-8 rounded-xl border border-white/10 backdrop-blur-3xl bg-neutral-900/50 w-full h-90">
							<div className="flex gap-1 flex-col items-start justify-start w-full h-fit">
								<h1 className="text-4xl font-bold text-white">
									Install Ollama
								</h1>
								<p className="text-white/70 text-pretty px-0.5 text-sm">
									Dio AI uses Ollama to work with LLMs within your system.
								</p>
							</div>
							<div className="flex items-start h-full w-full text-white/80 text-xs border border-white/10 rounded p-4 bg-neutral-900">
								{logs["ollama"] && (
									<TerminalOutput
										id="logs"
										lines={logs?.["ollama"]}
										containerClassName="hide-scrollbar overflow-auto pointer-events-auto select-text max-h-28"
										className="whitespace-pre-wrap break-words font-mono text-xs text-left flex gap-1 flex-col text-neutral-400"
										autoScroll
									/>
								)}
							</div>
							<button
								disabled={ollamaStatus === "installing"}
								title="Next"
								onClick={(e) => {
									if (ollamaStatus !== "installing") e.preventDefault();
									downloadOllama();
								}}
								className="flex items-center justify-end w-fit ml-auto border border-white/5 rounded-xl px-4 py-1 font-medium text-black cursor-pointer hover:bg-white/80 text-sm bg-white gap-2 disabled:bg-white/50 disabled:text-black/50 disabled:cursor-not-allowed"
							>
								{ollamaStatus === "installing" ? "Loading..." : "Install"}
								{ollamaStatus === "installing" ? (
									<Loader2 className="w-4 h-4 animate-spin" />
								) : (
									<ArrowRight className="w-4 h-4" />
								)}
							</button>
						</div>
					</div>
				</div>
			)}
			<div className="w-full max-w-3xl h-full flex flex-col items-center justify-center mx-auto relative">
				<div className="flex justify-center items-center h-full w-full mt-auto">
					{messages.length === 0 ? (
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
							{!ollamaRunning && ollamaInstalled && (
								<div className="absolute left-12 bottom-40 w-44 p-4 h-12">
									<div className="w-full h-full flex items-center gap-2 text-neutral-200 rotate-10">
										<CornerLeftDown size={50} />
										<span>Click here to start Ollama</span>
									</div>
								</div>
							)}
						</>
					) : (
						<div className="w-full mx-auto flex justify-center items-center">
							<div ref={logsEndRef} />
							<Messages messages={messages} logsEndRef={logsEndRef} quickAI />
						</div>
					)}
				</div>
				<div className="w-full max-w-2xl h-full flex flex-col justify-end mx-auto w-full items-center">
					<div className="flex items-center justify-between px-0.5 w-full">
						<div className="w-6 h-6 flex items-center justify-center cursor-pointer border border-white/40 hover:border-neutral-200 rounded-full flex items-center p-1 group">
							{ollamaRunning && ollamaInstalled ? (
								<button
									className="cursor-pointer transition-colors duration-200"
									title="Stop Ollama"
									onClick={handleStopOllama}
								>
									<Square className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-200" />
								</button>
							) : (
								<button
									className="cursor-pointer transition-colors duration-200"
									title="Start Ollama"
									onClick={handleStartOllama}
								>
									<Play className="w-4 h-4 text-neutral-400 group-hover:text-neutral-200" />
								</button>
							)}
						</div>
						<div className="flex flex-col gap-2 items-end justify-end mr-auto w-full h-full text-[10px] text-neutral-400 font-medium">
							{ollamaRunning && (
								<div className="p-1 px-3 rounded-full bg-green-500/10 backdrop-blur-3xl">
									Ollama running
								</div>
							)}
							{!ollamaRunning && (
								<div className="p-1 px-3 rounded-full bg-red-500/10 backdrop-blur-3xl">
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
						<div className="flex max-w-2xl min-h-15 h-15 bg-white/5 backdrop-blur-3xl border border-white/5 w-full rounded-xl overflow-hidden">
							<input
								className="w-full h-full outline-none border-none bg-transparent text-white px-4"
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
