import GeneratedIcon from "@/components/icons/generated-icon";
import { useTranslation } from "@/translations/translation-context";
import { useCustomDrag } from "@/utils/quick-launch/use-custom-drag";
import { AnimatePresence, type Variants, motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useScriptsContext } from "@/components/contexts/scripts-context";

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
	const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
	const maxApps = 6;

	const { applyStoredPositions, savePositions } = useCustomDrag({
		apps,
		setApps,
		maxApps,
	});

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

	const positionsAppliedRef = useRef(false);
	useEffect(() => {
		if (positionsAppliedRef.current) return;
		if (apps && apps.length > 0) {
			const orderedApps = applyStoredPositions(apps);
			if (JSON.stringify(orderedApps) !== JSON.stringify(apps)) {
				setApps(orderedApps);
			}
			positionsAppliedRef.current = true;
		}
	}, [apps]);

	useEffect(() => {
		handleReloadQuickLaunch();
	}, [removedApps]);

	async function showAppSelector(index: number) {
		try {
			try {
				await handleReloadQuickLaunch();
			} catch (e) {
				console.error("Error reloading quick launch apps:", e);
			}
			setSelectedSlot(index);
			setSelectedSlotId(`slot-${index}`);
			setShowAppList(true);
		} catch (error) {
			console.error("Error fetching apps:", error);
		}
	}

	function addToSlot(app: any) {
		const targetIndex = selectedSlotId
			? Number.parseInt(selectedSlotId.replace("slot-", ""), 10)
			: selectedSlot;
		if (targetIndex === null || targetIndex === undefined) return;

		if (apps.some((existingApp) => existingApp?.id === app.id)) {
			return;
		}

		const newApps = [...apps];
		newApps[targetIndex] = app;
		setApps(newApps);
		savePositions(newApps); // save to localStorage
		setShowAppList(false);
		setSelectedSlot(null);
		setSelectedSlotId(null);
		setRemovedApps((prevRemoved) =>
			prevRemoved.filter((removedApp) => (removedApp?.id ?? null) !== app.id),
		);
	}

	const removeApp = (index: number) => {
		const newApps = [...apps];
		const removedApp = newApps[index];
		newApps[index] = null;
		setApps(newApps);
		savePositions(newApps); // save to localStorage
		if (removedApp) {
			setRemovedApps((prevApps) => [...prevApps, removedApp]);
		}
	};

	const SortableSlot = ({ index }: { index: number }) => {
		const app = apps[index];
		const appsInQuickLaunch = apps
			.map((a) => a?.id)
			.filter(Boolean) as string[];
		const availableToAdd = availableApps.filter(
			(a) => !appsInQuickLaunch.includes(a.id),
		);

		// Only allow adding to the next sequential slot: all previous slots must be filled
		// and the current slot must be empty. This handles sparse arrays and missing entries.
		const previousFilled =
			index === 0
				? true
				: Array.from({ length: index }).every((_, i) => Boolean(apps[i]));
		const isSlotAllowed = !app && previousFilled;
		const clickIsDisabled = availableToAdd.length === 0 || !isSlotAllowed;

		return (
			<div data-slot-index={index} className="flex flex-col items-center gap-1">
				<div
					className={`
						border border-white/10 transition-all duration-200 rounded-xl 
						flex items-center justify-center overflow-hidden cursor-pointer
						${compactMode ? "h-12 w-12" : "h-18 w-18"}
					`}
					onContextMenu={(e) => {
						e.preventDefault();
						removeApp(index);
					}}
				>
					{app ? (
						<Link
							draggable={false}
							to={{
								pathname: `/install/${app.isLocal ? app.name : app.id}`,
								search: `?isLocal=${app.isLocal}`,
							}}
							className={`h-full w-full flex items-center justify-center`}
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
					) : (
						<button
							type="button"
							onClick={() => !clickIsDisabled && showAppSelector(index)}
							className={`h-full w-full flex items-center justify-center ${clickIsDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
							aria-disabled={clickIsDisabled}
						>
							<Plus className="h-10 w-10 text-neutral-300" />
						</button>
					)}
				</div>
				{!compactMode && (
					<div className="max-w-18 overflow-hidden flex justify-center items-center">
						{app ? (
							<p className="text-[12px] text-neutral-300 truncate w-full">
								{app.name}
							</p>
						) : (
							<p className="text-[12px] text-neutral-400 truncate w-full">
								{t("quickLaunch.addApp")}
							</p>
						)}
					</div>
				)}
			</div>
		);
	};

	return (
		<div
			className={compactMode ? "mb-auto" : "flex mt-auto w-full h-64 max-w-64"}
		>
			<div className="w-full">
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
					{Array.from({ length: maxApps }, (_, index) => (
						<div key={`slot-${index}`} className="w-full flex justify-center">
							<SortableSlot index={index} />
						</div>
					))}
				</div>
			</div>

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
							<div
								className="absolute top-0 left-0.5/4 w-32 h-32 rounded-xl -translate-y-1/2 blur-3xl z-10"
								style={{ backgroundColor: "var(--theme-blur)" }}
							/>
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
										className="cursor-pointer z-50 flex items-center justify-center p-2 bg-white/10 hover:bg-white/20 rounded-xl"
										type="button"
										onClick={() => setShowAppList(false)}
									>
										<X className="h-3 w-3" />
									</button>
								</div>
								<div className="grid grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto mt-4">
									{availableApps
										?.filter(
											(app) =>
												!apps
													.map((a) => a?.id)
													.filter(Boolean)
													.includes(app.id),
										)
										.map((app) => (
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
