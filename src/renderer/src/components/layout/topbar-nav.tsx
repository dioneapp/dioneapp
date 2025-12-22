import { useScriptsContext } from "@/components/contexts/ScriptsContext";
import { useAuthContext } from "@/components/contexts/auth-context";
import GeneratedIcon from "@/components/icons/generated-icon";
import Icon from "@/components/icons/icon";
import { useTranslation } from "@/translations/translation-context";
import { apiFetch } from "@/utils/api";
import { openLink } from "@/utils/open-link";
import { Camera, Home, Library, Maximize, Minimize as Minimize2, Minus, Settings, User, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function TopbarNav() {
	const { t } = useTranslation();
	const { user, loading } = useAuthContext();
	const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);
	const { activeApps, handleStopApp, isServerRunning, setExitRef } = useScriptsContext();
	const [avatarError, setAvatarError] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [isMaximized, setIsMaximized] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();

	function stopApp(appId: string, appName: string) {
		handleStopApp(appId, appName);
	}

	const isActivePath = (path: string) => {
		return location.pathname === path;
	};

	const handleClose = async () => {
		if (Object.keys(isServerRunning).length !== 0) {
			const hasRunning = Object.values(isServerRunning).some((value) => value);
			if (hasRunning) {
				setShowModal(true);
				setExitRef(true);
			} else {
				await apiFetch("/ai/ollama/stop", { method: "POST" });
				window.electron.ipcRenderer.invoke("app:close");
			}
		} else {
			window.electron.ipcRenderer.invoke("app:close");
		}
	};

	const handleMinimize = async () => {
		await window.electron.ipcRenderer.invoke("app:minimize");
	};

	const handleMaximize = async () => {
		const maximized = await window.electron.ipcRenderer.invoke(
			"app:toggle-maximize",
		);
		setIsMaximized(maximized);
	};

	return (
		<>
			{showModal && (
				<div
					className="fixed top-0 left-0 w-screen h-screen backdrop-filter backdrop-blur-3xl bg-black/80 flex items-center justify-center"
					style={{ zIndex: 100 }}
				>
					<div className="flex flex-col items-center justify-center h-full w-full">
						<h1 className="text-4xl font-semibold mb-4">
							{t("titlebar.closing.title")}
						</h1>
						<p className="text-neutral-400 text-balance text-center max-w-xl">
							{t("titlebar.closing.description")}
						</p>
					</div>
				</div>
			)}
			<div className="w-full flex flex-col bg-black/20 backdrop-blur-xl border-b border-white/10 relative mb-0 pb-0">
				{/* First Row: Main Navigation + Window Controls */}
				   <div className="flex items-center px-4 gap-4 h-10 relative overflow-hidden" id="titlebar">
					{/* Logo/Brand */}
					<Link to="/" className="flex items-center gap-2 mr-4 relative z-10 shrink-0" id="no-draggable">
						<Icon name="Dio" className="w-5 h-5" />
						<span className="text-sm font-semibold text-neutral-200">Dione</span>
					</Link>

					{/* Navigation Links */}
					<div className="flex items-center gap-2 flex-1 relative z-10">
						<Link
							to="/"
							id="no-draggable"
							className={`px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm shrink-0 ${
								isActivePath("/")
									? "bg-white/15 text-white"
									: "text-neutral-400 hover:text-neutral-200 hover:bg-white/5"
							}`}
						>
							<Home className="h-4 w-4" />
							<span>{t("home.title")}</span>
						</Link>

						<Link
							to="/library"
							id="no-draggable"
							className={`px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm shrink-0 ${
								isActivePath("/library")
									? "bg-white/15 text-white"
									: "text-neutral-400 hover:text-neutral-200 hover:bg-white/5"
							}`}
						>
							<Library className="h-4 w-4" />
							<span>{t("sidebar.tooltips.library")}</span>
						</Link>
					</div>

					{/* Right side actions */}
					<div className="flex items-center gap-2 relative z-10 shrink-0">
								   {activeApps.length > 0 && (
									   <div className="flex items-center gap-1 px-2 py-1 bg-white/10 rounded-full">
										   <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
										   <span className="text-xs text-neutral-400">
											   {activeApps.length} {activeApps.length === 1 ? t("sidebar.app") : t("sidebar.apps")} {t("sidebar.running")}
										   </span>
									   </div>
								   )}
								   <button
									   type="button"
									   id="no-draggable"
									   onClick={() => window.captureScreenshot()}
									   className="p-2 hover:bg-white/10 rounded-lg transition-colors relative"
									   onMouseEnter={() => setHoveredTooltip("capture")}
									   onMouseLeave={() => setHoveredTooltip(null)}
								   >
									   <Camera className="h-4 w-4" />
									   {hoveredTooltip === "capture" && (
										   <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 px-3 py-1 bg-black/90 text-white text-xs shadow-lg backdrop-blur-3xl whitespace-nowrap rounded-lg">
											   {t("sidebar.tooltips.capture")}
										   </div>
									   )}
								   </button>

						<Link
							to="/settings"
							id="no-draggable"
							className={`p-2 rounded-lg transition-colors relative ${
								isActivePath("/settings")
									? "bg-white/15"
									: "hover:bg-white/10"
							}`}
							onMouseEnter={() => setHoveredTooltip("settings")}
							onMouseLeave={() => setHoveredTooltip(null)}
						>
							<Settings className="h-4 w-4" />
							{hoveredTooltip === "settings" && (
								<div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 px-3 py-1 bg-black/90 text-white text-xs shadow-lg backdrop-blur-3xl whitespace-nowrap rounded-lg">
									{t("sidebar.tooltips.settings")}
								</div>
							)}
						</Link>

						{/* User Section */}
						{user && (
							<Link
								to="/account"
								id="no-draggable"
								className="flex items-center gap-2 p-1.5 hover:bg-white/10 rounded-lg transition-colors"
							>
								{!avatarError ? (
									<img
										src={user.avatar}
										alt={user.username}
										className="h-6 w-6 rounded-full"
										onError={() => setAvatarError(true)}
									/>
								) : (
									<div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center">
										<User className="h-4 w-4" />
									</div>
								)}
								<span className="text-sm text-neutral-300">{user.username}</span>
							</Link>
						)}

						{!loading && !user && (
							<button
								type="button"
								id="no-draggable"
								className="px-3 py-1.5 bg-white hover:bg-white/90 text-black font-medium rounded-lg transition-all duration-200 flex items-center gap-2 text-sm"
								onClick={() =>
									openLink("https://getdione.app/auth/login?app=true")
								}
							>
								<User className="h-4 w-4" />
								{t("sidebar.tooltips.login")}
							</button>
						)}

						{/* Separator */}
						<div className="h-6 w-px bg-white/10 mx-2" />

						   {/* Window Controls */}
						   <div id="no-draggable">
							   <button
								   type="button"
								   onClick={handleMinimize}
								   className="cursor-pointer p-1 hover:bg-white/10 rounded-md transition-all duration-200 text-white/70 hover:text-white"
							   >
								   <Minus className="h-5 w-5" />
							   </button>
						   </div>
						   <div id="no-draggable">
							   <button
								   type="button"
								   onClick={handleMaximize}
								   className="cursor-pointer p-1.5 hover:bg-white/10 rounded-md transition-all duration-200 text-white/70 hover:text-white"
							   >
								   {isMaximized ? (
									   <Minimize2 className="h-4 w-4" />
								   ) : (
									   <Maximize className="h-4 w-4" />
								   )}
							   </button>
						   </div>
						   <div id="no-draggable">
							   <button
								   type="button"
								   onClick={handleClose}
								   className="cursor-pointer p-1 hover:bg-red-500/20 hover:text-red-400 rounded-md transition-all duration-200 text-white/70"
							   >
								   <X className="h-5 w-5" />
							   </button>
						   </div>
					</div>
				</div>

				   {/* Second Row: Active Apps */}
				   {activeApps.length > 0 && (
					   <div className="flex items-center px-4 gap-2 h-10 border-t border-white/5" id="no-draggable">
						   <div className="flex items-center gap-2 flex-1 overflow-x-hidden">
							   {activeApps
								   ?.filter((app) => app.appId !== "ollama")
								   .map((app) => {
									   return (
										   <div
											   key={app.appId}
											   className="relative group"
											   onMouseEnter={() => setHoveredTooltip(app.appId)}
											   onMouseLeave={() => setHoveredTooltip(null)}
										   >
											   <button
												   type="button"
												   className="flex items-center gap-1.5 bg-white/10 rounded-lg px-2 py-1 hover:bg-white/15 transition-colors shrink-0 focus:outline-none"
												   style={{ textDecoration: "none" }}
												   onClick={() => {
													   navigate({
														   pathname: `/install/${app.isLocal ? app.data?.name : app.appId}`,
														   search: `?isLocal=${app.isLocal}`,
													   });
												   }}
											   >
												   <div className="w-6 h-6 overflow-hidden shrink-0 rounded-lg">
													   {!app.isLocal ? (
														   <>
															   {app.data?.logo_url?.startsWith("http") ? (
																   <img
																	   src={app.data.logo_url}
																	   alt={app.data.name}
																	   className="w-full h-full object-cover rounded-lg"
																   />
															   ) : (
																   <GeneratedIcon
																	   name={app?.data?.name || app.appId}
																	   className="h-full w-full border border-white/10 group-hover:border-white/20"
																   />
															   )}
														   </>
													   ) : (
														   <GeneratedIcon
															   name={app?.data?.name}
															   className="w-full h-full"
															   roundedClassName="rounded-lg"
														   />
													   )}
												   </div>
												   <span className="text-xs text-neutral-300 whitespace-nowrap max-w-30 truncate mr-6">
													   {app?.data?.name || app.appId}
												   </span>
											   </button>
											   <button
												   type="button"
												   onClick={() => stopApp(app.appId, app.data?.name || app.appId)}
												   className="ml-2 p-0.5 mr-2 hover:bg-white/20 rounded transition-colors absolute right-0 top-1/2 -translate-y-1/2"
												   style={{ zIndex: 2 }}
											   >
												   <X className="h-3 w-3" />
											   </button>
											   {hoveredTooltip === app.appId && (
												   <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 px-3 py-1 bg-black/90 text-white text-xs shadow-lg backdrop-blur-3xl whitespace-nowrap rounded-lg">
													   {app?.data?.name || app.appId}
												   </div>
											   )}
										   </div>
									   );
								   })}
						   </div>
					   </div>
				   )}
			</div>
		</>
	);
}

