import { getCurrentPort } from "@renderer/utils/getPort";
import { X } from "lucide-react";
import { useState } from "react";

export default function UploadModal({ onClose }: { onClose: () => void }) {
	const [scriptName, setScriptName] = useState("");
	const [scriptDescription, setScriptDescription] = useState("");
	const [scriptFile, setScriptFile] = useState<string | null>(null);

	const handleFileUpload = () => {
		window.electron.ipcRenderer.invoke("select-file", "").then((result) => {
			setScriptFile(result.filePaths[0]);
		});
	};

	const handleUpload = async () => {
		console.log(scriptFile, scriptName, scriptDescription);
		if (!scriptFile) return;
		if (!scriptName) return;

		const port = await getCurrentPort();
		fetch(
			`http://localhost:${port}/local/upload/${encodeURIComponent(scriptFile)}/${scriptName}/${scriptDescription || "File loaded locally"}`,
			{
				method: "POST",
			},
		)
			.then((response) => {
				if (response.ok) {
					onClose();
				}
			})
			.catch((error) => {
				console.error("Error uploading script:", error);
			});
	};

	return (
		<div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50">
			<div className="flex items-center justify-center h-full w-full max-w-xl mx-auto -mt-4 relative overflow-hidden">
				<div className="p-6 gap-4 flex flex-col rounded-xl border border-white/10 shadow-lg relative overflow-hidden max-h-96 h-96 w-full backdrop-blur-md z-20">
					<div className="absolute top-0 left-0.5/4 w-32 h-32 bg-[#BCB1E7] rounded-full -translate-y-1/2 blur-3xl z-10" />
					<div className="flex justify-between items-start border-b border-white/10 pb-2">
						<h1 className="text-2xl font-semibold">Upload Script</h1>
						<button
							type="button"
							className="cursor-pointer hover:bg-white/10 rounded-full p-1"
							onClick={onClose}
						>
							<X className="h-6 w-6" />
						</button>
					</div>
					<div className="flex flex-col gap-4 text-sm mt-4">
						<button
							onClick={handleFileUpload}
							type="button"
							className=" px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 text-sm font-medium whitespace-nowrap cursor-pointer"
						>
							{scriptFile ? scriptFile : "Select file"}
						</button>
						<input
							required
							value={scriptName}
							onChange={(e) => setScriptName(e.target.value)}
							className="focus:outline-2 focus:outline-white/10 w-full border border-white/10 rounded-lg p-2 bg-transparent resize-none"
							type="text"
							placeholder="Script name"
						/>
						<textarea
							required
							value={scriptDescription}
							onChange={(e) => setScriptDescription(e.target.value)}
							className="focus:outline-2 focus:outline-white/10 w-full h-24 border border-white/10 rounded-lg p-2 bg-transparent resize-none"
							placeholder="Script description"
						/>
					</div>
					<div className="flex justify-end gap-2">
						<button
							onClick={handleUpload}
							type="button"
							className="px-6 py-1 bg-white hover:bg-white/80 text-black rounded-full transition-all duration-300 text-sm font-medium whitespace-nowrap cursor-pointer"
						>
							Upload
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
