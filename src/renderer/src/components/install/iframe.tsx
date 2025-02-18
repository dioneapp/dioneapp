import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface IframeProps {
	iframeSrc: string;
	handleStop: () => void;
	handleReloadIframe: () => void;
	currentPort: number;
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
				<span className="text-xs text-neutral-300 text-right w-8">
					{isHovered && absoluteValue
						? absoluteValue
						: `${Math.round(percentage)}%`}
				</span>
				{isHovered && absoluteValue && (
					<div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-1 py-0.5 bg-black/80 text-[10px] text-white rounded shadow">
						{absoluteValue}
					</div>
				)}
			</div>
		);
	};

	return (
		<div className="w-full h-full flex flex-col gap-2">
			<motion.div
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				className="w-full flex items-center justify-between gap-2 rounded-lg"
			>
				<div className="flex items-center">
					<div className="flex items-center border border-white/10 bg-white/5 rounded-md group overflow-hidden">
						<div className="flex items-center pl-2 pr-1.5 py-1 gap-2">
							<span className="text-sm text-neutral-300">
								{currentPort || "3000"}
							</span>
						</div>
						<button
							onClick={handleOpenInBrowser}
							className="p-1.5 hover:bg-white/10 border-l border-white/10 transition-colors rounded-r-md cursor-pointer relative group"
							title="Open in browser"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="w-4 h-4"
								viewBox="0 -960 960 960"
								fill="currentColor"
							>
								<path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z" />
							</svg>
							<div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-1 py-0.5 bg-black/80 text-[10px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
								Open in Browser
							</div>
						</button>
					</div>
				</div>

				<div className="flex gap-1.5 overflow-hidden">
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

				<div className="flex gap-1.5">
					<motion.button
						className="flex items-center justify-center p-1.5 hover:bg-white/10 border-l border-white/10 bg-white/5 transition-colors rounded-md border relative group cursor-pointer"
						onClick={handleStop}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="w-4 h-4"
							viewBox="0 -960 960 960"
							fill="currentColor"
						>
							<path d="M320-640v320-320Zm-80 400v-480h480v480H240Zm80-80h320v-320H320v320Z" />
						</svg>
					</motion.button>
					<motion.button
						className="flex items-center justify-center p-1.5 hover:bg-white/10 border-l border-white/10 bg-white/5 transition-colors rounded-md border relative group cursor-pointer"
						onClick={handleReloadIframe}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="w-4 h-4"
							viewBox="0 -960 960 960"
							fill="currentColor"
						>
							<path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" />
						</svg>
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
					id="iframe"
					src={iframeSrc}
					className="w-full h-full bg-neutral-900 hide-scrollbar"
					style={{ border: 0 }}
				/>
			</motion.div>
		</div>
	);
}
