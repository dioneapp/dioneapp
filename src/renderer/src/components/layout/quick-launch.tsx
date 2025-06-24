import { AnimatePresence, type Variants, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "../../translations/translationContext";
import { Plus, X } from "lucide-react";
import { useAppContext } from "./global-context";

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
	} = useAppContext(); // change "apps" later
	const [showAppList, setShowAppList] = useState<boolean>(false);
	const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
	const maxApps = 6;

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

	useEffect(() => {
		handleReloadQuickLaunch();
	}, []);

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
		setShowAppList(false);
		setSelectedSlot(null);
		setRemovedApps((prevRemoved) =>
			prevRemoved.filter((removedApp) => removedApp.id !== app.id),
		);
	}

	const removeApp = (index: number) => {
		const newApps = [...apps];
		newApps.splice(index, 1);
		setApps(newApps);
		setRemovedApps((prevApps) => [...prevApps, apps[index]]);
	};

	const renderAppButton = (app: any, index: number) => (
		<div key={`slot-${index}`} className="flex flex-col items-center gap-1">
			<Link
				to={`/install/${app.id}`}
				className={`border border-white/10 hover:opacity-80 transition-opacity duration-300 rounded-xl flex items-center justify-center overflow-hidden ${compactMode ? "h-12 w-12" : "h-18 w-18"}`}
				onContextMenu={(e) => {
					e.preventDefault();
					removeApp(index);
				}}
			>
				{app.logo_url?.startsWith("http") ? (
					<img
						src={app.logo_url}
						alt={app.name}
						className="h-full w-full object-cover bg-neutral-800/50"
					/>
				) : (
					<div
						className="h-full w-full object-cover"
						style={{ backgroundImage: app.logo_url }}
					/>
				)}
			</Link>
			{!compactMode && (
				<div className="max-w-18 overflow-hidden flex justify-center items-center">
					<p className="text-[12px] text-neutral-300 truncate w-full">
						{app.name}
					</p>
				</div>
			)}
		</div>
	);

	const renderEmptyButton = (index: number) => (
		<div className="flex flex-col items-center gap-1">
			<button
				type="button"
				onClick={() => showAppSelector(index)}
				className="h-18 w-18 border border-white/10 rounded-xl flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
				disabled={
					availableApps.length === 0 || availableApps.length === apps.length
				}
			>
				<Plus className="h-10 w-10" />
			</button>
			<div className="max-w-18 overflow-hidden flex justify-center items-center">
				<p className="text-[12px] text-neutral-400 truncate w-full">
					{t("quickLaunch.addApp")}
				</p>
			</div>
		</div>
	);

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
				{showAppList && (
					<motion.div
						className="fixed inset-0 bg-black/50 backdrop-blur-xl z-50 flex items-center justify-center"
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
							<div className="absolute top-0 left-0.5/4 w-32 h-32 bg-[#BCB1E7] rounded-full -translate-y-1/2 blur-3xl z-10" />

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
													className={`h-16 w-16 mb-2 ${app.logo_url ? "border border-white/10" : ""} rounded-xl flex items-center justify-center overflow-hidden`}
													whileHover={{ scale: 1.05 }}
													whileTap={{ scale: 0.95 }}
												>
													{app.logo_url.startsWith("http") ? (
														<img
															src={app.logo_url}
															alt={app.name}
															className="h-full w-full object-cover"
														/>
													) : (
														<div
															style={{
																backgroundImage: app.logo_url,
															}}
															className="h-full w-full object-cover"
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
