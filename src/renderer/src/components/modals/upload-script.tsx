import { useTranslation } from "@/translations/translation-context";
import { apiFetch } from "@/utils/api";
import { FileTextIcon, XIcon } from "@phosphor-icons/react";
import { useState } from "react";

export default function UploadModal({ onClose }: { onClose: () => void }) {
	const { t } = useTranslation();
	const [scriptName, setScriptName] = useState("");
	const [scriptDescription, setScriptDescription] = useState("");
	const [scriptFile, setScriptFile] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleFileUpload = () => {
		window.electron.ipcRenderer.invoke("select-file", "").then((result) => {
			const fullPath = result.filePaths[0];
			setScriptFile(fullPath);

			const folders = fullPath.split(/[/\\]/);
			const folderName = folders[folders.length - 2];

			setScriptName(folderName.charAt(0).toUpperCase() + folderName.slice(1));
		});
	};

	const handleUpload = async () => {
		if (!scriptName || !scriptFile) return;

		setIsUploading(true);
		setError(null);

		try {
			const response = await apiFetch(
				`/local/upload/${encodeURIComponent(scriptFile)}/${encodeURIComponent(scriptName)}/${encodeURIComponent(
					scriptDescription || t("uploadScript.fileLoadedLocally"),
				)}`,
				{
					method: "POST",
				},
			);

			if (response.ok) {
				onClose();
			} else {
				setError(t("local.uploadModal.errors.uploadFailed"));
			}
		} catch (error) {
			console.error("Error uploading script:", error);
			setError(t("local.uploadModal.errors.uploadError"));
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<div
			className="fixed inset-0 flex items-center justify-center bg-black/95 p-4 backdrop-blur-3xl"
			style={{ zIndex: 100 }}
		>
			<div className="p-6 rounded-xl border border-white/10 shadow-lg relative overflow-hidden max-w-2xl w-full backdrop-blur-md">
				<div
					className="absolute top-0 left-0.5/4 w-32 h-32 rounded-full -translate-y-1/2 blur-3xl z-10"
					style={{ backgroundColor: "var(--theme-blur)" }}
				/>
				<div
					className="absolute -top-10 -left-14 blur-3xl max-w-64 w-full h-64 rounded-full rounded-bl-none rounded-tl-none opacity-40"
					style={{ backgroundColor: "var(--theme-blur)" }}
				/>{" "}
				<div className="flex justify-between w-full items-center relative z-20">
					<h2 className="font-semibold text-xl flex items-center justify-center">
						{t("local.uploadModal.title")}
					</h2>
					<button
						type="button"
						className="cursor-pointer z-50 flex items-center justify-center p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors duration-200"
						onClick={onClose}
					>
						<XIcon className="h-4 w-4" />
					</button>
				</div>
				<div className="pt-6 w-full h-full flex flex-col relative z-20">
					<div className="flex flex-col gap-4">
						<button
							onClick={handleFileUpload}
							type="button"
							className="w-full px-6 py-6 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 text-sm font-medium text-neutral-300 border-2 border-dashed border-white/20 hover:border-white/40 cursor"
						>
							{scriptFile ? (
								<div className="text-center">
									<div className="text-white font-medium mb-2">
										{t("local.uploadModal.selectedFile")}
									</div>
									<div className="text-xs text-neutral-400 break-all">
										{scriptFile}
									</div>
								</div>
							) : (
								<div className="text-center">
									<FileTextIcon className="h-8 w-8 mx-auto mb-3 text-white/60" />
									<div className="text-white mb-1">
										{t("local.uploadModal.selectFile")}
									</div>
								</div>
							)}
						</button>
					</div>

					{error && (
						<div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
							{error}
						</div>
					)}

					<div className="flex flex-col gap-4 mt-4">
						<input
							required
							value={scriptName}
							onChange={(e) => setScriptName(e.target.value)}
							className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:border-white/30 transition-colors text-sm"
							type="text"
							placeholder={t("local.uploadModal.scriptName")}
						/>
						<textarea
							value={scriptDescription}
							onChange={(e) => setScriptDescription(e.target.value)}
							className="w-full h-24 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-neutral-400 resize-none focus:outline-none focus:border-white/30 transition-colors text-sm"
							placeholder={t("local.uploadModal.scriptDescription")}
						/>
					</div>
				</div>
				<div className="flex justify-between mt-6 relative z-20">
					<div className="">
						<button
							onClick={onClose}
							type="button"
							className="flex items-center justify-center gap-2 px-4 py-2 text-sm bg-white/10 hover:bg-white/20 transition-colors duration-400 rounded-full text-neutral-300 font-medium cursor-pointer"
						>
							{t("common.cancel")}
						</button>
					</div>
					<div className="flex items-center justify-end gap-3">
						<button
							onClick={handleUpload}
							type="button"
							disabled={!scriptName || !scriptFile || isUploading}
							className="flex items-center justify-center gap-2 px-4 py-2 text-sm bg-white hover:bg-white/80 transition-colors duration-400 rounded-full text-black font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<span className="font-semibold">
								{isUploading
									? t("local.uploadModal.uploading")
									: t("local.uploadModal.uploadFile")}
							</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
