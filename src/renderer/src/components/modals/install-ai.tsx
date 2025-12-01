import {
	ArrowRight,
	ChevronLeft,
	Cpu,
	Loader2,
	ShieldCheck,
	Sparkles,
} from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import ProgressBar from "../common/progress-bar";
import Icon from "../icons/icon";

export function InstallAIModal({
	installStep,
	setInstallStep,
	ollamaStatus,
	logs,
	downloadOllama,
}: {
	installStep: number;
	setInstallStep: Dispatch<SetStateAction<number>>;
	ollamaStatus: string;
	logs: Record<string, string[]>;
	downloadOllama: () => void;
}) {
	return (
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
										<Sparkles
											className="w-6 h-6 mb-1"
											style={{ color: "var(--theme-accent)" }}
										/>
										<h3 className="text-white font-medium text-sm">
											Free to use
										</h3>
										<p className="text-neutral-500 text-xs">
											No subscriptions or hidden fees.
										</p>
									</div>
									<div className="flex flex-col items-center text-center gap-2 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
										<Cpu
											className="w-6 h-6 mb-1"
											style={{ color: "var(--theme-accent)" }}
										/>
										<h3 className="text-white font-medium text-sm">
											Local Processing
										</h3>
										<p className="text-neutral-500 text-xs">
											Runs entirely on your hardware.
										</p>
									</div>
									<div className="flex flex-col items-center text-center gap-2 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
										<ShieldCheck
											className="w-6 h-6 mb-1"
											style={{ color: "var(--theme-accent)" }}
										/>
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
	);
}
