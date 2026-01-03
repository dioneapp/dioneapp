import { useAuthContext } from "@/components/contexts/auth-context";
import { useScriptsContext } from "@/components/contexts/scripts-context";
import GeneratedIcon from "@/components/icons/generated-icon";
import Icon from "@/components/icons/icon";
import { Button, IconButton, Modal, ModalBody } from "@/components/ui";
import { useTranslation } from "@/translations/translation-context";
import { apiFetch } from "@/utils/api";
import { openLink } from "@/utils/open-link";
import {
	DndContext,
	PointerSensor,
	closestCenter,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	arrayMove,
	horizontalListSortingStrategy,
	useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
	Camera,
	Home,
	Library,
	Maximize,
	Minimize as Minimize2,
	Minus,
	Settings,
	User,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function TopbarNav() {
	const { t } = useTranslation();
	const { user, loading } = useAuthContext();
	const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);
	const { activeApps, handleStopApp, isServerRunning, setExitRef } =
		useScriptsContext();
	const [avatarError, setAvatarError] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [isMaximized, setIsMaximized] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const location = useLocation();

	// detect macOS via preload-exposed platform
	const isMac =
		typeof window !== "undefined" && (window as any).platform === "darwin";

	useEffect(() => {
		const ipc = (window as any)?.electron?.ipcRenderer;
		if (!ipc) return;

		const syncFullscreenState = async () => {
			try {
				const fullscreen = await ipc.invoke("app:is-fullscreen");
				setIsFullscreen(!!fullscreen);
			} catch (error) {
				console.error("Failed to get fullscreen state", error);
			}
		};

		const handleFullscreenChange = (_event: any, fullscreen: boolean) => {
			setIsFullscreen(!!fullscreen);
		};

		syncFullscreenState();
		ipc.on("app:fullscreen-changed", handleFullscreenChange);

		return () => {
			ipc.removeListener("app:fullscreen-changed", handleFullscreenChange);
		};
	}, []);

	const [tabOrder, setTabOrder] = useState(() =>
		activeApps.filter((app) => app.appId !== "ollama").map((app) => app.appId),
	);

	useEffect(() => {
		setTabOrder((prevOrder) => {
			const currentIds = activeApps
				.filter((app) => app.appId !== "ollama")
				.map((app) => app.appId);
			return currentIds
				.filter((id) => prevOrder.includes(id))
				.concat(currentIds.filter((id) => !prevOrder.includes(id)));
		});
	}, [activeApps]);

	function handleDragEnd(event: any) {
		const { active, over } = event;
		if (active.id !== over?.id) {
			setTabOrder((items) => {
				const oldIndex = items.indexOf(active.id);
				const newIndex = items.indexOf(over.id);
				return arrayMove(items, oldIndex, newIndex);
			});
		}
	}

	const sensors = useSensors(useSensor(PointerSensor));

	function SortableTab({ app }: { app: any }) {
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
				className="relative group"
			>
				<Link
					to={{
						pathname: `/install/${app.isLocal ? app.data?.name : app.appId}`,
						search: `?isLocal=${app.isLocal}`,
					}}
					className="flex items-center gap-1.5 bg-white/10 rounded-xl px-2 py-0.75 hover:bg-white/15 transition-colors shrink-0 focus:outline-none"
					style={{ textDecoration: "none" }}
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
				</Link>
				<IconButton
					onClick={() => stopApp(app.appId, app.data?.name || app.appId)}
					variant="ghost"
					size="xs"
					className="ml-2 mr-2 absolute right-0 top-1/2 -translate-y-1/2 text-white hover:text-red-400 hover:bg-red-500/20"
					style={{ zIndex: 2 }}
					icon={<X className="h-3 w-3" />}
				/>
				{hoveredTooltip === app.appId && (
					<div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 px-3 py-0.75 bg-black/90 text-white text-xs shadow-lg backdrop-blur-3xl whitespace-nowrap rounded-xl">
						{app?.data?.name || app.appId}
					</div>
				)}
			</div>
		);
	}

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

	const macTrafficPadding =
		isMac && !isFullscreen
			? "calc(env(safe-area-inset-left, 0px) + 72px)"
			: undefined;
	const macNavOffset = isMac && !isFullscreen ? 12 : undefined;

	return (
		<>
			<Modal isOpen={showModal} onClose={() => setShowModal(false)}>
				<ModalBody>
					<div className="flex flex-col items-center justify-center py-8">
						<h1 className="text-4xl font-semibold mb-4">
							{t("titlebar.closing.title")}
						</h1>
						<p className="text-neutral-400 text-balance text-center max-w-xl">
							{t("titlebar.closing.description")}
						</p>
					</div>
				</ModalBody>
			</Modal>
			<div className="w-full flex flex-col bg-black/20 backdrop-blur-xl border-b border-white/10 relative mb-0 pb-0">
				{/* First Row: Main Navigation + Window Controls */}
				<div
					className="flex items-center px-4 gap-4 h-10 relative overflow-hidden"
					id="titlebar"
					style={{
						// Leave room for macOS traffic lights
						paddingLeft: macTrafficPadding,
					}}
				>
					{/* Logo/Brand */}
					<Link
						to="/"
						className="flex items-center gap-2 absolute z-10 shrink-0"
						id="no-draggable"
						style={{
							position: "absolute",
							left: "50%",
							top: "50%",
							transform: "translate(-50%, -50%)",
						}}
					>
						<Icon name="Dio" className="w-5 h-5" />
						<span className="text-sm font-semibold text-neutral-200">
							Dione
						</span>
					</Link>

					{/* Navigation Links */}
					<div
						className="flex items-center gap-2 flex-1 relative z-10"
						style={{ paddingLeft: macNavOffset }}
					>
						<Link
							to="/"
							id="no-draggable"
							className={`px-3 py-1.5 rounded-xl transition-all duration-200 flex items-center gap-2 text-sm shrink-0 ${isActivePath("/")
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
							className={`px-3 py-1.5 rounded-xl transition-all duration-200 flex items-center gap-2 text-sm shrink-0 ${isActivePath("/library")
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
							<div className="flex items-center gap-1 px-2 py-0.75 bg-white/10 rounded-xl">
								<div className="h-2 w-2 rounded-xl bg-green-500 animate-pulse" />
								<span className="text-xs text-neutral-400">
									{activeApps.length}{" "}
									{activeApps.length === 1
										? t("sidebar.app")
										: t("sidebar.apps")}{" "}
									{t("sidebar.running")}
								</span>
							</div>
						)}
						<IconButton
							id="no-draggable"
							onClick={() => window.captureScreenshot()}
							variant="ghost"
							size="sm"
							icon={<Camera className="h-4 w-4" />}
							className="relative"
							onMouseEnter={() => setHoveredTooltip("capture")}
							onMouseLeave={() => setHoveredTooltip(null)}
						></IconButton>

						<Link to="/settings">
							<IconButton
								id="no-draggable"
								variant="ghost"
								size="sm"
								icon={<Settings className="h-4 w-4" />}
								className="relative"
								onMouseEnter={() => setHoveredTooltip("settings")}
								onMouseLeave={() => setHoveredTooltip(null)}
							></IconButton>
						</Link>

						{/* User Section */}
						{user && (
							<Link
								to="/account"
								id="no-draggable"
								className="flex items-center gap-2 p-1.5 hover:bg-white/10 rounded-xl transition-colors"
							>
								{!avatarError ? (
									<img
										src={user.avatar_url}
										alt={user.username}
										className="h-6 w-6 rounded-xl"
										onError={() => setAvatarError(true)}
									/>
								) : (
									<div className="h-6 w-6 rounded-xl bg-white/20 flex items-center justify-center">
										<User className="h-4 w-4" />
									</div>
								)}
								<span className="text-sm text-neutral-300">
									{user.username}
								</span>
							</Link>
						)}

						{!loading && !user && (
							<Button
								id="no-draggable"
								variant="primary"
								size="sm"
								className="bg-white hover:bg-white/90 text-black font-medium flex items-center gap-2"
								onClick={() =>
									openLink("https://getdione.app/auth/login?app=true")
								}
							>
								<User className="h-4 w-4" />
								{t("sidebar.tooltips.login")}
							</Button>
						)}

						{/* Separator + window controls - hidden on macOS (native traffic lights show) */}
						{!isMac && (
							<>
								<div className="h-6 w-px bg-white/10 mx-2" />
								<div id="no-draggable">
									<IconButton
										onClick={handleMinimize}
										variant="ghost"
										size="icon-sm"
										className="text-white hover:text-white hover:bg-white/10"
										icon={<Minus className="h-4 w-4" />}
									/>
								</div>
								<div id="no-draggable">
									<IconButton
										onClick={handleMaximize}
										variant="ghost"
										size="icon-sm"
										className="text-white hover:text-white hover:bg-white/10"
										icon={
											isMaximized ? (
												<Minimize2 className="h-3.5 w-3.5" />
											) : (
												<Maximize className="h-3.5 w-3.5" />
											)
										}
									/>
								</div>
								<div id="no-draggable">
									<IconButton
										onClick={handleClose}
										variant="ghost"
										size="icon-sm"
										className="hover:bg-red-500/20 hover:text-red-400 text-white"
										icon={<X className="h-4 w-4" />}
									/>
								</div>
							</>
						)}
					</div>
				</div>

				{/* Second Row: Active Apps */}
				{activeApps.length > 0 && (
					<div
						className="flex items-center px-4 gap-2 h-10 border-t border-white/5"
						id="no-draggable"
						style={{
							paddingLeft: macTrafficPadding,
						}}
					>
						<div className="flex items-center gap-2 flex-1 overflow-x-hidden">
							<DndContext
								sensors={sensors}
								collisionDetection={closestCenter}
								onDragEnd={handleDragEnd}
							>
								<SortableContext
									items={tabOrder}
									strategy={horizontalListSortingStrategy}
								>
									{tabOrder
										.map((id) => activeApps.find((a: any) => a.appId === id))
										.filter(Boolean)
										.map((app: any) => (
											<SortableTab key={app.appId} app={app} />
										))}
								</SortableContext>
							</DndContext>
						</div>
					</div>
				)}
			</div >
		</>
	);
}
