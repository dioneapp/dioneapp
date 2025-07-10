import { Maximize, Minimize as Minimize2, Minus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "../../translations/translationContext";
import { useScriptsContext } from "../contexts/ScriptsContext";
import { motion } from "framer-motion";

export default function Titlebar() {
	const { t } = useTranslation();
	const { isServerRunning, setExitRef } = useScriptsContext();
	const [showModal, setShowModal] = useState(false);
	const [isMaximized, setIsMaximized] = useState(false);

	const handleClose = async () => {
		if (Object.keys(isServerRunning).length !== 0) {
			const hasRunning = Object.values(isServerRunning).some((value) => value);
			if (hasRunning) {
				setShowModal(true);
				setExitRef(true);
			} else {
				window.electron.ipcRenderer.invoke("app:close");
			}
		} else {
			window.electron.ipcRenderer.invoke("app:close");
		}
	};

	const handleMinimize = async () => {
		await window.electron.ipcRenderer.invoke("app:minimize");
	};

	const handleMaximize = async () => {
		const maximized = await window.electron.ipcRenderer.invoke(
			"app:toggle-maximize",
		);
		setIsMaximized(maximized);
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
				style={{ zIndex: 9999 }}
			>
				<div className="flex flex-row items-center justify-end h-10 w-full p-4 px-2">
					<div
						className="flex gap-1.5 items-center justify-end h-full w-fit hover:bg-white/5 hover:backdrop-blur-sm rounded-lg py-3 px-2"
					>
						<button
							type="button"
							id="minimize-button"
							onClick={handleMinimize}
							className="cursor-pointer p-1 hover:text-white/80 rounded-full transition-colors duration-200"
						>
							<Minus className="h-5 w-5" />
						</button>
						<div id="no-draggable">
							<button
								type="button"
								id="maximize-button"
								onClick={handleMaximize}
								className="cursor-pointer p-1.5 hover:text-white/80 rounded-full transition-colors duration-200"
							>
								{isMaximized ? (
									<Minimize2 className="h-4 w-4" />
								) : (
									<Maximize className="h-4 w-4" />
								)}
							</button>
						</div>
						<button
							type="button"
							id="close-button"
							onClick={handleClose}
							className="cursor-pointer p-1 hover:text-red-400 rounded-full transition-colors duration-200"
						>
							<X className="h-5 w-5" />
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
