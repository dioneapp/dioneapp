import NetworkShareModal from "@/components/modals/network-share";
import { useTranslation } from "@/translations/translation-context";
import { motion } from "framer-motion";
import {
	Activity,
	ArrowLeft,
	Folder,
	Maximize2,
	PictureInPicture,
	RotateCcw,
	Share2,
	Square,
	SquareTerminal,
	X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

interface IframeProps {
	iframeSrc: string;
	handleStop: () => void;
	currentPort: number;
	setShow: React.Dispatch<React.SetStateAction<Record<string, string>>>;
	data: any;
}

interface TunnelInfo {
	url: string;
	type: "localtunnel";
	status: "active" | "connecting" | "error";
	password?: string;
}

interface SystemUsage {
	cpu: number;
	ram: { percent: number; usedGB: number };
	disk: number;
}

export default function IframeComponent({
	iframeSrc,
	handleStop,
	currentPort,
	setShow,
	data,
}: IframeProps) {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [systemUsage, setSystemUsage] = useState<SystemUsage>({
		cpu: 0,
		ram: { percent: 0, usedGB: 0 },
		disk: 0,
	});
	const [tunnelInfo, setTunnelInfo] = useState<TunnelInfo | null>(null);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [showNetworkShareModal, setShowNetworkShareModal] = useState(false);

	useEffect(() => {
		return () => {
			localStorage.removeItem("isFullscreen");
		};
	}, []);

	useEffect(() => {
		const updateSystemUsage = async () => {
			try {
				const usage =
					await window.electron.ipcRenderer.invoke("get-system-usage");
				setSystemUsage(usage);
			} catch (error) {
				console.error("Failed to get system usage", error);
			}
		};

		updateSystemUsage();

		const interval = setInterval(updateSystemUsage, 2000);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		const updateTunnelInfo = async () => {
			try {
				const tunnel =
					await window.electron.ipcRenderer.invoke("get-current-tunnel");
				setTunnelInfo(tunnel);
			} catch (error) {
				console.error("Failed to get tunnel info", error);
			}
		};

		updateTunnelInfo();
	}, []);

	const handleEnterFullscreen = () => {
		const container = document.getElementById(
			"iframe-container",
		) as HTMLElement;
		if (container && !document.fullscreenElement) {
			container.requestFullscreen().catch((err) => {
				console.error(`Error attempting to enable fullscreen: ${err.message}`);
				return;
			});

			localStorage.setItem("isFullscreen", "true");
		}
	};

	const handleExitFullscreen = () => {
		if (document.fullscreenElement) {
			document.exitFullscreen();
			localStorage.removeItem("isFullscreen");
		}
	};

	const handleOpenEditor = () => {
		if (!data?.id) return;
		setShow({ [data.id]: "editor" });
	};

	useEffect(() => {
		const handleFullscreenChange = () => {
			setIsFullscreen(!!document.fullscreenElement);
		};
		document.addEventListener("fullscreenchange", handleFullscreenChange);
		return () => {
			document.removeEventListener("fullscreenchange", handleFullscreenChange);
		};
	}, []);

	const containerRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const container = containerRef.current;
		if (container && iframeSrc) {
			container.innerHTML = "";

			// create regular webview with download support
			const webview = document.createElement("webview") as Electron.WebviewTag;
			webview.setAttribute("allowpopups", "");
			webview.setAttribute("webpreferences", "allowRunningInsecureContent");
			webview.id = "iframe";
			webview.style.width = "100%";
			webview.style.height = "100%";
			webview.style.border = "0";
			webview.partition = "persist:webview";
			webview.useragent =
				"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36";

			// custom scrollbar styles
			webview.addEventListener("dom-ready", () => {
				webview.insertCSS(`
				::-webkit-scrollbar {
					width: 6px;
				}

				::-webkit-scrollbar-thumb:hover,
				::-webkit-scrollbar-thumb:active {
					background: rgba(255, 255, 255, 0.4);
				}

				::-webkit-scrollbar:hover {
					background: rgba(255, 255, 255, 0.2);
				}

				::-webkit-scrollbar-track {
					background: rgba(255, 255, 255, 0.1);
				}

				::-webkit-scrollbar-thumb {
					background: rgba(255, 255, 255, 0.2);
				}
			`);
			});

			webview.addEventListener("permissionrequest", (event: any) => {
				const permission = event.permission;
				if (
					permission === "media" ||
					permission === "audioCapture" ||
					permission === "videoCapture"
				) {
					event.request.allow();
				} else {
					event.request.deny();
				}
			});

			webview.src = iframeSrc;
			container.appendChild(webview);
		}
	}, [iframeSrc]);

	const handleOpenNewWindow = () => {
		window.electron.ipcRenderer.send("new-window", iframeSrc);
	};

	const handleReloadIframe2 = () => {
		const container = containerRef.current;
		if (container) {
			const webview = container.querySelector("webview") as Electron.WebviewTag;
			if (webview) {
				webview.reload();
			}
		}
	};

	return (
		<div className="w-full h-full flex flex-col gap-3 p-6">
			<motion.div
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				className="w-full flex items-center justify-between gap-3 rounded-xl border border-white/10 p-2 mt-2"
			>
				<div className="flex items-center gap-1.5">
					<button
						type="button"
						className="flex items-center justify-center p-2 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 rounded-xl relative group cursor-pointer"
						onClick={() => navigate("/")}
						title={t("iframeLabels.back")}
					>
						<ArrowLeft className="w-4 h-4" />
						<div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-[10px] bg-black/90 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
							{t("iframe.back")}
						</div>
					</button>
					<button
						type="button"
						className="flex items-center justify-center p-2 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 rounded-xl relative group cursor-pointer"
						onClick={() => setShow({ [data.id]: "logs" })}
						title={t("iframeLabels.logs")}
					>
						<SquareTerminal className="w-4 h-4" />
						<div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-[10px] bg-black/90 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
							{t("iframe.logs")}
						</div>
					</button>
					<button
						type="button"
						onClick={handleOpenEditor}
						className="p-2 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 rounded-xl cursor-pointer relative group"
						title={t("iframe.openFolder")}
					>
						<Folder className="w-4 h-4" />
						<div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-[10px] bg-black/90 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
							{t("iframe.openFolder")}
						</div>
					</button>
					<button
						type="button"
						onClick={() => setShowNetworkShareModal(true)}
						className="flex items-center justify-center p-2 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 rounded-xl relative group cursor-pointer"
						title={t("iframeActions.shareOnNetwork")}
					>
						<Share2 className="w-4 h-4" />
						{tunnelInfo && (
							<div
								className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-xl border border-neutral-900 animate-pulse"
								style={{ backgroundColor: "var(--theme-accent)" }}
							/>
						)}
						<div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-[10px] bg-black/90 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
							{t("iframeActions.shareOnNetwork")}
						</div>
					</button>{" "}
				</div>

				{/* Title and Description */}
				<div className="flex items-center justify-center gap-3 flex-1 px-4 min-w-0">
					{data?.logo_url && data?.logo_url?.startsWith("http") && (
						<img
							src={data.logo_url}
							alt={data.title || data.name}
							className="w-7 h-7 rounded-xl object-cover shrink-0"
						/>
					)}
					<div className="flex flex-col justify-center min-w-0 max-w-md">
						<h2 className="text-sm font-semibold tracking-tight truncate">
							{data.title || data.name || "Untitled"}
						</h2>
						{data.description && (
							<p className="text-[10px] text-neutral-400 truncate">
								{data.description}
							</p>
						)}
					</div>
				</div>

				<div className="flex gap-1.5">
					<motion.button
						className="flex items-center justify-center p-2 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 rounded-xl relative group cursor-pointer"
						onClick={handleOpenNewWindow}
					>
						<PictureInPicture className="w-4 h-4" />
						<div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-[10px] bg-black/90 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
							{t("iframe.openNewWindow")}
						</div>
					</motion.button>
					<motion.button
						className="flex items-center justify-center p-2 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 rounded-xl relative group cursor-pointer"
						onClick={
							isFullscreen ? handleExitFullscreen : handleEnterFullscreen
						}
					>
						<Maximize2 className="w-4 h-4" />
						<div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-[10px] bg-black/90 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
							{t("iframe.fullscreen")}
						</div>
					</motion.button>
					<motion.button
						className="flex items-center justify-center p-2 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 rounded-xl relative group cursor-pointer"
						onClick={handleReloadIframe2}
						title={t("iframe.reload")}
					>
						<RotateCcw className="w-4 h-4" />
						<div className="absolute z-50 bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-[10px] bg-black/90 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
							{t("iframe.reload")}
						</div>
					</motion.button>
					<motion.button
						className="flex items-center justify-center p-2 hover:bg-white hover:border-white/20 bg-white/90 border border-white/10 transition-all duration-200 rounded-xl relative group cursor-pointer shadow-lg hover:shadow-xl"
						onClick={handleStop}
						title={t("iframe.stop")}
					>
						<div className="absolute z-50 bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-[10px] bg-black/90 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
							{t("iframe.stop")}
						</div>
						<Square className="w-4 h-4 text-black" />
					</motion.button>
				</div>
			</motion.div>

			<motion.div
				id="iframe-container"
				key="iframe"
				exit={{ opacity: 0, scale: 0.95 }}
				transition={{ duration: 0.5 }}
				className={`w-full h-full rounded-xl border border-white/10 bg-black/50 backdrop-blur-sm overflow-hidden shadow-xl relative transition-all duration-500 ${isFullscreen ? "fullscreen-anim" : ""}`}
				style={{
					borderRadius: isFullscreen ? "0" : "6px",
					zIndex: isFullscreen ? 99999 : 1,
					transition:
						"box-shadow 0.5s, border-radius 0.5s, opacity 0.5s, transform 0.5s",
				}}
			>
				{isFullscreen && (
					<button
						className="absolute cursor-pointer top-10 left-10 z-50 flex items-center justify-center p-2 bg-neutral-800/80 hover:bg-neutral-800 border border-white/10 backdrop-blur-3xl rounded-xl"
						type="button"
						onClick={handleExitFullscreen}
						style={{ zIndex: 9999 }}
					>
						<X className="h-4 w-4" />
					</button>
				)}

				<div
					ref={containerRef}
					style={{ width: "100%", height: "100%", border: 0 }}
				/>

				<div className="absolute bottom-4 right-4 z-40 group">
					<button
						type="button"
						className="flex items-center justify-center w-10 h-10 bg-black/80 hover:bg-black/90 border border-white/20 hover:border-white/30 transition-all duration-200 rounded-xl shadow-lg backdrop-blur-sm"
					>
						<Activity className="w-4 h-4" />
					</button>
					<div className="absolute bottom-full right-0 mb-3 px-3 py-2.5 bg-black/90 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-xl pointer-events-none w-52 backdrop-blur-md border border-white/10">
						<div className="text-xs font-semibold mb-2.5">
							System Performance
						</div>
						<div className="space-y-2 text-[10px]">
							{systemUsage.cpu !== undefined && (
								<div className="flex justify-between items-center">
									<span className="text-neutral-400">CPU Usage:</span>
									<span className="font-semibold">
										{Math.round(systemUsage.cpu)}%
									</span>
								</div>
							)}
							{systemUsage.ram.percent !== undefined && (
								<div className="flex justify-between items-center">
									<span className="text-neutral-400">RAM Usage:</span>
									<span className="font-semibold">
										{systemUsage.ram.usedGB?.toFixed(1) || 0}GB (
										{Math.round(systemUsage.ram.percent)}%)
									</span>
								</div>
							)}
							{systemUsage.disk !== undefined && (
								<div className="flex justify-between items-center">
									<span className="text-neutral-400">Disk Usage:</span>
									<span className="font-semibold">
										{systemUsage.disk?.toFixed(1) || 0}%
									</span>
								</div>
							)}
							{currentPort && (
								<div className="flex justify-between items-center pt-1.5 mt-1.5 border-t border-white/10">
									<span className="text-neutral-400">Port:</span>
									<span className="font-semibold">{currentPort}</span>
								</div>
							)}
							{tunnelInfo && (
								<div className="flex justify-between items-center">
									<span className="text-neutral-400">Tunnel:</span>
									<span className="font-semibold text-green-400">Active</span>
								</div>
							)}
						</div>
					</div>
				</div>
			</motion.div>

			<NetworkShareModal
				isOpen={showNetworkShareModal}
				onClose={() => setShowNetworkShareModal(false)}
				targetPort={currentPort}
				tunnelInfo={tunnelInfo}
				setTunnelInfo={setTunnelInfo}
			/>
		</div>
	);
}
