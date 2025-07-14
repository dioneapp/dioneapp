import { getCurrentPort } from "@renderer/utils/getPort";
import { useToast } from "@renderer/utils/useToast";
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
import type { ScriptsContextType } from "./types/context-types";

const AppContext = createContext<ScriptsContextType | undefined>(undefined);

export function ScriptsContext({ children }: { children: React.ReactNode }) {
	// socket ref
	const [sockets, setSockets] = useState<
		Record<string, { socket: Socket; isLocal?: boolean }>
	>({}); // multiple sockets
	const socketsRef = useRef<{
		[key: string]: { socket: Socket; isLocal?: boolean };
	}>({});
	const socketRef = useRef<any>(null);
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
	// iframe stuff
	const [catchPort, setCatchPort] = useState<number>();
	const [iframeSrc, setIframeSrc] = useState<string>("");
	const [iframeAvailable, setIframeAvailable] = useState<boolean>(false);
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

	useEffect(() => {
		setData(null);
	}, [pathname]);

	// if app is active show logs instead of actions
	useEffect(() => {
		if (!data?.id || !Array.isArray(activeApps)) return;

		const isActive = activeApps.some((app) => app.appId === data.id);
		console.log("app is active?:", isActive);

		if (isActive) {
			setShow({ [data?.id]: "logs" });
		}
	}, [activeApps, data?.id]);

	const handleReloadQuickLaunch = async () => {
		try {
			const port = await getCurrentPort();

			// get all installed apps
			const installedResponse = await fetch(
				`http://localhost:${port}/scripts/installed`,
			);
			if (!installedResponse.ok) {
				throw new Error("Failed to fetch installed apps");
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
						const dbResponse = await fetch(
							`http://localhost:${port}/db/search/name/${encodeURIComponent(appName)}`,
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
						const localResponse = await fetch(
							`http://localhost:${port}/local/get/${encodeURIComponent(appName)}`,
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
			showToast("error", "Failed to reload quick launch apps");
		}
	};

	const isLocalAvailable = async (port: number): Promise<boolean> => {
		try {
			await fetch(`http://localhost:${port}`, {
				method: "GET",
				mode: "no-cors",
			});
			return true;
		} catch (error) {
			console.log("Port is not available", error);
			return false;
		}
	};

	const stopCheckingRef = useRef(true);
	const loadIframe = async (localPort: number) => {
		let isAvailable = false;
		while (!isAvailable) {
			isAvailable = await isLocalAvailable(localPort);
			if (!isAvailable) {
				if (stopCheckingRef.current === true) {
					break;
				}
				await new Promise((resolve) => setTimeout(resolve, 1000));
			}
		}
		if (isAvailable) {
			stopCheckingRef.current = true;
			setIframeSrc(`http://localhost:${localPort}`);
			setShow({ [data?.id]: "iframe" });
			setIframeAvailable(true);
			showToast("default", `${data.name} has opened a preview.`);
			window.electron.ipcRenderer.invoke(
				"notify",
				"Preview...",
				`${data.name} has opened a preview.`,
			);
		}
	};

	async function connectApp(appId: string, isLocal?: boolean) {
		if (socketsRef.current[appId]) return;

		const port = await getCurrentPort();
		const newSocket = setupSocket({
			appId,
			addLog,
			port,
			setMissingDependencies,
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
		});
		socketsRef.current[appId] = {
			socket: newSocket,
			isLocal,
		};
		setSockets({ ...socketsRef.current });
	}

	function disconnectApp(appId: string) {
		const socketToClose = socketsRef.current[appId];
		if (!socketToClose) return;

		socketToClose.socket.disconnect();
		delete socketsRef.current[appId];
		setSockets({ ...socketsRef.current });

		setActiveApps((prev) => {
			const filtered = prev.filter((app) => app.appId !== appId);
			return filtered;
		});
	}

	// multiple logs
	const addLog = useCallback((appId: string, message: string) => {
		setLogs((prevLogs) => ({
			...prevLogs,
			[appId]: [...(prevLogs[appId] || []), message],
		}));
	}, []);

	const clearLogs = useCallback((appId: string) => {
		setLogs((prevLogs) => ({ ...prevLogs, [appId]: [] }));
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
			const port = await getCurrentPort();

			// get app info
			Promise.all(
				appIds.map((appId) => {
					const isLocal = sockets[appId]?.isLocal || false;
					const url = isLocal
						? `http://localhost:${port}/local/get_id/${encodeURIComponent(appId)}`
						: `http://localhost:${port}/db/search/${encodeURIComponent(appId)}`;

					return fetch(url)
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
			).then((results) => {
				setActiveApps(results);
			});
		}
		fetchAppInfo();
	}, [sockets]);

	useEffect(() => {
		if (!pathname.includes("/install") && isServerRunning[data?.id]) {
			showToast(
				"default",
				"There is an application running in the background.",
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
			const port = await getCurrentPort();
			const response = await fetch(
				`http://localhost:${port}/scripts/stop/${appName}/${appId}`,
				{
					method: "GET",
				},
			);

			if (response.status === 200) {
				setShow({ [appId]: "actions" });
				window.electron.ipcRenderer.invoke(
					"notify",
					"Stopping...",
					`${appName} stopped successfully.`,
				);
				showToast("success", `Successfully stopped ${appName}`);
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
			addLog(appId, `Error stopping ${appName}: ${error}`);
		} finally {
			disconnectApp(appId);
			setAppFinished({ [appId]: false });
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
				clearLogs,
				getAllAppLogs,
				appFinished,
				setAppFinished,
				loadIframe,
				setLocalApps,
				localApps,
				setNotSupported,
				notSupported,
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
