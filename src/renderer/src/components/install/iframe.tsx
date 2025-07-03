import { getCurrentPort } from "@renderer/utils/getPort";
import { motion } from "framer-motion";
import {
	ArrowLeft,
	ExternalLink,
	SquareTerminal,
	Folder,
	Maximize2,
	RotateCcw,
	Square,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../translations/translationContext";

interface IframeProps {
	iframeSrc: string;
	handleStop: () => void;
	handleReloadIframe: () => void;
	currentPort: number;
	setShow: React.Dispatch<React.SetStateAction<Record<string, string>>>;
	data: any;
}

// interface SystemUsage {
// 	cpu: number;
// 	ram: { percent: number; usedGB: number };
// 	gpu: { percent: number; vramGB: number };
// 	disk: { percent: number; usedGB: number };
// }

export default function IframeComponent({
	iframeSrc,
	handleStop,
	handleReloadIframe,
	currentPort,
	setShow,
	data,
}: IframeProps) {
	const navigate = useNavigate();
	const { t } = useTranslation();
	// const [systemUsage, setSystemUsage] = useState<SystemUsage>({
	// 	cpu: 0,
	// 	ram: { percent: 0, usedGB: 0 },
	// 	gpu: { percent: 0, vramGB: 0 },
	// 	disk: { percent: 0, usedGB: 0 },
	// });
	const [isFullscreen, setIsFullscreen] = useState(false);

	// useEffect(() => {
	// 	const interval = setInterval(() => {
	// 		setSystemUsage({
	// 			cpu: Math.random() * 100,
	// 			ram: {
	// 				percent: Math.random() * 100,
	// 				usedGB: Math.random() * 16,
	// 			},
	// 			gpu: {
	// 				percent: Math.random() * 100,
	// 				vramGB: Math.random() * 12,
	// 			},
	// 			disk: {
	// 				percent: Math.random() * 100,
	// 				usedGB: Math.random() * 1000,
	// 			},
	// 		});
	// 	}, 1000);

	// 	return () => clearInterval(interval);
	// }, []);

	const handleOpenInBrowser = () => {
		window.open(`http://localhost:${currentPort || "3000"}`, "_blank");
	};

	const handleEnterFullscreen = () => {
		const container = document.getElementById(
			"iframe-container",
		) as HTMLElement;
		if (container && !document.fullscreenElement) {
			container.requestFullscreen().catch((err) => {
				console.error(`Error attempting to enable fullscreen: ${err.message}`);
			});
		}
	};

	const handleExitFullscreen = () => {
		if (document.fullscreenElement) {
			document.exitFullscreen();
		}
	};

	const handleOpenFolder = async () => {
		const port = await getCurrentPort();
		const settings = await fetch(`http://localhost:${port}/config`).then(
			(res) => res.json(),
		);
		const sanitizedName = data.name.replace(/\s+/g, "-");
		window.electron.ipcRenderer.invoke(
			"open-dir",
			`${settings.defaultInstallFolder}/apps/${sanitizedName}`,
		);
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

	// const UsageIndicator = ({
	// 	label,
	// 	percentage,
	// 	absoluteValue,
	// }: {
	// 	label: string;
	// 	percentage: number;
	// 	absoluteValue?: string;
	// }) => {
	// 	const [isHovered, setIsHovered] = useState(false);

	// 	return (
	// 		<div
	// 			className="flex items-center gap-1.5 border border-white/10 bg-white/5 px-2 py-1.5 rounded-md cursor-pointer flex-shrink-0 relative"
	// 			onMouseEnter={() => setIsHovered(true)}
	// 			onMouseLeave={() => setIsHovered(false)}
	// 		>
	// 			<span className="text-xs text-neutral-300 font-medium">{label}</span>
	// 			<div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
	// 				<motion.div
	// 					className="h-full bg-gradient-to-r from-[#A395D9] to-[#C1B8E3] shadow-lg"
	// 					style={{ width: `${percentage}%` }}
	// 					animate={{
	// 						scale: isHovered ? 1.05 : 1,
	// 						filter: isHovered ? "brightness(1.3)" : "brightness(1)",
	// 					}}
	// 					transition={{ duration: 0.3 }}
	// 				/>
	// 			</div>
	// 			<span className="text-xs text-neutral-300 text-right w-6">
	// 				{isHovered && absoluteValue
	// 					? absoluteValue
	// 					: `${Math.round(percentage)}%`}
	// 			</span>
	// 		</div>
	// 	);
	// };

	return (
		<div className="w-full h-full flex flex-col gap-2 p-6">
			<motion.div
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				className="w-full flex items-center justify-between gap-2 rounded-lg mt-6	"
			>
				<div className="flex items-center gap-1">
					<button
						type="button"
						className="flex items-center justify-center p-1.5 h-full hover:bg-white/10 border border-white/10 transition-colors rounded-md relative group cursor-pointer"
						onClick={() => navigate("/")}
					>
						<ArrowLeft className="w-4 h-4 " />
						<div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-1 py-0.5 text-[10px] text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
							{t("iframe.back")}
						</div>
					</button>
					<button
						type="button"
						className="flex items-center justify-center p-1.5 h-full hover:bg-white/10 border border-white/10 transition-colors rounded-md relative group cursor-pointer"
						onClick={() => setShow({ [data.id]: "logs" })}
					>
						<SquareTerminal className="w-4 h-4 " />
						<div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-1 py-0.5 text-[10px] text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
							{t("iframe.logs")}
						</div>
					</button>
					<button
						type="button"
						onClick={handleOpenFolder}
						className="p-1.5 hover:bg-white/10 border border-white/10 transition-colors rounded-md cursor-pointer relative group"
						title={t("iframe.openFolder")}
					>
						<Folder className="w-4 h-4" />
						<div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-1 py-0.5 text-[10px] text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
							{t("iframe.openFolder")}
						</div>
					</button>
					<div className="flex items-center border border-white/10 bg-white/5 rounded-md relative">
						<div className="flex items-center pl-2 pr-1.5 py-1 gap-2">
							<span className="text-sm text-neutral-300">
								{currentPort || "3000"}
							</span>
						</div>
						<button
							type="button"
							onClick={handleOpenInBrowser}
							className="p-1.5 hover:bg-white/10 border-l border-white/10 transition-colors rounded-r-md cursor-pointer group relative"
							title={t("iframe.openInBrowser")}
						>
							<ExternalLink className="w-4 h-4" />
							<div className="absolute z-50 -top-9 left-1/2 -translate-x-1/2 px-1 py-0.5 text-[10px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
								{t("iframe.openInBrowser")}
							</div>
						</button>
					</div>
				</div>

				<div className="flex gap-1 justify-center items-center flex-1">
					{/* WIP */}
					{/* <UsageIndicator label="CPU" percentage={systemUsage.cpu} />
					<UsageIndicator
						label="RAM"
						percentage={systemUsage.ram.percent}
						absoluteValue={`${systemUsage.ram.usedGB.toFixed(1)}G`}
					/>
					<UsageIndicator
						label="GPU"
						percentage={systemUsage.gpu.percent}
						absoluteValue={`${systemUsage.gpu.vramGB.toFixed(1)}G`}
					/>
					<UsageIndicator
						label="DISK"
						percentage={systemUsage.disk.percent}
						absoluteValue={`${systemUsage.disk.usedGB.toFixed(1)}G`}
					/> */}
				</div>

				<div className="flex gap-1">
					<motion.button
						className="flex items-center justify-center p-1.5 h-full hover:bg-white/10 border border-white/10 transition-colors rounded-md relative group cursor-pointer"
						onClick={
							isFullscreen ? handleExitFullscreen : handleEnterFullscreen
						}
					>
						<Maximize2 className="w-4 h-4" />
						<div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-1 py-0.5 text-[10px] text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
							{t("iframe.fullscreen")}
						</div>
					</motion.button>
					<motion.button
						className="flex items-center justify-center p-1.5 h-full hover:bg-white/80 bg-white transition-colors rounded-md relative group cursor-pointer"
						onClick={handleStop}
						title={t("iframe.stop")}
					>
						<Square className="w-4 h-4 text-black" />
					</motion.button>
					<motion.button
						className="flex items-center justify-center p-1.5 h-full hover:bg-white/80 bg-white transition-colors rounded-md relative group cursor-pointer"
						onClick={handleReloadIframe}
						title={t("iframe.reload")}
					>
						<RotateCcw className="w-4 h-4 text-black" />
					</motion.button>
				</div>
			</motion.div>

			<motion.div
				id="iframe-container"
				key="iframe"
				animate={{
					opacity: 1,
					scale: isFullscreen ? 1.05 : 1,
					boxShadow: isFullscreen
						? "0 0 40px 10px rgba(163,149,217,0.2)"
						: "0 0 20px 2px rgba(0,0,0,0.2)",
				}}
				exit={{ opacity: 0, scale: 0.95 }}
				transition={{ duration: 0.5 }}
				className={`w-full h-full rounded-lg border border-white/10 bg-black/50 backdrop-blur-sm overflow-hidden shadow-xl relative transition-all duration-500 ${isFullscreen ? "fullscreen-anim" : ""}`}
				style={{
					borderRadius: isFullscreen ? "0" : "6px",
					transition:
						"box-shadow 0.5s, border-radius 0.5s, opacity 0.5s, transform 0.5s",
				}}
			>
				{isFullscreen && (
					<button
						className="absolute cursor-pointer top-6 left-6 z-50 flex items-center justify-center p-2 bg-white/10 hover:bg-white/20 rounded-full"
						type="button"
						onClick={handleExitFullscreen}
					>
						<X className="h-3 w-3" />
					</button>
				)}

				<iframe
					title="Script screen"
					id="iframe"
					src={iframeSrc}
					className="w-full h-full bg-neutral-900 z-50"
					style={{ border: 0, overflow: "hidden" }}
					sandbox="allow-scripts allow-same-origin allow-forms"
				/>
			</motion.div>
		</div>
	);
}
