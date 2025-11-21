import NetworkShareModal from "@/components/modals/network-share";
import { useTranslation } from "@/translations/translation-context";
import { motion } from "framer-motion";
import {
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

	const UsageIndicator = ({
		label,
		percentage,
		absoluteValue,
	}: {
		label: string;
		percentage: number;
		absoluteValue?: string;
	}) => {
		const [isHovered, setIsHovered] = useState(false);

		return (
			<div
				className="flex items-center gap-1.5 border border-white/10 bg-white/5 px-2 py-1.5 rounded-md shrink-0 relative"
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				<span className="text-xs text-neutral-300 font-medium">{label}</span>
				<div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
					<motion.div
						className="h-full bg-linear-to-r from-[#A395D9] to-[#C1B8E3]"
						style={{ width: `${percentage}%` }}
						animate={{
							scale: isHovered ? 1.05 : 1,
							filter: isHovered ? "brightness(1.3)" : "brightness(1)",
						}}
						transition={{
							duration: 0.8,
							ease: "easeInOut",
							width: { duration: 1.2, ease: "easeOut" },
						}}
					/>
				</div>
				<span className="text-xs text-neutral-300 text-right w-6">
					{isHovered && absoluteValue
						? absoluteValue
						: `${Math.round(percentage)}%`}
				</span>
			</div>
		);
	};

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
		<div className="w-full h-full flex flex-col gap-2 p-6">
			<motion.div
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				className="w-full flex items-center justify-between gap-2 rounded-md mt-6"
			>
				<div className="flex items-center gap-1">
					<button
						type="button"
						className="flex items-center justify-center p-1.5 h-full hover:bg-white/10 border border-white/10 transition-colors rounded-md relative group cursor-pointer"
						onClick={() => navigate("/")}
						title={t("iframeLabels.back")}
					>
						<ArrowLeft className="w-4 h-4 " />
						<div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-1 py-0.5 text-[10px] text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
							{t("iframe.back")}
						</div>
					</button>
					<button
						type="button"
						className="flex items-center justify-center p-1.5 h-full hover:bg-white/10 border border-white/10 transition-colors rounded-md relative group cursor-pointer"
						onClick={() => setShow({ [data.id]: "logs" })}
						title={t("iframeLabels.logs")}
					>
						<SquareTerminal className="w-4 h-4 " />
						<div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-1 py-0.5 text-[10px] text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
							{t("iframe.logs")}
						</div>
					</button>
					<button
						type="button"
						onClick={handleOpenEditor}
						className="p-1.5 hover:bg-white/10 border border-white/10 transition-colors rounded-md cursor-pointer relative group"
						title={t("iframe.openFolder")}
					>
						<Folder className="w-4 h-4" />
						<div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-1 py-0.5 text-[10px] text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
							{t("iframe.openFolder")}
						</div>
					</button>
					<button
						type="button"
						onClick={() => setShowNetworkShareModal(true)}
						className="flex items-center justify-center p-1.5 h-full hover:bg-white/10 border border-white/10 transition-colors rounded-md relative group cursor-pointer"
						title={t("iframeActions.shareOnNetwork")}
					>
						<Share2 className="w-4 h-4" />
						{tunnelInfo && (
							<div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-neutral-900 animate-pulse" />
						)}
						<div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-1 py-0.5 text-[10px] text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
							{t("iframeActions.shareOnNetwork")}
						</div>
					</button>{" "}
				</div>

				<div className="flex gap-1 justify-start items-center flex-1">
					{systemUsage.cpu !== undefined && (
						<UsageIndicator label="CPU" percentage={systemUsage.cpu} />
					)}
					{systemUsage.ram.percent !== undefined && (
						<UsageIndicator
							label="RAM"
							percentage={systemUsage.ram.percent}
							absoluteValue={`${systemUsage.ram.usedGB?.toFixed(1) || 0}G`}
						/>
					)}
					{systemUsage.disk !== undefined && (
						<UsageIndicator
							label={t("iframeLabels.disk")}
							percentage={systemUsage.disk}
							absoluteValue={`${systemUsage.disk?.toFixed(1) || 0}G`}
						/>
					)}
				</div>

				<div className="flex gap-1">
					<motion.button
						className="flex items-center justify-center p-1.5 h-full hover:bg-white/10 border border-white/10 transition-colors rounded-md relative group cursor-pointer"
						onClick={handleOpenNewWindow}
					>
						<PictureInPicture className="w-4 h-4" />
						<div className="absolute bottom-full left-1/2 -translate-x-1/2 px-1 py-0.5 text-[10px] text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
							{t("iframe.openNewWindow")}
						</div>
					</motion.button>
					<motion.button
						className="flex items-center justify-center p-1.5 h-full hover:bg-white/10 border border-white/10 transition-colors rounded-md relative group cursor-pointer"
						onClick={
							isFullscreen ? handleExitFullscreen : handleEnterFullscreen
						}
					>
						<Maximize2 className="w-4 h-4" />
						<div className="absolute bottom-full left-1/2 -translate-x-1/2 px-1 py-0.5 text-[10px] text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
							{t("iframe.fullscreen")}
						</div>
					</motion.button>
					<motion.button
						className="flex items-center justify-center p-1.5 h-full hover:bg-white/10 border border-white/10 transition-colors rounded-md relative group cursor-pointer"
						onClick={handleReloadIframe2}
						title={t("iframe.reload")}
					>
						<RotateCcw className="w-4 h-4" />
						<div className="absolute z-50 -top-5 left-1/2 -translate-x-1/2 px-1 py-0.5 text-[10px] text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
							{t("iframe.reload")}
						</div>
					</motion.button>
					<motion.button
						className="flex items-center justify-center p-1.5 h-full hover:bg-white/80 bg-white transition-colors rounded-md relative group cursor-pointer"
						onClick={handleStop}
						title={t("iframe.stop")}
					>
						<div className="absolute z-50 -top-5 left-1/2 -translate-x-1/2 px-1 py-0.5 text-[10px] text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
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
				className={`w-full h-full rounded-md border border-white/10 bg-black/50 backdrop-blur-sm overflow-hidden shadow-xl relative transition-all duration-500 ${isFullscreen ? "fullscreen-anim" : ""}`}
				style={{
					borderRadius: isFullscreen ? "0" : "6px",
					zIndex: isFullscreen ? 99999 : 1,
					transition:
						"box-shadow 0.5s, border-radius 0.5s, opacity 0.5s, transform 0.5s",
				}}
			>
				{isFullscreen && (
					<button
						className="absolute cursor-pointer top-10 left-10 z-50 flex items-center justify-center p-2 bg-neutral-800/80 hover:bg-neutral-800 border border-white/10 backdrop-blur-3xl rounded-full"
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
