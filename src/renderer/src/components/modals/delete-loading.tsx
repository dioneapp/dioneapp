import { useScriptsContext } from "@/components/contexts/ScriptsContext";
import { useTranslation } from "@/translations/translation-context";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Package, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import ProgressBar from "../common/progress-bar";

type UninstallStep = "confirm" | "progress" | "complete";

export default function DeleteLoadingModal({
	status,
	onClose,
	inUseDeps,
	selectedDeps,
	setSelectedDeps,
	onConfirm,
	showDepsSelection = false,
}: {
	status: string;
	onClose: () => void;
	inUseDeps?: string[];
	selectedDeps?: string[];
	setSelectedDeps?: (deps: string[]) => void;
	onConfirm?: () => void;
	showDepsSelection?: boolean;
}) {
	const { t } = useTranslation();
	const { deleteLogs } = useScriptsContext();
	const [currentStep, setCurrentStep] = useState<UninstallStep>(
		showDepsSelection ? "confirm" : "progress"
	);

	useEffect(() => {
		if (status === "deleted") {
			setCurrentStep("complete");
			const timeout = setTimeout(() => {
				onClose();
			}, 2000);

			return () => clearTimeout(timeout);
		} else if (status === "deleting" || status === "deleting_deps") {
			setCurrentStep("progress");
		} else if (status?.startsWith("error")) {
			setCurrentStep("complete");
			// Don't auto-close on error - let user manually close
		}
	}, [status, onClose]);

	const handleConfirmUninstall = () => {
		setCurrentStep("progress");
		if (onConfirm) {
			onConfirm();
		}
	};

	const renderStepIndicator = () => {
		if (!showDepsSelection || currentStep === "complete") return null;
		
		const steps = ["confirm", "progress"];
		const currentIndex = steps.indexOf(currentStep);
		
		return (
			<div className="flex justify-center gap-2 mb-6 relative z-10">
				{steps.map((step, index) => (
					<div
						key={step}
						className={`h-1.5 rounded-full transition-all duration-300 ${
							index <= currentIndex ? "w-8 bg-white" : "w-8 bg-white/20"
						}`}
					/>
				))}
			</div>
		);
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.2 }}
			className="absolute inset-0 w-full h-full bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center"
		>
			<div className="w-full h-full flex items-center justify-center max-w-2xl mx-auto p-4">
				<motion.div
					initial={{ scale: 0.95, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.95, opacity: 0 }}
					transition={{ duration: 0.3, ease: "easeOut" }}
				className="flex flex-col p-8 rounded-2xl border border-white/10 backdrop-blur-3xl bg-neutral-950/80 w-full shadow-2xl relative overflow-hidden"
				style={{ minHeight: "450px", maxHeight: "90vh" }}
			>
				{/* Top accent bar */}
				<div
					className="absolute top-0 left-0 w-full h-1 opacity-50"
					style={{
						background:
							currentStep === "complete"
								? "#22c55e"
								: status?.startsWith("error")
									? "#ef4444"
									: "var(--theme-accent)",
					}}
				/>

				{/* Background glow */}
				<div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
						<div
							className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-15"
							style={{
								backgroundColor:
									currentStep === "complete"
										? "#22c55e"
										: status?.startsWith("error")
											? "#ef4444"
											: "var(--theme-blur)",
							}}
						/>
					</div>

					{/* Step Indicator */}
					{renderStepIndicator()}

					{/* Content */}
					<div className="flex-1 flex flex-col relative z-10 overflow-hidden min-h-0">
						<AnimatePresence mode="wait">
							{/* Step 1: Confirmation & Selection */}
							{currentStep === "confirm" && showDepsSelection && (
								<motion.div
									key="confirm"
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: 20 }}
									transition={{ duration: 0.3 }}
									className="flex flex-col h-full"
								>
									{/* Header */}
									<div className="flex items-center gap-3 mb-6">
										<div className="flex-1">
											<h1 className="font-bold text-2xl text-white">
												{t("deleteLoading.confirm.title") || "Confirm Uninstall"}
											</h1>
											<p className="text-neutral-400 text-sm mt-1">
												{t("deleteLoading.confirm.subtitle") || "Select what to remove"}
											</p>
										</div>
									</div>

									{/* Dependencies Selection */}
									{inUseDeps && inUseDeps.length > 0 && (
										<div className="flex-1 flex flex-col overflow-hidden">
											<div className="flex items-center gap-2 mb-3">
												<Package className="w-4 h-4 text-neutral-400" />
												<h3 className="text-sm font-semibold text-neutral-300">
													{t("deleteLoading.dependencies") || "Dependencies"}
												</h3>
												<span className="text-xs text-neutral-500">
													({selectedDeps?.length || 0}/{inUseDeps.length})
												</span>
											</div>
											
											<div className="flex-1 overflow-auto bg-black/40 border border-white/10 rounded-xl p-4 space-y-2">
												{inUseDeps.map((dep, index) => {
													const selected = selectedDeps?.includes(dep) || false;
													return (
														<motion.label
															key={dep}
															initial={{ opacity: 0, x: -10 }}
															animate={{ opacity: 1, x: 0 }}
															transition={{ delay: index * 0.03 }}
															className="flex items-center gap-3 p-3 rounded-lg cursor-pointer select-none transition-colors hover:bg-white/5 border border-transparent hover:border-white/5"
														>
															<input
																type="checkbox"
																checked={selected}
																onChange={() => {
																	if (setSelectedDeps && selectedDeps) {
																		if (selectedDeps.includes(dep)) {
																			setSelectedDeps(
																				selectedDeps.filter((d) => d !== dep)
																			);
																		} else {
																			setSelectedDeps([...selectedDeps, dep]);
																		}
																	}
																}}
																className="form-checkbox h-4 w-4 rounded border-white/20 bg-transparent focus:ring-0 focus:outline-none cursor-pointer"
																style={{ accentColor: "var(--theme-accent)" }}
															/>
															<span className="text-sm text-neutral-200 font-medium font-mono">
																{dep}
															</span>
														</motion.label>
													);
												})}
											</div>

											<button
												type="button"
												className="mt-3 text-xs text-neutral-400 hover:text-white transition-colors self-start cursor-pointer"
												onClick={() => {
													if (setSelectedDeps && inUseDeps && selectedDeps) {
														if (selectedDeps.length === inUseDeps.length) {
															setSelectedDeps([]);
														} else {
															setSelectedDeps([...inUseDeps]);
														}
													}
												}}
											>
												{selectedDeps?.length === inUseDeps.length
													? t("common.unselectAll")
													: t("common.selectAll")}
											</button>
										</div>
									)}

									{/* Actions */}
									<div className="flex justify-end gap-3 mt-6 pt-6 border-t border-white/10">
										<button
											type="button"
											onClick={onClose}
											className="px-6 py-2 text-sm bg-white/10 hover:bg-white/20 transition-colors rounded-full text-white font-medium cursor-pointer"
										>
											{t("common.cancel")}
										</button>
										<button
											type="button"
											onClick={handleConfirmUninstall}
											className="px-6 py-2 text-sm bg-white hover:bg-white/90 transition-colors rounded-full text-black font-semibold cursor-pointer"
										>
											{t("actions.uninstall")}
										</button>
									</div>
								</motion.div>
							)}

							{/* Step 2: Progress */}
							{currentStep === "progress" && (
								<motion.div
									key="progress"
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: 20 }}
									transition={{ duration: 0.3 }}
									className="flex flex-col items-center justify-center gap-6 flex-1 min-h-0"
								>
								<div className="flex flex-col gap-2 text-center">
									<h1 className="font-bold text-2xl text-white">
										{t("deleteLoading.uninstalling.title")}
									</h1>
									<p className="text-neutral-400 text-sm">
										{t("deleteLoading.uninstalling.wait")}
									</p>
								</div>

								<div className="w-full max-w-md flex flex-col items-center">
									<ProgressBar
										mode="indeterminate"
										label={
											deleteLogs.length > 0
												? deleteLogs[deleteLogs.length - 1]?.content
												: t("deleteLoading.processing") || "Processing..."
										}
										status="running"
									/>
								</div>

								{/* Logs */}
								{deleteLogs.length > 0 && (
									<div className="w-full max-w-md">
										<div className="flex flex-col gap-1 p-4 border border-white/10 rounded-xl bg-black/40 max-h-48 overflow-auto">
											{deleteLogs.slice(-20).map((log, i) => (
												<motion.p
													key={i}
													initial={{ opacity: 0, y: -5 }}
													animate={{ opacity: 1, y: 0 }}
													className="text-xs text-neutral-400 font-mono"
												>
													{log.content}
												</motion.p>
											))}
										</div>
									</div>
								)}
							</motion.div>
						)}

							{/* Step 3: Complete or Error */}
							{currentStep === "complete" && (
								<motion.div
									key="complete"
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.9 }}
									transition={{ duration: 0.3 }}
								className="flex flex-col items-center justify-center gap-6 flex-1 min-h-0"
								>
									{status?.startsWith("error") ? (
										<>
											<motion.div
												initial={{ scale: 0 }}
												animate={{ scale: 1 }}
												transition={{ type: "spring", stiffness: 200, damping: 20 }}
												className="p-4 rounded-full bg-red-500/10 border border-red-500/20"
												style={{
													boxShadow: "0 0 30px rgba(239, 68, 68, 0.3)",
												}}
											>
												<XCircle className="w-16 h-16 text-red-500" />
											</motion.div>
										<div className="flex flex-col gap-2 text-center max-w-md">
												<h1 className="font-bold text-2xl text-white">
													{t("deleteLoading.error.title")}{" "}
													<span className="text-red-500">
														{t("deleteLoading.error.subtitle")}
													</span>
												</h1>
												<p className="text-sm text-neutral-400 mt-2">
													{status === "error_deps"
														? t("deleteLoading.error.deps")
														: t("deleteLoading.error.general")}
												</p>
												<button
													type="button"
													onClick={onClose}
												className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-full text-sm transition-colors cursor-pointer"
												>
													{t("common.close") || "Close"}
												</button>
											</div>
										</>
									) : (
										<>
											<motion.div
												initial={{ scale: 0 }}
												animate={{ scale: 1 }}
												transition={{ type: "spring", stiffness: 200, damping: 20 }}
												className="p-4 rounded-full bg-green-500/10 border border-green-500/20"
												style={{
													boxShadow: "0 0 30px rgba(34, 197, 94, 0.3)",
												}}
											>
												<CheckCircle className="w-16 h-16 text-green-500" />
											</motion.div>
									<div className="flex flex-col gap-2 text-center max-w-md">
												<h1 className="font-bold text-2xl text-white">
													{t("deleteLoading.success.title")}{" "}
													<span className="text-green-500">
														{t("deleteLoading.success.subtitle")}
													</span>
												</h1>
												<p className="text-xs text-neutral-500 mt-2">
													{t("deleteLoading.autoClosing") || "Closing automatically..."}
												</p>
											</div>
										</>
									)}
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</motion.div>
			</div>
		</motion.div>
	);
}
