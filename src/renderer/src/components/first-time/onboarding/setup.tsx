import { languages, useTranslation } from "@/translations/translation-context";
import { motion } from "framer-motion";
import { Check, FolderOpen, Globe } from "lucide-react";
import { useState } from "react";

interface SetupProps {
	onSelectLanguage: () => void;
}

export default function Setup({
	onSelectLanguage,
}: SetupProps) {
	const { setLanguage, language, t } = useTranslation();
	const [selectedPath, setSelectedPath] = useState<string | null>(null);
	const [pathError, setPathError] = useState<string | null>(null);
	const [pathSuccess, setPathSuccess] = useState<boolean>(false);

	const handlePathSelection = async () => {
		setPathError(null);
		setSelectedPath(null);
		setPathSuccess(false);
		const result = await window.electron.ipcRenderer.invoke("save-dir");

		if (!result.canceled) {
			setSelectedPath(result.filePaths[0]);
			if (result) {
				if (/\s/.test(result.filePaths[0])) {
					setPathError(
						t("firstTime.languageSelector.error.spaces"),
					);
					return;
				}
				setPathError(null);
				const accept = await window.electron.ipcRenderer.invoke(
					"check-dir",
					result.filePaths[0],
				);

				if (accept) {
					const configUpdated1 = await window.electron.ipcRenderer.invoke(
						"update-config",
						{ defaultBinFolder: result.filePaths[0] },
					);
					const configUpdated2 = await window.electron.ipcRenderer.invoke(
						"update-config",
						{ defaultInstallFolder: result.filePaths[0] },
					);

					if (configUpdated1 && configUpdated2) {
						setPathSuccess(true);
						window.electron.ipcRenderer.invoke("init-env");
					} else {
						setPathError(
							t("firstTime.languageSelector.error.updateConfig"),
						);
					}
				} else {
					setPathError(
						t("firstTime.languageSelector.error.samePath"),
					);
				}
			} else {
				setPathError(
					t("firstTime.languageSelector.error.general"),
				);
			}
		}
	};

	const canProceed = language && pathSuccess;

	return (
		<section className="min-h-screen flex flex-col items-center justify-center px-4">
			<div className="flex flex-col items-center justify-center w-full max-w-screen-lg gap-4">
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="text-center"
				>
					<h1 className="text-5xl font-semibold text-center mb-4">
						{t("firstTime.languageSelector.title")}
					</h1>
					<p className="text-neutral-400 text-center max-w-2xl leading-relaxed mx-auto">
						{t("firstTime.languageSelector.description")}
					</p>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="flex flex-col lg:flex-row gap-6 w-full max-w-5xl"
				>
					{/* Language Selection */}
					<div
						className="flex-1 p-6 rounded-xl border border-white/10 backdrop-blur-sm"
						style={{
							background:
								"linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 5%, transparent), color-mix(in srgb, var(--theme-background) 10%, transparent))",
						}}
					>
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-2">
								<Globe className="w-5 h-5" />
							<h3 className="text-white font-semibold text-lg">{t("firstTime.languageSelector.languageSection")}</h3>
							</div>
						</div>
						<div className="max-h-96 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
							{Object.entries(languages).map(([key, value]) => (
								<button
									type="button"
									key={key}
									onClick={() => setLanguage(key as any)}
									className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between group ${
										language === key
											? "bg-white/20 border border-white/30"
											: "bg-white/5 hover:bg-white/10 border border-transparent"
									}`}
								>
									<span className="font-medium">{value}</span>
									{language === key && (
										<motion.div
											initial={{ scale: 0 }}
											animate={{ scale: 1 }}
											className="w-5 h-5 rounded-full flex items-center justify-center"
											style={{
												background:
													"linear-gradient(to right, var(--theme-gradient-from), var(--theme-gradient-to))",
											}}
										>
											<Check className="w-3 h-3 text-black" />
										</motion.div>
									)}
								</button>
							))}
						</div>
						<a
							href="https://github.com/dioneapp/dioneapp"
							target="_blank"
							rel="noopener noreferrer"
							className="block text-left text-xs text-neutral-400 hover:text-neutral-200 transition-colors duration-200 mt-4"
						>
							{t("settings.interface.helpTranslate")}
						</a>
					</div>

					{/* Installation Path */}
					<div
						className="flex-1 p-6 rounded-xl border border-white/10 backdrop-blur-sm"
						style={{
							background:
								"linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 5%, transparent), color-mix(in srgb, var(--theme-background) 10%, transparent))",
						}}
					>
						<div className="flex items-center gap-2 mb-4">
							<FolderOpen className="w-5 h-5" />
							<h3 className="text-white font-semibold text-lg">
								{t("firstTime.languageSelector.installationPathSection")}
							</h3>
						</div>
						<p className="text-neutral-400 text-sm mb-4">
							{t("firstTime.languageSelector.pathDescription")}
						</p>
						<button
							type="button"
							onClick={handlePathSelection}
							className={`w-full min-h-32 border-2 border-dashed rounded-lg transition-all duration-300 flex flex-col items-center justify-center gap-2 group p-4 ${
								selectedPath
									? "border-white/30 bg-white/5"
									: "border-white/20 hover:border-white/40 hover:bg-white/5"
							}`}
						>
							<FolderOpen className="w-8 h-8 text-white/60 group-hover:text-white/80 transition-colors" />
							<span className="text-white/60 group-hover:text-white/80 transition-colors text-sm">
							{selectedPath ? t("firstTime.languageSelector.changeFolder") : t("firstTime.languageSelector.selectFolder")}
							</span>
							{selectedPath && (
								<span className="text-xs text-white/80 font-mono break-all text-center mt-2">
									{selectedPath}
								</span>
							)}
						</button>

						{pathError && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
							>
								<p className="text-sm text-red-400">{pathError}</p>
							</motion.div>
						)}

						{pathSuccess && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg"
							>
								<p className="text-sm text-green-400">
									{t("firstTime.languageSelector.success")}
								</p>
							</motion.div>
						)}
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
					className="flex justify-center mt-2"
				>
					<button
						type="button"
						onClick={onSelectLanguage}
						disabled={!canProceed}
						className={`px-6 py-2 mb-8 cursor-pointer transition-all duration-300 rounded-full text-sm font-medium ${
							canProceed
								? "bg-white text-black hover:opacity-80 active:scale-[0.97] shadow-lg"
								: "bg-white/10 text-white/50 cursor-not-allowed border border-white/10"
						}`}
					>
						{canProceed ? t("languageSelector.next") : t("firstTime.languageSelector.proceedButton")}
					</button>
				</motion.div>
			</div>
		</section>
	);
}
