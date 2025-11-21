import { useTranslation } from "@/translations/translation-context";
import { apiFetch, getBackendPort } from "@/utils/api";
import { TerminalNormalizer } from "@/utils/terminal";
import { useToast } from "@/utils/use-toast";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Socket } from "socket.io-client";
import { setupSocket } from "./scripts/setup-socket";
import type {
	DependencyDiagnosticsState,
	ProgressState,
	ScriptsContextType,
} from "./types/context-types";

const AppContext = createContext<ScriptsContextType | undefined>(undefined);

export function ScriptsContext({ children }: { children: React.ReactNode }) {
	const { t } = useTranslation();
	// socket ref
	const [sockets, setSockets] = useState<
		Record<string, { socket: Socket; isLocal?: boolean }>
	>({}); // multiple sockets
	const socketsRef = useRef<{
		[key: string]: { socket: Socket; isLocal?: boolean };
	}>({});
	const connectingRef = useRef<Record<string, Promise<void> | null>>({});
	const socketRef = useRef<any>(null);
	const terminalStatesRef = useRef<Record<string, TerminalNormalizer>>({});
	const [exitRef, setExitRef] = useState<boolean>(false);
	const pathname = useLocation().pathname;
	const [installedApps, setInstalledApps] = useState<string[]>([]);
	const [socket] = useState<any>(null);
	const [logs, setLogs] = useState<Record<string, string[]>>({});
	const [statusLog, setStatusLog] = useState<
		Record<string, { status: string; content: string }>
	>({});
	const [isServerRunning, setIsServerRunning] = useState<
		Record<string, boolean>
	>({});
	// toast stuff
	const { addToast } = useToast();
	const showToast = (
		variant: "default" | "success" | "error" | "warning",
		message: string,
		fixed?: "true" | "false",
		button?: boolean,
		buttonText?: string,
		buttonAction?: () => void,
		removeAfter?: number,
	) => {
		addToast({
			variant,
			children: message,
			fixed,
			button,
			buttonText,
			buttonAction,
			removeAfter,
		});
	};
	// navegation stuff
	const navigate = useNavigate();
	// errors stuff
	const [error, setError] = useState<boolean>(false);
	const errorRef = useRef(false);
	useEffect(() => {
		if (error === true) {
			showToast(
				"error",
				"We are having connection problems, please try again later.",
				"true",
			);
		}
	}, [error]);
	// missing dependencies stuff
	const [missingDependencies, setMissingDependencies] = useState<any>();
	const [dependencyDiagnostics, setDependencyDiagnostics] =
		useState<DependencyDiagnosticsState>({});
	// iframe stuff
	const [catchPort, setCatchPort] = useState<Record<string, number>>({});
	const [iframeSrc, setIframeSrc] = useState<Record<string, string>>({});
	const [iframeAvailable, setIframeAvailable] = useState<
		Record<string, boolean>
	>({});
	// data stuff
	const [data, setData] = useState<any | undefined>(undefined);
	// show
	const [show, setShow] = useState<Record<string, string>>({});
	// sidebar
	const [apps, setApps] = useState<any[]>([]);
	const [localApps, setLocalApps] = useState<any[]>([]);
	// delete logs
	const [deleteLogs, setDeleteLogs] = useState<any[]>([]);
	// active apps
	const [activeApps, setActiveApps] = useState<any[]>([]);
	const [removedApps, setRemovedApps] = useState<any[]>(() => {
		const stored = localStorage.getItem("quickLaunchRemovedApps");
		return stored ? JSON.parse(stored) : [];
	});
	const [availableApps, setAvailableApps] = useState<any[]>([]);
	const [appFinished, setAppFinished] = useState<{ [key: string]: boolean }>(
		{},
	);
	// not supported stuff
	const [notSupported, setNotSupported] = useState<
		Record<string, { reasons: string[] }>
	>({});
	// autoopen
	const [wasJustInstalled, setWasJustInstalled] = useState<boolean>(false);
	// progress state
	const [progress, setProgress] = useState<Record<string, ProgressState>>({});

	useEffect(() => {
		setData(null);
	}, [pathname]);

	// if app is active show logs instead of actions
	useEffect(() => {
		if (!data?.id || !Array.isArray(activeApps)) return;

		const isActive = activeApps.some((app) => app.appId === data.id);
		console.log("app is active?:", isActive);

		const currentView = show[data.id];
		if (
			isActive &&
			currentView !== "logs" &&
			currentView !== "iframe" &&
			currentView !== "editor"
		) {
			setShow({ [data.id]: "logs" });
		}
	}, [activeApps, data?.id, show]);

	const handleReloadQuickLaunch = async () => {
		try {
			// get all installed apps
			const installedResponse = await apiFetch("/scripts/installed");
			if (!installedResponse.ok) {
				throw new Error(t("runningApps.failedToFetchInstalledApps"));
			}

			const installedData = await installedResponse.json();
			const installedAppNames = Array.isArray(installedData?.apps)
				? installedData.apps
				: [];

			// get details of each app
			const appDetailsPromises = installedAppNames
				.slice(0, 6)
				.map(async (appName: string) => {
					try {
						const existingLocalApp = localApps.find(
							(app) => app.name?.toLowerCase() === appName.toLowerCase(),
						);
						if (existingLocalApp) {
							return {
								...existingLocalApp,
							};
						}

						// try to get from db
						const dbResponse = await apiFetch(
							`/db/search/name/${encodeURIComponent(appName)}`,
						);

						if (dbResponse.ok) {
							const dbData = await dbResponse.json();
							const appData = Array.isArray(dbData) ? dbData[0] : dbData;

							if (appData) {
								return {
									...appData,
									isLocal: false,
								};
							}
						}

						// if not in db, assume it's local
						const localResponse = await apiFetch(
							`/local/get_app/${encodeURIComponent(appName)}`,
						);

						if (localResponse.ok) {
							const localData = await localResponse.json();
							const addIsLocal = {
								...localData,
								isLocal: true,
							};
							setLocalApps((prev) => [...prev, addIsLocal]);
							return addIsLocal;
						}

						console.warn(`No details found for ${appName}`);
						return null;
					} catch (error) {
						console.error(`Error getting details of ${appName}:`, error);
						return null;
					}
				});
			const results = (await Promise.all(appDetailsPromises)).filter(
				(app): app is NonNullable<typeof app> =>
					app !== null && typeof app === "object" && "name" in app,
			);
			setAvailableApps(results);
			setInstalledApps(installedAppNames.map((name) => ({ name })));
			setApps(
				results
					.filter(
						(app) => !removedApps.some((removed) => removed.id === app.id),
					)
					.slice(0, 6),
			);
		} catch (error) {
			console.error("Error in handleReloadQuickLaunch:", error);
			showToast("error", t("runningApps.failedToReloadQuickLaunch"));
		}
	};

	const isLocalAvailable = async (port: number): Promise<boolean> => {
		try {
			const response = await fetch(`http://localhost:${port}`, {
				method: "GET",
			});
			if (response.ok) {
				return true;
			}
			return false;
		} catch (error: any) {
			console.log("Port is not available", error);
			return false;
		}
	};

	const stopCheckingRef = useRef(true);
	const isLoadingIframeRef = useRef(false);
	const loadIframe = async (localPort: number) => {
		if (stopCheckingRef.current || isLoadingIframeRef.current) return;

		stopCheckingRef.current = false;
		isLoadingIframeRef.current = true;

		let isAvailable = false;
		while (!isAvailable) {
			isAvailable = await isLocalAvailable(localPort);
			if (!isAvailable) {
				await new Promise((resolve) => setTimeout(resolve, 1000));
			}
		}
		if (isAvailable) {
			stopCheckingRef.current = true;
			setIframeSrc((prev) => ({
				...prev,
				[data?.id]: `http://localhost:${localPort}`,
			}));
			setShow({ [data?.id]: "iframe" });
			setIframeAvailable((prev) => ({ ...prev, [data?.id]: true }));
			showToast("default", `${data.name || "Script"} has opened a preview.`);
			window.electron.ipcRenderer.invoke(
				"notify",
				"Preview...",
				`${data.name} has opened a preview.`,
			);
		}

		isLoadingIframeRef.current = false;
	};

	async function connectApp(appId: string, isLocal?: boolean) {
		// reuse existing connection attempt
		if (connectingRef.current[appId]) {
			return connectingRef.current[appId];
		}

		const connectPromise = (async () => {
			const existing = socketsRef.current[appId];
			if (existing && existing.socket) {
				try {
					// already fully connected -> nothing to do
					if (existing.socket.connected) {
						return;
					}
					// try reconnecting existing socket
					if (typeof existing.socket.connect === "function") {
						console.log(`Reconnecting socket for ${appId}...`);
						existing.socket.connect();
						setSockets({ ...socketsRef.current });
						// wait for connection or timeout
						await new Promise<void>((resolve) => {
							const to = setTimeout(() => {
								console.warn(`Timeout waiting for socket ${appId} to connect`);
								resolve();
							}, 2000);
							existing.socket.once("connect", () => {
								clearTimeout(to);
								resolve();
							});
						});
						if (existing.socket.connected) return;
					}
				} catch (err) {
					console.warn("Reconnect attempt failed, will recreate socket:", err);
				}

				// cleanup dead socket
				try {
					if (
						existing.socket &&
						typeof existing.socket.disconnect === "function"
					) {
						existing.socket.disconnect();
					}
				} catch (e) {
					/* ignore */
				}
				delete socketsRef.current[appId];
				setSockets({ ...socketsRef.current });
			}

			const port = await getBackendPort();
			const newSocket = setupSocket({
				appId,
				addLog,
				port,
				setMissingDependencies,
				setDependencyDiagnostics,
				setIframeAvailable,
				setCatchPort,
				loadIframe,
				setIframeSrc,
				errorRef,
				showToast,
				stopCheckingRef,
				statusLog,
				setStatusLog,
				setDeleteLogs,
				data,
				socketsRef,
				setAppFinished,
				setNotSupported,
				setWasJustInstalled,
				setProgress,
			});
			socketsRef.current[appId] = {
				socket: newSocket,
				isLocal,
			};
			setSockets({ ...socketsRef.current });
		})();

		connectingRef.current[appId] = connectPromise;
		try {
			await connectPromise;
		} finally {
			connectingRef.current[appId] = null;
		}
	}

	function disconnectApp(appId: string) {
		const socketToClose = socketsRef.current[appId];
		if (!socketToClose) return;

		socketToClose.socket.disconnect();
		delete socketsRef.current[appId];
		setSockets({ ...socketsRef.current });
		// clear any pending connection promise so future connects start fresh
		connectingRef.current[appId] === null;

		setDependencyDiagnostics((prev) => {
			if (!prev[appId]) return prev;
			const next = { ...prev };
			delete next[appId];
			return next;
		});

		setActiveApps((prev) => {
			const filtered = prev.filter((app) => app.appId !== appId);
			return filtered;
		});
	}

	// multiple logs
	const addLog = useCallback((appId: string, message: string) => {
		if (!terminalStatesRef.current[appId]) {
			terminalStatesRef.current[appId] = new TerminalNormalizer();
		}
		const normalizer = terminalStatesRef.current[appId];
		normalizer.feed(message);
		const newLines = normalizer.getRenderableLines();
		setLogs((prevLogs) => ({
			...prevLogs,
			[appId]: newLines,
		}));
	}, []);

	const addLogLine = useCallback((appId: string, message: string) => {
		if (!terminalStatesRef.current[appId]) {
			terminalStatesRef.current[appId] = new TerminalNormalizer();
		}
		const normalizer = terminalStatesRef.current[appId];
		normalizer.feed(message + "\n");
		const newLines = normalizer.getRenderableLines();
		setLogs((prevLogs) => ({
			...prevLogs,
			[appId]: newLines,
		}));
	}, []);

	const clearLogs = useCallback((appId: string) => {
		setLogs((prevLogs) => ({ ...prevLogs, [appId]: [] }));
		if (terminalStatesRef.current[appId]) {
			terminalStatesRef.current[appId].clear();
			delete terminalStatesRef.current[appId];
		}
		setStatusLog((prevStatusLog) => ({
			...prevStatusLog,
			[appId]: { status: "", content: "" },
		}));
	}, []);

	const getAllAppLogs = useCallback(() => {
		return Object.values(logs).flat();
	}, [logs]);

	// get info about active apps
	useEffect(() => {
		async function fetchAppInfo() {
			const appIds = Object.keys(sockets);
			if (appIds.length === 0) return;

			// get app info
			Promise.all(
				appIds
					.filter((appId) => appId !== "ollama")
					.map((appId) => {
						const isLocal = sockets[appId]?.isLocal || false;
						const endpoint = isLocal
							? `/local/get_id/${encodeURIComponent(appId)}`
							: `/db/search/${encodeURIComponent(appId)}`;

						return apiFetch(endpoint)
							.then((res) => {
								if (!res.ok) throw new Error(`Error getting app info ${appId}`);
								return res.json();
							})
							.then((data) => ({
								appId,
								data,
								isLocal,
							}))
							.catch((error) => {
								console.error(error);
								return {
									appId,
									data: null,
									isLocal,
								};
							});
					}),
			)
				.then((results) => {
					setActiveApps(results);
				})
				.catch((error) => {
					console.error("Error fetching app info for active apps:", error);
				});
		}
		fetchAppInfo();
	}, [sockets]);

	useEffect(() => {
		if (!pathname.includes("/install") && isServerRunning[data?.id]) {
			showToast(
				"default",
				t("runningApps.thereIsAnAppRunningInBackground"),
				"false",
				true,
				"Return",
				() => {
					navigate(
						`/install/${
							sockets[data.id]?.isLocal
								? encodeURIComponent(data.name)
								: data.id
						}?isLocal=${sockets[data.id]?.isLocal}`,
					);
				},
				5000,
			);
		}
	}, [pathname.includes("/install"), isServerRunning[data?.id]]);

	const handleStopApp = async (appId: string, appName: string) => {
		try {
			const response = await apiFetch(
				`/scripts/stop/${appName}/${appId}/${catchPort[appId]}`,
				{
					method: "GET",
				},
			);

			if (response.status === 200) {
				setShow({ [appId]: "actions" });
				if (!wasJustInstalled) {
					window.electron.ipcRenderer.invoke(
						"notify",
						"Stopping...",
						`${appName} stopped successfully.`,
					);
					showToast("success", `Successfully stopped ${appName}`);
				}
				clearLogs(appId);
				setIsServerRunning((prev) => ({ ...prev, [appId]: false }));
			} else {
				showToast("error", `Error stopping ${appName}: ${response.status}`);
			}
		} catch (error) {
			showToast("error", `Error stopping ${appName}: ${error}`);
			window.electron.ipcRenderer.invoke(
				"notify",
				"Error...",
				`Error stopping ${appName}: ${error}`,
			);
			addLogLine(appId, `Error stopping ${appName}: ${error}`);
		} finally {
			disconnectApp(appId);
			setAppFinished({ [appId]: false });
			handleReloadQuickLaunch();
		}
	};

	useEffect(() => {
		localStorage.setItem("quickLaunchRemovedApps", JSON.stringify(removedApps));
	}, [removedApps]);

	return (
		<AppContext.Provider
			value={{
				setInstalledApps,
				installedApps,
				socket,
				logs,
				setLogs,
				statusLog,
				setStatusLog,
				isServerRunning,
				setIsServerRunning,
				data,
				setData,
				error,
				setError,
				setIframeAvailable,
				iframeAvailable,
				setMissingDependencies,
				missingDependencies,
				dependencyDiagnostics,
				setDependencyDiagnostics,
				setShow,
				show,
				showToast,
				stopCheckingRef,
				iframeSrc,
				setIframeSrc,
				catchPort,
				setCatchPort,
				exitRef,
				setExitRef,
				apps,
				setApps,
				socketRef,
				deleteLogs,
				handleReloadQuickLaunch,
				removedApps,
				setRemovedApps,
				availableApps,
				setAvailableApps,
				connectApp,
				disconnectApp,
				sockets,
				activeApps,
				handleStopApp,
				addLog,
				addLogLine,
				clearLogs,
				getAllAppLogs,
				appFinished,
				setAppFinished,
				loadIframe,
				setLocalApps,
				localApps,
				setNotSupported,
				notSupported,
				wasJustInstalled,
				setWasJustInstalled,
				progress,
				setProgress,
			}}
		>
			{children}
		</AppContext.Provider>
	);
}

export function useScriptsContext() {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error("Context must be used within an provider");
	}
	return context;
}
