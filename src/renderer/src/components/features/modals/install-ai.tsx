import Icon from "@/components/icons/icon";
import { Button, Card, Modal } from "@/components/ui";
import ProgressBar from "@/components/ui/progress-bar";
import { useTranslation } from "@/translations/translation-context";
import {
	ArrowRight,
	ChevronLeft,
	Cpu,
	Loader2,
	ShieldCheck,
	Sparkles,
} from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

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
	logs: Record<string, string>;
	downloadOllama: () => void;
}) {
	const { t } = useTranslation();
	return (
		<Modal
			isOpen={true}
			onClose={() => { }}
			maxWidth="2xl"
			showCloseButton={false}
			closeOnBackdropClick={false}
			closeOnEscape={false}
		>
			<div className="flex flex-col rounded-xl w-full relative overflow-hidden min-h-[500px]">
				<div className="absolute top-0 left-0 w-full h-1 bg-white opacity-50" />

				<div className="flex-1 flex flex-col items-center justify-center w-full">
					{installStep === 1 && (
						<div className="flex gap-4 flex-col items-center justify-center w-full h-fit text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="p-3 rounded-xl bg-white/5 border border-white/10 mb-2">
								<Icon name="Dio" className="w-8 h-8 text-white" />
							</div>
							<h1 className="text-3xl font-bold text-white tracking-tight">
								{t("installAI.step1.title")}
							</h1>
							<p className="text-neutral-400 text-pretty max-w-md text-sm">
								{t("installAI.step1.description")}
							</p>
						</div>
					)}

					{installStep === 2 && (
						<div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="text-center mb-8">
								<h2 className="text-2xl font-bold text-white mb-2">
									{t("installAI.step2.title")}
								</h2>
								<p className="text-neutral-400 text-sm">
									{t("installAI.step2.description")}
								</p>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
								<Card
									variant="interactive"
									padding="lg"
									className="flex flex-col items-center text-center gap-2"
								>
									<Sparkles
										className="w-6 h-6 mb-1"
										style={{ color: "var(--theme-accent)" }}
									/>
									<h3 className="text-white font-medium text-sm">
										{t("installAI.step2.features.free.title")}
									</h3>
									<p className="text-neutral-500 text-xs">
										{t("installAI.step2.features.free.description")}
									</p>
								</Card>
								<Card
									variant="interactive"
									padding="lg"
									className="flex flex-col items-center text-center gap-2"
								>
									<Cpu
										className="w-6 h-6 mb-1"
										style={{ color: "var(--theme-accent)" }}
									/>
									<h3 className="text-white font-medium text-sm">
										{t("installAI.step2.features.local.title")}
									</h3>
									<p className="text-neutral-500 text-xs">
										{t("installAI.step2.features.local.description")}
									</p>
								</Card>
								<Card
									variant="interactive"
									padding="lg"
									className="flex flex-col items-center text-center gap-2"
								>
									<ShieldCheck
										className="w-6 h-6 mb-1"
										style={{ color: "var(--theme-accent)" }}
									/>
									<h3 className="text-white font-medium text-sm">
										{t("installAI.step2.features.private.title")}
									</h3>
									<p className="text-neutral-500 text-xs">
										{t("installAI.step2.features.private.description")}
									</p>
								</Card>
							</div>
						</div>
					)}

					{installStep === 3 && (
						<div className="flex gap-4 flex-col items-center justify-center w-full h-fit text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="p-3 rounded-xl bg-white/5 border border-white/10 mb-2">
								<Icon name="Dio" className="w-8 h-8 text-white" />
							</div>
							<h1 className="text-3xl font-bold text-white tracking-tight">
								{t("installAI.step3.title")}
							</h1>
							<p className="text-neutral-400 text-pretty max-w-md text-sm mb-8">
								{t("installAI.step3.description")}
							</p>

							{ollamaStatus === "installing" && (
								<div className="w-full max-w-md">
									<ProgressBar
										mode="indeterminate"
										label={
											logs["ollama"]?.[logs["ollama"].length - 1] ||
											t("installAI.step3.startingDownload")
										}
									/>
								</div>
							)}
						</div>
					)}

					<div className="w-full flex flex-col gap-6 mt-8">
						<div className="flex justify-center gap-2">
							{[1, 2, 3].map((step) => (
								<div
									key={step}
									className={`w-2 h-2 rounded-xl transition-colors duration-300 ${step === installStep ? "bg-white" : "bg-white/20"
										}`}
								/>
							))}
						</div>

						<div className="flex justify-between items-center w-full">
							<Button
								variant="ghost"
								size="md"
								onClick={() => setInstallStep((s) => Math.max(1, s - 1))}
								className={
									installStep === 1 ? "opacity-0 pointer-events-none" : ""
								}
							>
								<ChevronLeft className="w-4 h-4" />
								{t("installAI.back")}
							</Button>

							{installStep < 3 ? (
								<Button
									onClick={() => setInstallStep((s) => Math.min(3, s + 1))}
									variant="primary"
									size="md"
								>
									{t("installAI.next")}
									<ArrowRight className="w-4 h-4" />
								</Button>
							) : (
								<Button
									disabled={ollamaStatus === "installing"}
									onClick={(e) => {
										if (ollamaStatus !== "installing") e.preventDefault();
										downloadOllama();
									}}
									variant="primary"
									size="md"
								>
									{ollamaStatus === "installing"
										? t("installAI.step3.installing")
										: t("installAI.step3.installNow")}
									{ollamaStatus === "installing" ? (
										<Loader2 className="w-4 h-4 animate-spin" />
									) : (
										<ArrowRight className="w-4 h-4" />
									)}
								</Button>
							)}
						</div>
					</div>
				</div>
			</div>
		</Modal>
	);
}
