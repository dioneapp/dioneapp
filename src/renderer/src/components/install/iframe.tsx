import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Icon from "../icons/icon";

interface IframeProps {
	iframeSrc: string;
	handleStop: () => void;
	handleReloadIframe: () => void;
	currentPort: number;
	setShow: React.Dispatch<React.SetStateAction<string>>;
}

interface SystemUsage {
	cpu: number;
	ram: { percent: number; usedGB: number };
	gpu: { percent: number; vramGB: number };
	disk: { percent: number; usedGB: number };
}

export default function IframeComponent({
	iframeSrc,
	handleStop,
	handleReloadIframe,
	currentPort,
	setShow,
}: IframeProps) {
	const [systemUsage, setSystemUsage] = useState<SystemUsage>({
		cpu: 0,
		ram: { percent: 0, usedGB: 0 },
		gpu: { percent: 0, vramGB: 0 },
		disk: { percent: 0, usedGB: 0 },
	});

	useEffect(() => {
		const interval = setInterval(() => {
			setSystemUsage({
				cpu: Math.random() * 100,
				ram: {
					percent: Math.random() * 100,
					usedGB: Math.random() * 16,
				},
				gpu: {
					percent: Math.random() * 100,
					vramGB: Math.random() * 12,
				},
				disk: {
					percent: Math.random() * 100,
					usedGB: Math.random() * 1000,
				},
			});
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	const handleOpenInBrowser = () => {
		window.open(`http://localhost:${currentPort || "3000"}`, "_blank");
	};

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
				className="flex items-center gap-1.5 border border-white/10 bg-white/5 px-2 py-1.5 rounded-md cursor-pointer flex-shrink-0 relative"
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				<span className="text-xs text-neutral-300 font-medium">{label}</span>
				<div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
					<motion.div
						className="h-full bg-gradient-to-r from-[#A395D9] to-[#C1B8E3] shadow-lg"
						style={{ width: `${percentage}%` }}
						animate={{
							scale: isHovered ? 1.05 : 1,
							filter: isHovered ? "brightness(1.3)" : "brightness(1)",
						}}
						transition={{ duration: 0.3 }}
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

	return (
		<div className="w-full h-full flex flex-col gap-2">
			<motion.div
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				className="w-full flex items-center justify-between gap-2 rounded-lg mt-6	"
			>
				<div className="flex items-center">
					<div className="flex items-center border border-white/10 bg-white/5 rounded-md group overflow-hidden">
						<div className="flex items-center pl-2 pr-1.5 py-1 gap-2">
							<span className="text-sm text-neutral-300">
								{currentPort || "3000"}
							</span>
						</div>
						<button
							type="button"
							onClick={handleOpenInBrowser}
							className="p-1.5 hover:bg-white/10 border-l border-white/10 transition-colors rounded-r-md cursor-pointer relative group"
							title="Open in browser"
						>
							<Icon name="Open" className="w-4 h-4" />
							<div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-1 py-0.5 bg-black/80 text-[10px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
								Open in Browser
							</div>
						</button>
					</div>
				</div>

				<div className="flex gap-1 justify-center items-center flex-1">
					<UsageIndicator label="CPU" percentage={systemUsage.cpu} />
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
					/>
				</div>

				<div className="flex gap-1.5 w-fit h-full items-center justify-end">
					<motion.button
						className="flex items-center justify-center w-8 h-full hover:bg-white/10 border border-white/10 transition-colors rounded-md relative group cursor-pointer"
						onClick={() => setShow("logs")}
					>
						<Icon name="Back" className="w-4 h-4 " />
					</motion.button>
					<motion.button
						className="flex items-center justify-center w-8 h-full hover:bg-white/80 bg-white transition-colors rounded-md relative group cursor-pointer"
						onClick={handleStop}
					>
						<Icon name="Stop" className="w-4 h-4 " />
					</motion.button>
					<motion.button
						className="flex items-center justify-center w-8 h-full hover:bg-white/80 bg-white transition-colors rounded-md relative group cursor-pointer"
						onClick={handleReloadIframe}
					>
						<Icon name="Reload" className="w-4 h-4" />
					</motion.button>
				</div>
			</motion.div>

			<motion.div
				key="iframe"
				initial={{ opacity: 0, scale: 0.98 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.25 }}
				className="w-full h-full rounded-lg border border-white/10 bg-black/50 backdrop-blur-sm overflow-hidden shadow-xl"
			>
				<iframe
					title="Script screen"
					id="iframe"
					src={iframeSrc}
					className="w-full h-full bg-neutral-900"
					style={{ border: 0, overflow: "hidden" }}
					sandbox="allow-scripts allow-same-origin allow-forms "
				/>
			</motion.div>
		</div>
	);
}
