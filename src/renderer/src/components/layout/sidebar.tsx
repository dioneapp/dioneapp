import { getCurrentPort } from "@renderer/utils/getPort";
import { motion } from "framer-motion";
import {
	Camera,
	Library,
	LoaderCircle,
	MonitorDown,
	Settings,
	User,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "../../translations/translationContext";
import { openLink } from "../../utils/openLink";
import { useAuthContext } from "../contexts/AuthContext";
import { useScriptsContext } from "../contexts/ScriptsContext";
import Icon from "../icons/icon";
import QuickLaunch from "./quick-launch";

export default function Sidebar() {
	const { t } = useTranslation();
	const { user, loading } = useAuthContext();
	const [config, setConfig] = useState<any | null>(null);
	const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);
	const { activeApps, handleStopApp } = useScriptsContext();
	const [avatarError, setAvatarError] = useState(false);

	// updates
	const [updateAvailable, setUpdateAvailable] = useState(false);
	const [updateDownloaded, setUpdateDownloaded] = useState(false);

	useEffect(() => {
		window.electron.ipcRenderer.invoke("check-update");
	}, []);

	useEffect(() => {
		const handleUpdateAvailable = () => setUpdateAvailable(true);
		const handleUpdateDownloaded = () => setUpdateDownloaded(true);

		window.electron.ipcRenderer.on("update_available", handleUpdateAvailable);
		window.electron.ipcRenderer.on("update_downloaded", handleUpdateDownloaded);

		return () => {
			window.electron.ipcRenderer.removeListener(
				"update_available",
				handleUpdateAvailable,
			);
			window.electron.ipcRenderer.removeListener(
				"update_downloaded",
				handleUpdateDownloaded,
			);
		};
	}, []);

	useEffect(() => {
		const handleConfigUpdate = () => {
			const updatedConfig = localStorage.getItem("config");
			if (updatedConfig) {
				setConfig(JSON.parse(updatedConfig));
			}
		};

		window.addEventListener("config-updated", handleConfigUpdate);
		return () =>
			window.removeEventListener("config-updated", handleConfigUpdate);
	}, []);

	useEffect(() => {
		const cachedConfig = localStorage.getItem("config");
		if (cachedConfig) setConfig(JSON.parse(cachedConfig));

		const fetchConfig = async () => {
			const port = await getCurrentPort();
			const res = await fetch(`http://localhost:${port}/config`);
			const data = await res.json();
			setConfig(data);
			localStorage.setItem("config", JSON.stringify(data));
		};
		fetchConfig();
	}, []);

	function stopApp(appId: string, appName: string) {
		handleStopApp(appId, appName);
	}

	return (
		<div
			className={`relative flex flex-col items-center justify-center border-r border-white/10 overflow-hidden ${config?.compactMode ? "max-w-24 w-24" : "max-w-70 w-70"}`}
		>
			<div className="absolute bottom-0 bg-gradient-to-t rounded-full -mb-28 blur-3xl from-white/50 to-transparent w-full h-24" />
			<div className="absolute -top-10 -left-14 bg-[#BCB1E7] blur-3xl max-w-64 w-full h-64 rounded-full rounded-bl-none rounded-tl-none opacity-40" />
			<div className="flex flex-col items-center justify-start h-full w-full p-4 z-50 px-6">
				<div
					className={`w-full flex flex-col justify-center items-start gap-2 ${config?.compactMode ? "h-24" : "h-44"}`}
				>
					<Link
						to={"/"}
						className="flex gap-2 hover:opacity-80 transition-opacity justify-center items-center mt-6"
					>
						{config?.compactMode && <Icon name="Dio" className="h-12 w-12" />}
						{!config?.compactMode && <Icon name="Dio" className="h-8 w-8" />}
						{!config?.compactMode && (
							<div className="flex gap-1.5 justify-center items-center">
								<h1 className="font-semibold text-3xl">Dione</h1>
							</div>
						)}
					</Link>
					{!config?.compactMode && (
						<p className="text-xs text-neutral-400 px-0.5">
							{t("sidebar.tagline")}
						</p>
					)}
					{!config?.compactMode && (
						<div className="mt-2 w-full flex gap-2 px-0.5">
							<button
								type="button"
								onClick={() => openLink("https://getdione.app/discord")}
								className="flex items-center justify-center gap-2 text-xs w-full bg-white hover:bg-white/80 transition-colors duration-400 rounded-full text-black font-semibold py-1 text-center cursor-pointer"
							>
								<Icon name="Discord" className="h-4 w-4" />

								<span className="font-semibold">Discord</span>
							</button>

							<button
								type="button"
								onClick={() => openLink("https://getdione.app/github")}
								className="flex items-center justify-center gap-2 text-xs w-full bg-white hover:bg-white/80 transition-colors duration-400 rounded-full text-black font-semibold py-1 text-center cursor-pointer"
							>
								<Icon name="GitHub" className="h-4 w-4" />

								<span className="font-semibold">GitHub</span>
							</button>
						</div>
					)}
				</div>
				<div
					className={
						"mb-auto h-full mt-6 w-full flex flex-col justify-start items-start gap-2 relative"
					}
				>
					{activeApps && activeApps.length > 0 && (
						<div className="w-full">
							{!config?.compactMode && (
								<h3 className="text-xs font-medium text-neutral-400 mb-3 px-1">
									{t("sidebar.activeApps")}
								</h3>
							)}
							<div
								className={`${config?.compactMode ? "flex flex-col gap-2 items-center" : "flex flex-col gap-2"}`}
							>
								{activeApps
									?.slice(0, config?.compactMode ? 6 : 4)
									.map((app, index) => (
										<div
											key={app.appId}
											className={`${config?.compactMode ? "w-full flex justify-center" : "w-full"}`}
										>
											<div
												className={`group relative ${config?.compactMode ? "w-12 h-12" : "w-full"}`}
											>
												<button
													type="button"
													onClick={() => stopApp(app.appId, app.data.name)}
													className="absolute -top-1 -right-1 h-5 w-5 bg-red-500/40 hover:bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 flex items-center justify-center backdrop-blur-sm"
												>
													<X className="h-3 w-3 text-white" />
												</button>
												<Link
													to={{
														pathname: `/install/${app.isLocal ? app.data.name : app.appId}`,
														search: `?isLocal=${app.isLocal}`,
													}}
													className={`${config?.compactMode ? "w-12 h-12 rounded-xl flex items-center justify-center" : "w-full h-10 rounded-lg flex items-center gap-3 px-3"} group-hover:bg-white/5 transition-all duration-200 flex items-center gap-3 px-3 overflow-hidden group`}
												>
													<div
														className={`${config?.compactMode ? "w-8 h-8" : "w-6 h-6"} overflow-hidden flex-shrink-0 rounded-lg`}
													>
														{!app.isLocal ? (
															<>
																{app.data.logo_url?.startsWith(
																	"linear-gradient",
																) ? (
																	<div
																		style={{
																			backgroundImage: app.data.logo_url,
																		}}
																		className="w-full h-full bg-cover bg-center rounded-lg"
																	/>
																) : (
																	<img
																		src={app.data.logo_url}
																		alt={app.data.name}
																		className="w-full h-full object-cover rounded-lg"
																	/>
																)}
															</>
														) : (
															<div className="w-full h-full bg-neutral-900 flex items-center justify-center">
																<span className="text-white/80 font-semibold text-sm">
																	{app.data.name?.charAt(0)?.toUpperCase() ||
																		"?"}
																</span>
															</div>
														)}
													</div>
													{!config?.compactMode && (
														<div className="flex-1 min-w-0">
															<p className="text-sm font-medium text-white truncate">
																{app.data.name}
															</p>
															<p className="text-xs text-neutral-400 truncate">
																{app.data.description || "Running"}
															</p>
														</div>
													)}
												</Link>
											</div>
											{index <
												activeApps.slice(0, config?.compactMode ? 4 : 6)
													.length -
													1 && (
												<div
													className={`${config?.compactMode ? "w-8 mx-auto" : "w-full"} h-px bg-white/10 my-2`}
												/>
											)}
										</div>
									))}
							</div>
						</div>
					)}
				</div>
				{updateAvailable && !config?.compactMode && (
					<motion.button
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.2 }}
						className="h-fit bg-neutral-700/30 border border-white/5 rounded-xl backdrop-blur-3xl w-full max-w-56 my-6 active:cursor-pointer active:hover:bg-white/10 transition-colors duration-200 text-left"
						disabled={updateAvailable}
						onClick={() => {
							if (updateDownloaded) {
								window.electron.ipcRenderer.send("restart_app");
							} else {
								window.electron.ipcRenderer.send("download_and_restart");
							}
						}}
					>
						{updateDownloaded ? (
							<div className="justify-center items-start w-full h-full p-5 flex flex-col gap-1">
								<h1 className="font-semibold text-xl text-neutral-200">
									{t("sidebar.update.title")}
								</h1>
								<h2 className="text-[10px] text-neutral-300 text-balance">
									{t("sidebar.update.description")}
								</h2>
							</div>
						) : (
							<div className="justify-center items-start w-full h-full p-5 flex flex-col gap-1">
								<div className="flex justify-between items-center w-full">
									<h1 className="font-semibold text-xl text-neutral-200">
										Downloading
									</h1>
									<span>
										<LoaderCircle className="h-5 w-5 text-neutral-400 animate-spin" />
									</span>
								</div>
								<h2 className="text-[10px] text-neutral-300 text-balance">
									When the download finishes, the app will restart
								</h2>
							</div>
						)}
					</motion.button>
				)}
				{updateAvailable && config?.compactMode && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.2 }}
						className="w-9.5 h-9.5 bg-white hover:bg-white/80 transition-colors duration-200 rounded-full backdrop-blur-3xl mb-4 group cursor-pointer flex justify-center items-center p-2"
					>
						<MonitorDown className="h-5 w-5 text-black" />
						<div
							className="absolute left-1/2 -translate-x-1/2 bottom-0 my-16 px-6 py-4 bg-black backdrop-blur-3xl text-white text-xs shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200"
							style={{ whiteSpace: "pre-line", zIndex: 99999 }}
						>
							{t("sidebar.update.tooltip")}
						</div>
					</motion.div>
				)}
				{!config?.compactMode && (
					<QuickLaunch compactMode={config?.compactMode} />
				)}
				<div
					className={`mt-auto h-0.5 rounded-full w-full from-transparent via-white/40 to-transparent bg-gradient-to-l ${!config?.compactMode ? "mb-4" : ""}`}
				/>
				<div
					className={`mb-4 flex gap-2 items-center justify-center w-full h-fit group transition-all duration-500 ${loading ? "[&_div_div]:opacity-100 [&_div_div]:blur-none [&_div_div]:mt-0" : "hover:[&_div_div]:opacity-100 hover:[&_div_div]:blur-none [&_div_div]:-mt-24 hover:[&_div_div]:mt-0 [&_div_div]:opacity-0 [&_div_div]:blur-lg"} ${config?.compactMode ? "flex-col" : ""}`}
				>
					{config?.compactMode && (
						<div className="mt-4 items-center gap-2 justify-center mx-auto w-full h-full flex-col flex transition-all duration-500">
							<div className="flex flex-col gap-2 transition-all duration-400 mb-2">
								<button
									type="button"
									onClick={() => window.captureScreenshot()}
									className="w-9 h-9 border border-white/10 hover:bg-white/10 rounded-full transition-colors flex gap-1 items-center justify-center relative cursor-pointer"
									onMouseEnter={() => setHoveredTooltip("capture")}
									onMouseLeave={() => setHoveredTooltip(null)}
								>
									<Camera className="h-5 w-5" />
									{hoveredTooltip === "capture" && (
										<div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 px-3 py-2 bg-black/90 text-white text-xs shadow-lg backdrop-blur-3xl duration-200 whitespace-nowrap">
											{t("sidebar.tooltips.capture")}
										</div>
									)}
								</button>
								<Link
									to={"/library"}
									className="w-9 h-9 border border-white/10 hover:bg-white/10 rounded-full flex gap-1 items-center justify-center transition-colors relative"
									onMouseEnter={() => setHoveredTooltip("library")}
									onMouseLeave={() => setHoveredTooltip(null)}
								>
									<Library className="h-5 w-5" />
									{hoveredTooltip === "library" && (
										<div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 px-3 py-2 bg-black/90 text-white text-xs shadow-lg backdrop-blur-3xl duration-200 whitespace-nowrap">
											{t("sidebar.tooltips.library")}
										</div>
									)}
								</Link>
								<Link
									to={"/settings"}
									className="w-9 h-9 border border-white/10 hover:bg-white/10 rounded-full transition-colors flex gap-1 items-center justify-center relative"
									onMouseEnter={() => setHoveredTooltip("settings")}
									onMouseLeave={() => setHoveredTooltip(null)}
								>
									<Settings className="h-5 w-5" />
									{hoveredTooltip === "settings" && (
										<div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 px-3 py-2 bg-black/90 text-white text-xs shadow-lg backdrop-blur-3xl duration-200 whitespace-nowrap">
											{t("sidebar.tooltips.settings")}
										</div>
									)}
								</Link>
							</div>
						</div>
					)}
					<div
						className={`relative mt-auto w-fit flex items-center gap-2 ${config?.compactMode ? "justify-center" : "justify-start"}`}
					>
						{user && (
							<Link
								className={`cursor-pointer overflow-hidden flex items-center justify-center transition-opacity duration-200 ${loading ? "cursor-auto" : ""} h-9 w-9 rounded-full ${!user?.avatar_url && "border border-white/20"}`}
								to="/account"
								onMouseEnter={
									!loading ? () => setHoveredTooltip("account") : undefined
								}
								onMouseLeave={
									!loading ? () => setHoveredTooltip(null) : undefined
								}
							>
								{loading && !user ? (
									<div
										className="w-full h-full border border-white/10 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center cursor-pointer"
										onMouseEnter={() => setHoveredTooltip("account")}
										onMouseLeave={() => setHoveredTooltip(null)}
									>
										<User className="h-5 w-5" />
									</div>
								) : (
									<>
										{!avatarError &&
										user?.avatar_url &&
										user?.avatar_url !== "" &&
										user?.avatar_url !== null &&
										user?.avatar_url !== undefined ? (
											<img
												src={user?.avatar_url}
												alt="user avatar"
												className="h-full w-full object-cover object-center"
												onError={() => {
													setAvatarError(true);
												}}
											/>
										) : (
											<span className="h-full w-full flex justify-center items-center border border-white/20 rounded-full bg-white/10">
												<span>
													{user?.username.charAt(0).toUpperCase() || (
														<User className="h-5 w-5" />
													)}
												</span>
											</span>
										)}
									</>
								)}
								{hoveredTooltip === "account" && (
									<div
										className={`${config?.compactMode ? "absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 px-3 py-2 bg-black/90 text-white text-xs shadow-lg backdrop-blur-3xl duration-200 whitespace-nowrap" : "absolute left-1/2 -translate-x-1/2 top-full z-50 px-3 py-1 text-neutral-300 text-xs shadow-lg duration-200 whitespace-nowrap"}`}
									>
										{t("sidebar.tooltips.account")}
									</div>
								)}
							</Link>
						)}
					</div>
					{!config?.compactMode && (
						<div className="flex gap-2 items-center justify-start w-full h-full">
							{!user && (
								<Link
								to={"/first-time?login=true"}
								className="w-9 h-9 border border-white/10 hover:bg-white/80 bg-white rounded-full transition-colors flex gap-1 items-center justify-center relative cursor-pointer"
								onMouseEnter={() => setHoveredTooltip("login")}
								onMouseLeave={() => setHoveredTooltip(null)}
							>
								<User className="h-5 w-5 text-black" />
								{hoveredTooltip === "login" && (
									<div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 px-3 py-2 bg-black/90 text-white text-xs shadow-lg backdrop-blur-3xl duration-200 whitespace-nowrap">
										{t("sidebar.tooltips.login")}
									</div>
								)}
							</Link>
							)}
						</div>
					)}
					{config?.compactMode && (
						<div className="flex gap-2 items-center justify-start w-9.5 h-9.5">
							{!user && (
								<button
									type="button"
									className="w-9.5 h-9.5 border bg-white text-black font-medium rounded-full transition-colors flex items-center justify-center cursor-pointer relative"
									onClick={() =>
										openLink("https://getdione.app/auth/login?app=true")
									}
									onMouseEnter={() => setHoveredTooltip("login")}
									onMouseLeave={() => setHoveredTooltip(null)}
								>
									<User className="h-4 w-4" />
								</button>
							)}
						</div>
					)}
					{!config?.compactMode && (
						<div className="flex gap-2 items-center justify-end w-full h-full">
							<button
								type="button"
								onClick={() => (window.captureScreenshot())}
								className="p-2 border border-white/10 hover:bg-white/10 rounded-full transition-colors flex gap-1 items-center relative cursor-pointer"
								onMouseEnter={() => setHoveredTooltip("capture")}
								onMouseLeave={() => setHoveredTooltip(null)}
							>
								<Camera className="h-5 w-5" />
								{hoveredTooltip === "capture" && (
									<div className="absolute left-1/2 -translate-x-1/2 top-full mt-4 z-50 px-3 py-1 text-neutral-300 text-xs shadow-lg duration-200 whitespace-nowrap">
										{t("sidebar.tooltips.capture")}
									</div>
								)}
							</button>
							<Link
								to={"/library"}
								className="p-2 border border-white/10 hover:bg-white/10 rounded-full transition-colors flex gap-1 items-center relative"
								onMouseEnter={() => setHoveredTooltip("library")}
								onMouseLeave={() => setHoveredTooltip(null)}
							>
								<Library className="h-5 w-5" />
								{hoveredTooltip === "library" && (
									<div className="absolute left-1/2 -translate-x-1/2 top-full mt-4 z-50 px-3 py-1 text-neutral-300 text-xs shadow-lg duration-200 whitespace-nowrap">
										{t("sidebar.tooltips.library")}
									</div>
								)}
							</Link>
							<Link
								to={"/settings"}
								className="p-2 border border-white/10 hover:bg-white/10 rounded-full transition-colors flex gap-1 items-center relative"
								onMouseEnter={() => setHoveredTooltip("settings")}
								onMouseLeave={() => setHoveredTooltip(null)}
							>
								<Settings className="h-5 w-5" />
								{hoveredTooltip === "settings" && (
									<div className="absolute left-1/2 -translate-x-1/2 top-full mt-4 z-50 px-3 py-1 text-neutral-300 text-xs shadow-lg duration-200 whitespace-nowrap">
										{t("sidebar.tooltips.settings")}
									</div>
								)}
							</Link>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
