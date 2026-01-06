import { useAuthContext } from "@/components/contexts/auth-context";
import { useScriptsContext } from "@/components/contexts/scripts-context";
import QuickLaunch from "@/components/features/layout/quick-launch";
import GeneratedIcon from "@/components/icons/generated-icon";
import Icon from "@/components/icons/icon";
import { Button, IconButton } from "@/components/ui";
import { useTranslation } from "@/translations/translation-context";
import { apiJson } from "@/utils/api";
import { openLink } from "@/utils/open-link";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
	SortableContext,
	arrayMove,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Clock, Library, Settings, User, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
	const { t } = useTranslation();
	const { user, loading } = useAuthContext();
	const [config, setConfig] = useState<any | null>(null);
	const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);
	const { activeApps, handleStopApp } = useScriptsContext();
	const [sidebarOrder, setSidebarOrder] = useState(() =>
		activeApps.filter((app) => app.appId !== "ollama").map((app) => app.appId),
	);

	React.useEffect(() => {
		setSidebarOrder((prevOrder) => {
			const currentIds = activeApps
				.filter((app) => app.appId !== "ollama")
				.map((app) => app.appId);
			return currentIds
				.filter((id) => prevOrder.includes(id))
				.concat(currentIds.filter((id) => !prevOrder.includes(id)));
		});
	}, [activeApps]);

	function handleSidebarDragEnd(event: any) {
		const { active, over } = event;
		if (active.id !== over?.id) {
			setSidebarOrder((items) => {
				const oldIndex = items.indexOf(active.id);
				const newIndex = items.indexOf(over.id);
				return arrayMove(items, oldIndex, newIndex);
			});
		}
	}

	function SortableSidebarApp({
		app,
		children,
	}: { app: any; children: React.ReactNode }) {
		const {
			attributes,
			listeners,
			setNodeRef,
			transform,
			transition,
			isDragging,
		} = useSortable({ id: app.appId });
		return (
			<div
				ref={setNodeRef}
				style={{
					transform: CSS.Transform.toString(transform),
					transition,
					opacity: isDragging ? 0.5 : 1,
					zIndex: isDragging ? 100 : undefined,
				}}
				{...attributes}
				{...listeners}
			>
				{children}
			</div>
		);
	}
	const [avatarError, setAvatarError] = useState(false);

	const [updateAvailable, setUpdateAvailable] = useState(false);
	const [updateDownloaded, setUpdateDownloaded] = useState(false);
	const [releaseNotes, setReleaseNotes] = useState<any>(null);

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
			try {
				const data = await apiJson<any>("/config");
				setConfig(data);
				localStorage.setItem("config", JSON.stringify(data));
			} catch (error) {
				console.error("Failed to load config: ", error);
			}
		};
		fetchConfig();
	}, []);

	function stopApp(appId: string, appName: string) {
		handleStopApp(appId, appName);
	}

	useEffect(() => {
		const fetchReleaseNotes = async () => {
			if (updateAvailable) {
				const currentVersion =
					await window.electron.ipcRenderer.invoke("get-version");
				const res = await fetch(
					"https://api.github.com/repos/dioneapp/dioneapp/releases",
				);
				if (!res.ok) return;
				const releases = await res.json();
				const nextRelease = releases.find(
					(rel: any) =>
						rel.tag_name?.replace(/^v/, "") !== currentVersion &&
						!rel.draft &&
						!rel.prerelease,
				);
				if (nextRelease) {
					setReleaseNotes(nextRelease);
				}
			}
		};

		fetchReleaseNotes();
	}, [updateAvailable]);

	return (
		<>
			<AnimatePresence>
				{updateDownloaded && releaseNotes && (
					<motion.div
						key="update-modal"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.18 }}
						className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
					>
						<div className="max-w-2xl w-full px-6">
							<div className="bg-neutral-900/80 border border-white/6 rounded-xl p-6 shadow-2xl backdrop-blur-md text-left">
								<div className="flex flex-col gap-3">
									<div>
										<h1 className="text-2xl font-semibold text-neutral-50">
											{t("sidebarUpdate.newUpdateAvailable")}
										</h1>
										<p className="text-sm text-neutral-400">
											{t("sidebarUpdate.whatsNew")}
										</p>
									</div>

									<div className="mt-2 bg-neutral-800/40 p-4 rounded-xl">
										<div className="flex items-center justify-between gap-4">
											<h3 className="text-lg text-neutral-100 font-medium break-words">
												{releaseNotes.name}
											</h3>
											<span className="text-xs text-neutral-300 flex items-center gap-2">
												<Clock className="h-4 w-4" />
												{new Date(releaseNotes.published_at).toLocaleDateString(
													undefined,
													{ year: "numeric", month: "short", day: "numeric" },
												)}
												,{" "}
												{new Date(releaseNotes.published_at).toLocaleTimeString(
													[],
													{ hour: "2-digit", minute: "2-digit" },
												)}
											</span>
										</div>
										<ul className="text-neutral-300 text-sm mt-3 list-disc pl-5 max-h-40 overflow-auto space-y-1">
											{releaseNotes.body
												.split(/\r?\n/)
												.filter((line) => line.trim().startsWith("* "))
												.map((line, idx) => (
													<li key={idx}>{line.replace(/^\*\s*/, "")}</li>
												))}
										</ul>
									</div>

									<div className="mt-4 flex justify-end gap-3">
										<Button
											onClick={() => setUpdateDownloaded(false)}
											variant="outline"
											size="sm"
										>
											{t("updates.later")}
										</Button>
										<Button
											onClick={() =>
												window.electron.ipcRenderer.send("quit_and_install")
											}
											variant="accent"
											size="sm"
										>
											{t("updates.install")}
										</Button>
									</div>
								</div>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
			<div
				className={`h-full relative flex flex-col items-center justify-center border-r border-white/10 overflow-hidden ${config?.compactMode ? "max-w-24 w-24" : "max-w-70 w-70"}`}
			>
				<div
					className="absolute -top-16 -right-8 w-48 h-48 rounded-xl blur-3xl pointer-events-none"
					style={{
						backgroundColor:
							"color-mix(in srgb, var(--theme-accent) 8%, transparent)",
					}}
				/>
				<div
					className="absolute -bottom-16 -left-8 w-40 h-40 rounded-xl blur-3xl pointer-events-none"
					style={{
						backgroundColor:
							"color-mix(in srgb, var(--theme-accent) 5%, transparent)",
					}}
				/>
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
									<h1 className="font-semibold text-3xl">{t("links.dione")}</h1>
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
								<Button
									onClick={() => openLink("https://getdione.app/discord")}
									variant="accent"
									size="sm"
									className="flex-1"
								>
									<Icon name="Discord" className="h-4 w-4" />
									<span className="font-semibold">{t("links.discord")}</span>
								</Button>

								<Button
									onClick={() => openLink("https://getdione.app/github")}
									variant="accent"
									size="sm"
									className="flex-1"
								>
									<Icon name="GitHub" className="h-4 w-4" />
									<span className="font-semibold">{t("links.github")}</span>
								</Button>
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
								<DndContext
									collisionDetection={closestCenter}
									onDragEnd={handleSidebarDragEnd}
								>
									<SortableContext
										items={sidebarOrder}
										strategy={verticalListSortingStrategy}
									>
										<div
											className={
												config?.compactMode
													? "flex flex-col gap-2 items-center"
													: "flex flex-col gap-2"
											}
										>
											{sidebarOrder.map((id) => {
												const app = activeApps.find((a) => a.appId === id);
												if (!app) return null;
												return (
													<SortableSidebarApp key={app.appId} app={app}>
														<div
															className={
																config?.compactMode
																	? "w-full flex justify-center"
																	: "w-full"
															}
														>
															<div
																className={`group relative ${config?.compactMode ? "w-12 h-12" : "w-full"}`}
															>
																<IconButton
																	onClick={() =>
																		stopApp(app.appId, app.data?.name)
																	}
																	icon={<X className="h-3 w-3 text-white" />}
																	variant="danger"
																	size="xs"
																	className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 backdrop-blur-sm"
																/>
																<Link
																	to={{
																		pathname: `/install/${app.isLocal ? app.data?.name : app.appId}`,
																		search: `?isLocal=${app.isLocal}`,
																	}}
																	className={
																		config?.compactMode
																			? "w-12 h-12 rounded-xl flex items-center justify-center"
																			: "w-full h-10 rounded-xl flex items-center gap-3 px-3" +
																			" group-hover:bg-white/5 transition-all duration-200 flex items-center gap-3 px-3 overflow-hidden group"
																	}
																>
																	<div
																		className={
																			config?.compactMode
																				? "w-8 h-8"
																				: "w-6 h-6" +
																				" overflow-hidden shrink-0 rounded-lg"
																		}
																	>
																		{!app.isLocal ? (
																			<>
																				{app.data.logo_url?.startsWith(
																					"http",
																				) ? (
																					<img
																						src={app.data.logo_url}
																						alt={app.data.name}
																						className="w-full h-full object-cover rounded-lg"
																					/>
																				) : (
																					<GeneratedIcon
																						name={app?.data?.name || app.appId}
																						className="h-full w-full border border-white/10 group-hover:border-white/20"
																						isSidebarIcon
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
																	{!config?.compactMode && (
																		<div className="flex-1 min-w-0">
																			<p className="text-sm font-medium text-white truncate">
																				{app?.data?.name || app.appId}
																			</p>
																			<p className="text-xs text-neutral-400 truncate">
																				{app?.data?.description ||
																					t("runningApps.running")}
																			</p>
																		</div>
																	)}
																</Link>
															</div>
														</div>
													</SortableSidebarApp>
												);
											})}
										</div>
									</SortableContext>
								</DndContext>
							</div>
						)}
					</div>
					{!config?.compactMode && (
						<QuickLaunch compactMode={config?.compactMode} />
					)}
					<div
						className={`mt-auto h-0.5 rounded-xl w-full from-transparent via-white/40 to-transparent bg-linear-to-l ${!config?.compactMode ? "mb-4" : ""}`}
					/>
					<div
						className={`mb-4 flex gap-2 items-center justify-center w-full h-fit group transition-all duration-500 ${loading ? "[&_div_div]:opacity-100 [&_div_div]:blur-none [&_div_div]:mt-0" : "hover:[&_div_div]:opacity-100 hover:[&_div_div]:blur-none [&_div_div]:-mt-24 hover:[&_div_div]:mt-0 [&_div_div]:opacity-0 [&_div_div]:blur-lg"} ${config?.compactMode ? "flex-col" : ""}`}
					>
						{config?.compactMode && (
							<div className="mt-4 items-center gap-2 justify-center mx-auto w-full h-full flex-col flex transition-all duration-500">
								<div className="flex flex-col gap-2 transition-all duration-400 mb-2">
									<IconButton
										onClick={() => window.captureScreenshot()}
										icon={<Camera className="h-5 w-5" />}
										variant="outline"
										size="md"
										className="w-10 h-10"
										onMouseEnter={() => setHoveredTooltip("capture")}
										onMouseLeave={() => setHoveredTooltip(null)}
									>
										{hoveredTooltip === "capture" && (
											<div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 px-3 py-2 bg-black/90 text-white text-xs shadow-lg backdrop-blur-3xl duration-200 whitespace-nowrap rounded-xl">
												{t("sidebar.tooltips.capture")}
											</div>
										)}
									</IconButton>
									<Link
										to={"/library"}
										className="w-10 h-10 border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-xl flex gap-1 items-center justify-center transition-all duration-200 relative"
										onMouseEnter={() => setHoveredTooltip("library")}
										onMouseLeave={() => setHoveredTooltip(null)}
									>
										<Library className="h-5 w-5" />
										{hoveredTooltip === "library" && (
											<div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 px-3 py-2 bg-black/90 text-white text-xs shadow-lg backdrop-blur-3xl duration-200 whitespace-nowrap rounded-xl">
												{t("sidebar.tooltips.library")}
											</div>
										)}
									</Link>
									<Link
										to={"/settings"}
										className="w-10 h-10 border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-xl transition-all duration-200 flex gap-1 items-center justify-center relative"
										onMouseEnter={() => setHoveredTooltip("settings")}
										onMouseLeave={() => setHoveredTooltip(null)}
									>
										<Settings className="h-5 w-5" />
										{hoveredTooltip === "settings" && (
											<div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 px-3 py-2 bg-black/90 text-white text-xs shadow-lg backdrop-blur-3xl duration-200 whitespace-nowrap rounded-xl">
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
									className={`cursor-pointer overflow-hidden flex items-center justify-center transition-opacity duration-200 ${loading ? "cursor-auto" : ""} h-9 w-9 rounded-xl ${!user?.avatar_url && "border border-white/20"}`}
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
											className="w-full h-full border border-white/10 hover:bg-white/10 rounded-xl transition-colors flex items-center justify-center cursor-pointer"
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
												<span className="h-full w-full flex justify-center items-center border border-white/20 rounded-xl bg-white/10">
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
										className="w-9 h-9 border border-white/10 hover:bg-white hover:border-white/20 bg-white/90 rounded-xl transition-all duration-200 flex gap-1 items-center justify-center relative cursor-pointer shadow-lg hover:shadow-xl"
										onMouseEnter={() => setHoveredTooltip("login")}
										onMouseLeave={() => setHoveredTooltip(null)}
									>
										<User className="h-5 w-5 text-black" />
										{hoveredTooltip === "login" && (
											<div
												className={`${config?.compactMode ? "absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 px-3 py-2 bg-black/90 text-white text-xs shadow-lg backdrop-blur-3xl duration-200 whitespace-nowrap rounded-xl" : "absolute left-1/2 -translate-x-1/2 top-full z-50 px-3 py-1 text-neutral-300 text-xs shadow-lg duration-200 whitespace-nowrap rounded-xl"}`}
											>
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
									<IconButton
										icon={<User className="h-4 w-4" />}
										variant="accent"
										size="md"
										className="w-9.5 h-9.5"
										onClick={() =>
											openLink("https://getdione.app/auth/login?app=true")
										}
										onMouseEnter={() => setHoveredTooltip("login")}
										onMouseLeave={() => setHoveredTooltip(null)}
									/>
								)}
							</div>
						)}
						{!config?.compactMode && (
							<div className="flex gap-2 items-center justify-end w-full h-full">
								<IconButton
									onClick={() => window.captureScreenshot()}
									icon={<Camera className="h-5 w-5" />}
									variant="ghost"
									size="md"
									className="relative"
									onMouseEnter={() => setHoveredTooltip("capture")}
									onMouseLeave={() => setHoveredTooltip(null)}
								>
									{hoveredTooltip === "capture" && (
										<div className="absolute left-1/2 -translate-x-1/2 top-full mt-4 z-50 px-3 py-1 text-neutral-300 text-xs shadow-lg duration-200 whitespace-nowrap">
											{t("sidebar.tooltips.capture")}
										</div>
									)}
								</IconButton>
								<Link
									to={"/library"}
									className="p-2 hover:bg-white/10 rounded-xl transition-colors flex gap-1 items-center relative"
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
									className="p-2 hover:bg-white/10 rounded-xl transition-colors flex gap-1 items-center relative"
									onMouseEnter={() => setHoveredTooltip("settings")}
									onMouseLeave={() => setHoveredTooltip(null)}
								>
									<Settings className="h-5 w-5" />
									{hoveredTooltip === "settings" && (
										<div className="absolute left-1/2 -translate-x-1/2 top-full mt-4 z-50 px-3 py-1 text-neutral-300 text-xs shadow-lg duration-200 whitespace-nowrap rounded-xl">
											{t("sidebar.tooltips.settings")}
										</div>
									)}
								</Link>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
