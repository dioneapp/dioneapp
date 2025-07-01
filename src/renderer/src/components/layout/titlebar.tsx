import { Minus, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "../../translations/translationContext";
import { useScriptsContext } from "../contexts/ScriptsContext";

export default function Titlebar() {
	const { t } = useTranslation();
	const { isServerRunning, setExitRef } = useScriptsContext();
	const [showModal, setShowModal] = useState(false);

	const handleClose = async () => {
		if (Object.keys(isServerRunning).length !== 0) {
			setShowModal(true);
			setExitRef(true);
		} else {
			window.electron.ipcRenderer.invoke("app:close");
		}
	};

	const handleMinimize = async () => {
		await window.electron.ipcRenderer.invoke("app:minimize");
	};

	return (
		<>
			{showModal && (
				<div
					className="fixed top-0 left-0 w-screen h-screen backdrop-filter backdrop-blur-3xl bg-black/80 flex items-center justify-center"
					style={{ zIndex: 100 }}
				>
					<div className="flex flex-col items-center justify-center h-full w-full">
						<h1 className="text-4xl font-semibold mb-4">
							{t("titlebar.closing.title")}
						</h1>
						<p className="text-neutral-400 text-balance text-center max-w-xl">
							{t("titlebar.closing.description")}
						</p>
					</div>
				</div>
			)}
			<div
				id="titlebar"
				className="absolute top-0 w-full z-50"
				style={{ zIndex: 100 }}
			>
				<div className="flex flex-row items-center justify-center h-10 w-full px-2">
					<div className="flex gap-1.5 items-center justify-end h-full w-full">
						<button
							type="button"
							id="minimize-button"
							onClick={handleMinimize}
							className="cursor-pointer p-1 hover:bg-white/10 rounded-full transition-colors duration-200"
						>
							<Minus className="h-5 w-5" />
						</button>
						<button
							type="button"
							id="close-button"
							onClick={handleClose}
							className="cursor-pointer p-1 hover:bg-red-500/20 hover:text-red-400 rounded-full transition-colors duration-200"
						>
							<X className="h-5 w-5" />
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
