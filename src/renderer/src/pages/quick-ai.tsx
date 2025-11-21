import Messages from "@renderer/components/ai/messages";
import ProgressBar from "@renderer/components/common/ProgressBar";
import { useScriptsContext } from "@renderer/components/contexts/ScriptsContext";
import Icon from "@renderer/components/icons/icon";
import { apiFetch, getBackendPort } from "@renderer/utils/api";
import { motion } from "framer-motion";
import {
	ArrowRight,
	ChevronLeft,
	CornerLeftDown,
	Cpu,
	Loader2,
	Play,
	ShieldCheck,
	Sparkles,
	Square,
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
	const [installStep, setInstallStep] = useState(1);
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
			{showInstallModal && (
				<div className="absolute inset-0 w-full h-screen bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
					<div className="w-full h-full flex items-center justify-center max-w-2xl mx-auto p-4">
						<div className="flex flex-col p-8 rounded-2xl border border-white/10 backdrop-blur-3xl bg-neutral-950/80 w-full shadow-2xl relative overflow-hidden min-h-[500px]">
							<div className="absolute top-0 left-0 w-full h-1 bg-white opacity-50" />

							<div className="flex-1 flex flex-col items-center justify-center w-full">
								{installStep === 1 && (
									<div className="flex gap-4 flex-col items-center justify-center w-full h-fit text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
										<div className="p-3 rounded-full bg-white/5 border border-white/10 mb-2">
											<Icon name="Dio" className="w-8 h-8 text-white" />
										</div>
										<h1 className="text-3xl font-bold text-white tracking-tight">
											Meet Dio AI
										</h1>
										<p className="text-neutral-400 text-pretty max-w-md text-sm">
											Your intelligent assistant integrated directly into Dione.
											Experience a new way to interact with your applications.
										</p>
									</div>
								)}

								{installStep === 2 && (
									<div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
										<div className="text-center mb-8">
											<h2 className="text-2xl font-bold text-white mb-2">
												Features
											</h2>
											<p className="text-neutral-400 text-sm">
												Everything you need, right here.
											</p>
										</div>
										<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
											<div className="flex flex-col items-center text-center gap-2 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
												<Sparkles className="w-6 h-6 text-[#BCB1E7] mb-1" />
												<h3 className="text-white font-medium text-sm">
													Free to use
												</h3>
												<p className="text-neutral-500 text-xs">
													No subscriptions or hidden fees.
												</p>
											</div>
											<div className="flex flex-col items-center text-center gap-2 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
												<Cpu className="w-6 h-6 text-[#BCB1E7] mb-1" />
												<h3 className="text-white font-medium text-sm">
													Local Processing
												</h3>
												<p className="text-neutral-500 text-xs">
													Runs entirely on your hardware.
												</p>
											</div>
											<div className="flex flex-col items-center text-center gap-2 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
												<ShieldCheck className="w-6 h-6 text-[#BCB1E7] mb-1" />
												<h3 className="text-white font-medium text-sm">
													Private & Secure
												</h3>
												<p className="text-neutral-500 text-xs">
													Your data never leaves your device.
												</p>
											</div>
										</div>
									</div>
								)}

								{installStep === 3 && (
									<div className="flex gap-4 flex-col items-center justify-center w-full h-fit text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
										<div className="p-3 rounded-full bg-white/5 border border-white/10 mb-2">
											<Icon name="Dio" className="w-8 h-8 text-white" />
										</div>
										<h1 className="text-3xl font-bold text-white tracking-tight">
											Install Ollama
										</h1>
										<p className="text-neutral-400 text-pretty max-w-md text-sm mb-8">
											Dio AI uses Ollama to work with LLMs within your system.
										</p>

										{ollamaStatus === "installing" && (
											<div className="w-full max-w-md">
												<ProgressBar
													mode="indeterminate"
													label={
														logs["ollama"]?.[logs["ollama"].length - 1] ||
														"Starting download..."
													}
												/>
											</div>
										)}
									</div>
								)}
							</div>

							<div className="w-full flex flex-col gap-6 mt-8">
								<div className="flex justify-center gap-2">
									{[1, 2, 3].map((step) => (
										<div
											key={step}
											className={`w-2 h-2 rounded-full transition-colors duration-300 ${
												step === installStep ? "bg-white" : "bg-white/20"
											}`}
										/>
									))}
								</div>

								<div className="flex justify-between items-center w-full">
									<button
										onClick={() => setInstallStep((s) => Math.max(1, s - 1))}
										className={`flex items-center justify-center px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors gap-2 ${
											installStep === 1 ? "opacity-0 pointer-events-none" : ""
										}`}
									>
										<ChevronLeft className="w-4 h-4" />
										Back
									</button>

									{installStep < 3 ? (
										<button
											onClick={() => setInstallStep((s) => Math.min(3, s + 1))}
											className="flex items-center justify-center border border-white/10 rounded-xl px-6 py-2 font-medium text-black cursor-pointer hover:bg-white/90 transition-all text-sm bg-white gap-2 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
										>
											Next
											<ArrowRight className="w-4 h-4" />
										</button>
									) : (
										<button
											disabled={ollamaStatus === "installing"}
											onClick={(e) => {
												if (ollamaStatus !== "installing") e.preventDefault();
												downloadOllama();
											}}
											className="flex items-center justify-center border border-white/10 rounded-xl px-6 py-2 font-medium text-black cursor-pointer hover:bg-white/90 transition-all text-sm bg-white gap-2 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] disabled:bg-white/50 disabled:text-black/50 disabled:cursor-not-allowed disabled:shadow-none"
										>
											{ollamaStatus === "installing"
												? "Installing..."
												: "Install Now"}
											{ollamaStatus === "installing" ? (
												<Loader2 className="w-4 h-4 animate-spin" />
											) : (
												<ArrowRight className="w-4 h-4" />
											)}
										</button>
									)}
								</div>
							</div>
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
				<div className="w-full max-w-2xl h-full flex flex-col justify-end mx-auto items-center">
					<div className="flex items-center justify-between px-0.5 w-full">
						<div className="w-6 h-6 flex items-center justify-center cursor-pointer border border-white/40 hover:border-neutral-200 rounded-full p-1 group">
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
