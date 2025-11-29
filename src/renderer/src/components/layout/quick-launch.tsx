import { useScriptsContext } from "@/components/contexts/ScriptsContext";
import GeneratedIcon from "@/components/icons/generated-icon";
import { useTranslation } from "@/translations/translation-context";
import { useCustomDrag } from "@/utils/quick-launch/use-custom-drag";
import { AnimatePresence, type Variants, motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function QuickLaunch({
	compactMode,
}: { compactMode?: boolean }) {
	const { t } = useTranslation();
	const {
		apps,
		setApps,
		handleReloadQuickLaunch,
		setRemovedApps,
		availableApps,
		removedApps,
	} = useScriptsContext();

	const [showAppList, setShowAppList] = useState<boolean>(false);
	const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
	const [blockedTooltipIndex, setBlockedTooltipIndex] = useState<number | null>(
		null,
	);
	const dragGhostRef = useRef<HTMLDivElement>(null);
	const maxApps = 6;

	// custom drag and drop
	const {
		dragState,
		containerRef,
		handlePointerDown,
		applyStoredPositions,
		savePositions,
	} = useCustomDrag({ apps, setApps, maxApps });

	const backdropVariants: Variants = {
		hidden: { opacity: 0 },
		visible: { opacity: 1 },
	};

	const modalVariants: Variants = {
		hidden: { scale: 0.9, opacity: 0 },
		visible: {
			scale: 1,
			opacity: 1,
			transition: { type: "spring", stiffness: 300, damping: 20 },
		},
		exit: { scale: 0.95, opacity: 0 },
	};

	const appItemVariants = {
		hidden: { opacity: 0, y: 10 },
		visible: (i: number) => ({
			opacity: 1,
			y: 0,
			transition: { delay: i * 0.05 },
		}),
	};

	// apply stored positions on initial load
	useEffect(() => {
		if (apps && apps.length > 0) {
			const orderedApps = applyStoredPositions(apps);
			if (JSON.stringify(orderedApps) !== JSON.stringify(apps)) {
				setApps(orderedApps);
			}
		}
	}, [apps.length]);

	useEffect(() => {
		handleReloadQuickLaunch();
	}, [removedApps]);

	async function showAppSelector(index: number) {
		try {
			setSelectedSlot(index);
			setShowAppList(true);
		} catch (error) {
			console.error("Error fetching apps:", error);
		}
	}

	function addToSlot(app: any) {
		if (selectedSlot === null) return;

		if (apps.some((existingApp) => existingApp?.id === app.id)) {
			return;
		}

		const newApps = [...apps];
		newApps[selectedSlot] = app;
		setApps(newApps);
		savePositions(newApps); // save to localStorage
		setShowAppList(false);
		setSelectedSlot(null);
		setRemovedApps((prevRemoved) =>
			prevRemoved.filter((removedApp) => removedApp.id !== app.id),
		);
	}

	const removeApp = (index: number) => {
		const newApps = [...apps];
		const removedApp = newApps[index];
		newApps[index] = null;
		setApps(newApps);
		savePositions(newApps); // save to localStorage
		setRemovedApps((prevApps) => [...prevApps, removedApp]);
	};

	const renderAppButton = (app: any, index: number) => {
		const isBeingDragged =
			dragState.isDragging && dragState.draggedFromIndex === index;
		const isHovered = dragState.hoveredSlot === index && dragState.isDragging;

		return (
			<div
				key={`slot-${index}`}
				className="flex flex-col items-center gap-1"
				data-slot-index={index}
			>
				<motion.div
					className={`
					border border-white/10 hover:border-white/20 transition-all duration-200 rounded-xl 
					flex items-center justify-center overflow-hidden cursor-pointer
					${compactMode ? "h-12 w-12" : "h-18 w-18"}
					${isBeingDragged ? "opacity-30 scale-95" : ""}
					`}
					style={{
						...(isHovered && {
							boxShadow: `0 0 20px color-mix(in srgb, var(--theme-accent) 25%, transparent), 0 0 0 2px var(--theme-accent)`,
						}),
					}}
					onMouseDown={(e) => handlePointerDown(e, app, index)}
					onTouchStart={(e) => handlePointerDown(e, app, index)}
					onContextMenu={(e) => {
						e.preventDefault();
						removeApp(index);
					}}
					animate={{
						scale: isHovered ? 1.05 : 1,
						rotate: isBeingDragged ? 5 : 0,
					}}
					transition={{ duration: 0.2 }}
				>
					<Link
						draggable={false}
						to={{
							pathname: `/install/${app.isLocal ? app.name : app.id}`,
							search: `?isLocal=${app.isLocal}`,
						}}
						className={`h-full w-full flex items-center justify-center ${
							dragState.isDragging
								? "pointer-events-none"
								: "pointer-events-auto"
						}`}
					>
						{app.logo_url?.startsWith("http") ? (
							<img
								src={app.logo_url}
								alt={app.name}
								className="h-full w-full object-cover bg-neutral-800/50 backdrop-blur-sm"
							/>
						) : (
							<GeneratedIcon
								name={app.name}
								className="h-full w-full"
								roundedClassName="rounded-xl"
							/>
						)}
					</Link>
				</motion.div>
				{!compactMode && (
					<div className="max-w-18 overflow-hidden flex justify-center items-center">
						<p className="text-[12px] text-neutral-300 truncate w-full">
							{app.name}
						</p>
					</div>
				)}
			</div>
		);
	};

	const renderEmptyButton = (index: number) => {
		const isHovered = dragState.hoveredSlot === index && dragState.isDragging;
		const appsInQuickLaunch = apps.filter(Boolean).map((app) => app.id);
		const availableToAdd = availableApps.filter(
			(app) => !appsInQuickLaunch.includes(app.id),
		);
		const clickIsDisabled = availableToAdd.length === 0;
		return (
			<div
				className="flex flex-col items-center gap-1 relative"
				data-slot-index={index}
			>
				<motion.button
					type="button"
					onClick={() => {
						if (clickIsDisabled) {
							setBlockedTooltipIndex(index);
							setTimeout(() => {
								setBlockedTooltipIndex((current) =>
									current === index ? null : current,
								);
							}, 1500);
							return;
						}
						showAppSelector(index);
					}}
					className={`
            h-18 w-18 border border-white/10 rounded-xl flex items-center justify-center transition-all duration-300
            ${clickIsDisabled && !isHovered && "opacity-50 cursor-not-allowed"}
			${clickIsDisabled && isHovered && "cursor-grabbing"}
			${!clickIsDisabled && !isHovered && "cursor-pointer"}
          `}
					style={{
						...(isHovered && {
							borderColor: 'var(--theme-accent)',
							backgroundColor: 'color-mix(in srgb, var(--theme-accent) 20%, transparent)',
							boxShadow: `0 10px 30px color-mix(in srgb, var(--theme-accent) 25%, transparent)`,
						}),
					}}
					tabIndex={clickIsDisabled ? -1 : 0}
					aria-disabled={clickIsDisabled}
					animate={{
						scale: isHovered ? 1.1 : 1,
					}}
					transition={{ duration: 0.2 }}
				>
					<Plus
						className="h-10 w-10 transition-colors"
						style={isHovered ? { color: 'var(--theme-accent)' } : {}}
					/>
				</motion.button>
				<AnimatePresence>
					{clickIsDisabled && blockedTooltipIndex === index && (
						<motion.div
							initial={{ opacity: 0, y: 6 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 6 }}
							className="absolute -top-9 z-10"
						>
							<div className="bg-black/80 backdrop-blur-sm border border-white/20 rounded-md px-2 py-1">
								<p className="text-white text-xs whitespace-nowrap">
									{t("quickLaunch.tooltips.noMoreApps")}
								</p>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
				<div className="max-w-18 overflow-hidden flex justify-center items-center">
					<p className="text-[12px] text-neutral-400 truncate w-full">
						{t("quickLaunch.addApp")}
					</p>
				</div>
			</div>
		);
	};

	return (
		<div
			className={compactMode ? "mb-auto" : "flex mt-auto w-full h-64 max-w-64"}
		>
			<div className="w-full" ref={containerRef}>
				{!compactMode && (
					<h2 className="font-semibold">{t("quickLaunch.title")}</h2>
				)}
				<div
					className={
						compactMode
							? "flex flex-col justify-center my-4 gap-2"
							: "grid grid-cols-3 my-4 gap-2"
					}
				>
					{!compactMode &&
						Array(maxApps)
							.fill(null)
							.map((_, index) => (
								<div key={`slot-${index}`}>
									{apps[index]
										? renderAppButton(apps[index], index)
										: renderEmptyButton(index)}
								</div>
							))}
					{compactMode &&
						Array(maxApps)
							.fill(null)
							.map((_, index) => (
								<div key={`slot-${index}`}>
									{apps[index] && renderAppButton(apps[index], index)}
								</div>
							))}
				</div>
			</div>
			<AnimatePresence>
				{dragState.isDragging && dragState.draggedApp && (
					<motion.div
						ref={dragGhostRef}
						className="fixed pointer-events-none z-50"
						style={{
							left: dragState.mousePosition.x - dragState.dragOffset.x,
							top: dragState.mousePosition.y - dragState.dragOffset.y,
						}}
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 0.9 }}
						exit={{ scale: 0.8, opacity: 0 }}
					>
					<div
						className="rounded-xl flex items-center justify-center overflow-hidden backdrop-blur-sm"
						style={{
							border: '2px solid var(--theme-accent)',
							boxShadow: '0 25px 50px color-mix(in srgb, var(--theme-accent) 50%, transparent)',
							...(compactMode ? {width: '3rem', height: '3rem'} : {width: '4.5rem', height: '4.5rem'}),
						}}
					>
							{dragState.draggedApp.logo_url?.startsWith("http") ? (
								<img
									src={dragState.draggedApp.logo_url}
									alt={dragState.draggedApp.name}
									className="h-full w-full object-cover"
								/>
							) : (
								!dragState.draggedApp.isLocal && (
									<div
										className="h-full w-full object-cover"
										style={{ backgroundImage: dragState.draggedApp.logo_url }}
									/>
								)
							)}
							{dragState.draggedApp.isLocal && (
								<GeneratedIcon
									name={dragState.draggedApp.name}
									className="h-full w-full"
									roundedClassName="rounded-xl"
								/>
							)}
						</div>
						<div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
							<div className="bg-black/80 backdrop-blur-sm border border-white/20 rounded-md px-2 py-1">
								<p className="text-white text-xs">
									{dragState.draggedApp.name}
								</p>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
			<AnimatePresence>
				{showAppList && (
					<motion.div
						className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center"
						onClick={() => setShowAppList(false)}
						variants={backdropVariants}
						initial="hidden"
						animate="visible"
						exit="hidden"
					>
						<motion.div
							className="p-6 rounded-xl border border-white/10 shadow-lg relative overflow-hidden max-w-xl w-full backdrop-blur-md"
							onClick={(e) => e.stopPropagation()}
							variants={modalVariants}
							initial="hidden"
							animate="visible"
							exit="exit"
						>
							<div className="absolute top-0 left-0.5/4 w-32 h-32 rounded-full -translate-y-1/2 blur-3xl z-10" style={{ backgroundColor: 'var(--theme-blur)' }} />
							<div className="relative z-10">
								<div className="flex justify-between items-center mb-2">
									<div className="flex-col gap-2 items-center">
										<h3 className="text-lg font-semibold">
											{t("quickLaunch.selectApp.title")}
										</h3>
										<p className="text-xs text-neutral-400">
											{t("quickLaunch.selectApp.description")
												.replace("{count}", availableApps.length.toString())
												.replace("{max}", maxApps.toString())}
										</p>
									</div>
									<button
										className="cursor-pointer z-50 flex items-center justify-center p-2 bg-white/10 hover:bg-white/20 rounded-full"
										type="button"
										onClick={() => setShowAppList(false)}
									>
										<X className="h-3 w-3" />
									</button>
								</div>
								<div className="grid grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto mt-4">
									{availableApps?.map((app) => (
										<motion.div
											key={app.id}
											custom={app.id}
											variants={appItemVariants}
											initial="hidden"
											animate="visible"
										>
											<button
												type="button"
												onClick={() => addToSlot(app)}
												className="flex flex-col items-center p-3 rounded-xl transition-colors w-full cursor-pointer"
											>
												<motion.div
													className={`h-16 w-16 mb-2 border border-white/10 hover:border-white/20 transition-all duration-200 rounded-xl flex items-center justify-center overflow-hidden`}
													whileHover={{ scale: 1.05 }}
													whileTap={{ scale: 0.95 }}
												>
													{app?.logo_url?.startsWith("http") ? (
														<img
															src={app.logo_url}
															alt={app.name}
															className="h-full w-full object-cover"
														/>
													) : !app.isLocal ? (
														<div
															style={{
																backgroundImage: app.logo_url,
															}}
															className="h-full w-full object-cover"
														/>
													) : (
														<GeneratedIcon
															name={app.name}
															className="h-full w-full"
															roundedClassName="rounded-xl"
														/>
													)}
												</motion.div>
												{app.name ? (
													<span className="text-xs text-neutral-400">
														{app.name}
													</span>
												) : (
													<div className="text-xs bg-white/10 animate-pulse w-16 h-2 rounded-xl" />
												)}
											</button>
										</motion.div>
									))}
								</div>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
