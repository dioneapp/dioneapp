import { useScriptsContext } from "@/components/contexts/scripts-context";
import { IconButton, Modal, ModalBody } from "@/components/ui";
import { useTranslation } from "@/translations/translation-context";
import { apiFetch } from "@/utils/api";
import {
	LoaderCircle,
	Maximize,
	Minimize as Minimize2,
	Minus,
	X,
} from "lucide-react";
import { useState } from "react";

export default function Titlebar() {
	const { t } = useTranslation();
	const { isServerRunning, setExitRef } = useScriptsContext();
	const [showModal, setShowModal] = useState(false);
	const [isMaximized, setIsMaximized] = useState(false);
	const isFullscreen = localStorage.getItem("isFullscreen") === "true";

	// detect macOS via preload-exposed platform
	const isMac =
		typeof window !== "undefined" && (window as any).platform === "darwin";

	const handleClose = async () => {
		if (Object.keys(isServerRunning).length !== 0) {
			const hasRunning = Object.values(isServerRunning).some((value) => value);
			if (hasRunning) {
				setShowModal(true);
				setExitRef(true);
			} else {
				await apiFetch("/ai/ollama/stop", { method: "POST" });
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
			<Modal
				isOpen={showModal}
				onClose={() => setShowModal(false)}
				title={t("titlebar.closing.title")}
			>
				<ModalBody className="h-full">
					<div className="flex flex-col gap-4 h-full mt-auto items-center justify-center">
						<LoaderCircle className="h-12 w-12 text-white animate-spin" />
						<p className="text-neutral-400 text-balance text-center max-w-xl text-sm h-full mt-auto">
							{t("titlebar.closing.description")}
						</p>
					</div>
				</ModalBody>
			</Modal>
			<div className="absolute top-0 w-full z-50" style={{ zIndex: 9999 }}>
				<div className="flex flex-row items-center justify-end h-10 w-full p-6 px-4">
					<div
						className="absolute top-0 right-0 h-10 w-full"
						id={isFullscreen ? "" : "titlebar"}
					/>
					<div className="flex gap-2 items-center justify-end h-full w-fit relative z-10">
						{/* Hide custom window controls on macOS to use native traffic lights */}
						{!isMac && (
							<>
								<IconButton
									id="minimize-button"
									onClick={handleMinimize}
									variant="ghost"
									size="icon-sm"
									className="text-white hover:text-white hover:bg-white/10"
									icon={<Minus className="h-4 w-4" />}
								/>
								<div id="no-draggable">
									<IconButton
										id="maximize-button"
										onClick={handleMaximize}
										variant="ghost"
										size="icon-sm"
										className="text-white hover:text-white hover:bg-white/10"
										icon={
											isMaximized ? (
												<Minimize2 className="h-3.5 w-3.5" />
											) : (
												<Maximize className="h-3.5 w-3.5" />
											)
										}
									/>
								</div>
								<IconButton
									id="close-button"
									onClick={handleClose}
									variant="ghost"
									size="icon-sm"
									className="hover:bg-red-500/20 hover:text-red-400 text-white"
									icon={<X className="h-4 w-4" />}
								/>
							</>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
