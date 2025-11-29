import { useTranslation } from "@/translations/translation-context";
import { AnimatePresence, motion } from "framer-motion";
import { FolderOpen } from "lucide-react";
import { useState } from "react";

export default function SelectPath({ onFinish }: { onFinish: () => void }) {
	const [selectedPath, setSelectedPath] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean>(false);
	const { t } = useTranslation();

	const handlePathSelection = async () => {
		setError(null);
		setSelectedPath(null);
		setSuccess(false);
		const result = await window.electron.ipcRenderer.invoke("save-dir");

		if (!result.canceled) {
			setSelectedPath(result.filePaths[0]);
			if (result) {
				// disallow whitespace in selected path
				if (/\s/.test(result.filePaths[0])) {
					setError(
						"Selected path cannot contain spaces. Please choose a different folder.",
					);
					return;
				}
				setError(null);
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
						setSuccess(true);
						window.electron.ipcRenderer.invoke("init-env");
					} else {
						setError(
							"An error occurred while updating the configuration. Please try again.",
						);
					}
				} else {
					setError(
						"To avoid errors on new updates, choose a different path than the Dione executable.",
					);
				}
			} else {
				setError(
					"An error occurred while selecting the path. Please try again.",
				);
			}
		}
	};

	return (
		<AnimatePresence>
			<section className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
				<div className="flex flex-col items-center justify-center h-full w-full max-w-screen-lg gap-8">
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="text-center"
					>
						<h1 className="text-5xl font-semibold text-center mb-4">
							{t("firstTime.selectPath.title")}
						</h1>
						<p className="text-neutral-400 text-center max-w-2xl leading-relaxed">
							{t("firstTime.selectPath.description")}
						</p>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
					className="w-full max-w-2xl"
				>
					<div className="border border-white/10 rounded-xl p-8 backdrop-blur-sm" style={{
						background: 'linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 5%, transparent), color-mix(in srgb, var(--theme-background) 10%, transparent))'
					}}>
						<h3 className="text-white font-semibold text-lg text-center mb-6">
							{t("selectPath.chooseLocation")}
						</h3>
							<div className="w-full h-32 mb-6">
									<button
										onClick={handlePathSelection}
										className="focus:outline-none focus:ring-2 focus:ring-offset-2 px-6 cursor-pointer active:scale-[0.98] w-full h-full rounded-xl border border-white/20 border-dashed transition-all duration-300 backdrop-blur-sm group"
										style={{
											background: 'linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 10%, transparent), color-mix(in srgb, var(--theme-background) 20%, transparent))'
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.background = 'linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 15%, transparent), color-mix(in srgb, var(--theme-background) 30%, transparent))';
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.background = 'linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 10%, transparent), color-mix(in srgb, var(--theme-background) 20%, transparent))';
										}}
									>
									<div className="flex flex-col items-center justify-center h-full">
										{selectedPath ? (
											<>
												<div className="mb-2 group-hover:scale-110 transition-transform duration-300">
													<FolderOpen className="w-8 h-8" style={{ color: 'var(--theme-accent)' }} />
												</div>
												<span className="text-white font-medium text-sm mb-2">
													{t("selectPath.changePath")}
												</span>
												<div className="text-center">
													<p className="text-white font-mono text-xs break-all bg-black/20 rounded px-2 py-1 max-w-full">
														{selectedPath}
													</p>
												</div>
											</>
										) : (
											<>
												<div className="mb-3 group-hover:scale-110 transition-transform duration-300">
													<FolderOpen className="w-12 h-12" style={{ color: 'var(--theme-accent)' }} />
												</div>
												<span className="text-white font-medium text-lg">
													{t("firstTime.selectPath.button")}
												</span>
											</>
										)}
									</div>
								</button>
							</div>
							<p className="text-gray-400 text-sm leading-relaxed italic my-4">
								{t("firstTime.selectPath.warning")}
							</p>

							{error && (
								<motion.div
									initial={{ opacity: 0, y: -10, filter: "blur(4px)" }}
									animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
									exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
									transition={{ duration: 0.3 }}
									className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-center text-sm text-red-200 backdrop-blur-sm"
								>
									{error}
								</motion.div>
							)}

							{success && (
								<motion.button
								onClick={onFinish}
								initial={{ opacity: 0, y: 20, filter: "blur(20px)" }}
								animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
								exit={{ opacity: 0, y: -20, filter: "blur(20px)" }}
								transition={{ duration: 0.4 }}
								className="w-full px-6 text-black font-semibold py-3 rounded-xl text-lg active:scale-[0.98] cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl"
								style={{
									background: 'linear-gradient(to right, var(--theme-gradient-from), var(--theme-gradient-to))'
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.background = 'linear-gradient(to right, color-mix(in srgb, var(--theme-gradient-from) 90%, transparent), color-mix(in srgb, var(--theme-gradient-to) 90%, transparent))';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.background = 'linear-gradient(to right, var(--theme-gradient-from), var(--theme-gradient-to))';
								}}
							>
									{t("firstTime.selectPath.success")}
								</motion.button>
							)}
						</div>
					</motion.div>
				</div>
			</section>
		</AnimatePresence>
	);
}
