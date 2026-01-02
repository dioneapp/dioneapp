import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalFooter,
	Textarea,
} from "@/components/ui";
import { useTranslation } from "@/translations/translation-context";
import { apiFetch } from "@/utils/api";
import { FileText, X } from "lucide-react";
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
		<Modal
			isOpen={true}
			onClose={onClose}
			maxWidth="2xl"
			showCloseButton={false}
		>
			<div className="flex justify-between w-full items-center mb-6">
				<h2 className="font-semibold text-xl flex items-center justify-center">
					{t("local.uploadModal.title")}
				</h2>
				<Button variant="secondary" size="sm" className="p-2" onClick={onClose}>
					<X className="h-4 w-4" />
				</Button>
			</div>
			<ModalBody>
				<Button
					variant="secondary"
					size="lg"
					onClick={handleFileUpload}
					className="w-full px-6 py-6 border-2 border-dashed border-white/20 hover:border-white/40"
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
							<FileText className="h-8 w-8 mx-auto mb-3 text-white/60" />
							<div className="text-white mb-1">
								{t("local.uploadModal.selectFile")}
							</div>
						</div>
					)}
				</Button>

				{error && (
					<div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm">
						{error}
					</div>
				)}

				<Input
					required
					value={scriptName}
					onChange={(e) => setScriptName(e.target.value)}
					className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:border-white/30 transition-colors text-sm"
					type="text"
					placeholder={t("local.uploadModal.scriptName")}
				/>
				<Textarea
					value={scriptDescription}
					onChange={(e) => setScriptDescription(e.target.value)}
					className="w-full h-24 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-400 resize-none focus:outline-none focus:border-white/30 transition-colors text-sm"
					placeholder={t("local.uploadModal.scriptDescription")}
				/>
			</ModalBody>
			<ModalFooter className="mt-6">
				<Button variant="secondary" size="md" onClick={onClose}>
					{t("common.cancel")}
				</Button>
				<Button
					variant="primary"
					size="md"
					onClick={handleUpload}
					disabled={!scriptName || !scriptFile || isUploading}
				>
					{isUploading
						? t("local.uploadModal.uploading")
						: t("local.uploadModal.uploadFile")}
				</Button>
			</ModalFooter>
		</Modal>
	);
}
