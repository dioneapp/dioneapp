import CloseIcon from "@assets/svgs/Close.svg";
import { getCurrentPort } from "@renderer/utils/getPort";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "./global-context";
import Icon from "../icons/icon";

export default function QuickLaunch() {
	const { installedApps, setInstalledApps } = useAppContext();
	const [apps, setApps] = useState<any[]>([]);
	const [showAppList, setShowAppList] = useState<boolean>(false);
	const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
	const [availableApps, setAvailableApps] = useState<any[]>([]);
	const maxApps = 6;

	const backdropVariants = {
		hidden: { opacity: 0 },
		visible: { opacity: 1 },
	};

	const modalVariants = {
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
		async function getInstalledApps() {
			try {
				const port = await getCurrentPort();
				const response = await fetch(
					`http://localhost:${port}/scripts/installed`,
				);
				if (!response.ok) throw new Error("Failed to fetch installed apps");
				const data = await response.json();
				setInstalledApps(data.apps);
			} catch (error) {
				console.error("Error fetching installed apps:", error);
			}
		}

		getInstalledApps();
	}, []);

	async function loadQuickLaunchApps() {
		try {
			const port = await getCurrentPort();
			const results = await Promise.all(
				installedApps
					.slice(0, maxApps)
					.map((app) =>
						fetch(`http://localhost:${port}/search_name/${app}`).then((res) =>
							res.ok ? res.json() : [],
						),
					),
			);
			setApps(results.flat().slice(0, maxApps));
		} catch (error) {
			console.error("Error loading apps:", error);
		}
	}

	useEffect(() => {
		loadQuickLaunchApps();
	}, [installedApps]);

	async function showAppSelector(index: number) {
		try {
			setAvailableApps(apps);
			setSelectedSlot(index);
			setShowAppList(true);
		} catch (error) {
			console.error("Error fetching apps:", error);
		}
	}

	function addToSlot(app: any) {
		if (selectedSlot === null) return;
		const newApps = [...apps];
		newApps[selectedSlot] = app;
		setApps(newApps);
		setShowAppList(false);
		setSelectedSlot(null);
		window.location.reload(); // should change this
	}

	const removeApp = (index: number) => {
		const newApps = [...apps];
		newApps.splice(index, 1);
		setApps(newApps);
		window.location.reload(); // should change this
	};

	const renderAppButton = (app: any, index: number) => (
		<div key={`slot-${index}`} className="flex flex-col items-center gap-1">
			<Link
				to={`/install/${app.id}`}
				className="h-18 w-18 border border-white/10 rounded-xl flex items-center justify-center overflow-hidden"
				onContextMenu={(e) => {
					e.preventDefault();
					removeApp(index);
				}}
			>
				<img
					src={app.logo_url || "/svgs/placeholder.svg"}
					alt={app.name}
					className="h-full w-full object-cover"
				/>
			</Link>
			<p className="text-xs text-neutral-400 truncate">{app.name}</p>
		</div>
	);

	const renderEmptyButton = (index: number) => (
		<div className="flex flex-col items-center gap-1">
			<button
				type="button"
				onClick={() => showAppSelector(index)}
				className="h-18 w-18 border border-white/10 rounded-xl flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
				disabled={installedApps.length === 0}
			>
				<Icon name="Plus" className="h-10 w-10" />
			</button>
			<p className="text-xs text-neutral-400">Add App</p>
		</div>
	);

	return (
		<div className="flex mt-auto w-full h-64">
			<div className="w-full">
				<h2 className="font-semibold">Quick Launch</h2>
				<div className="grid grid-cols-3 my-4 gap-2">
					{Array(maxApps)
						.fill(null)
						.map((_, index) => (
							<div key={`slot-${index}`}>
								{apps[index]
									? renderAppButton(apps[index], index)
									: renderEmptyButton(index)}
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
										<h3 className="text-lg font-semibold">Select an App</h3>
										<p className="text-xs text-neutral-400">
											{availableApps.length} apps are available. You can choose
											up to {maxApps}.
										</p>
									</div>
									<button
										type="button"
										onClick={() => setShowAppList(false)}
										className="px-2 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 text-sm font-medium whitespace-nowrap cursor-pointer"
									>
										<img src={CloseIcon} alt="Close App" className="h-3 w-3" />
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
													{app.logo_url ? (
														<img
															src={app.logo_url || "/svgs/Error.svg"}
															alt={app.name}
															className="h-full w-full object-cover"
														/>
													) : (
														<div className="h-full w-full object-cover bg-white/10 animate-pulse" />
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
