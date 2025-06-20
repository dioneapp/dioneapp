import { getCurrentPort } from "@renderer/utils/getPort";
import { useToast } from "@renderer/utils/useToast";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io, type Socket } from "socket.io-client";
import { setupSocket } from "../contexts/scripts/setupSocket";

interface AppContextType {
	setInstalledApps: React.Dispatch<React.SetStateAction<any[]>>;
	installedApps: any[];
	socket: any;
	logs: Record<string, string[]>;
	setLogs: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
	statusLog: Record<string, { status: string; content: string }>;
	setStatusLog: React.Dispatch<React.SetStateAction<Record<string, { status: string; content: string }>>>;
	isServerRunning: boolean;
	setIsServerRunning: React.Dispatch<React.SetStateAction<boolean>>;
	setData: React.Dispatch<React.SetStateAction<any>>;
	data: any;
	error: boolean;
	setError: React.Dispatch<React.SetStateAction<boolean>>;
	setIframeAvailable: React.Dispatch<React.SetStateAction<boolean>>;
	iframeAvailable: boolean;
	setMissingDependencies: React.Dispatch<React.SetStateAction<any>>;
	missingDependencies: any;
	show: Record<string, string>;
	setShow: React.Dispatch<React.SetStateAction<Record<string, string>>>;
	showToast: (
		variant: "default" | "success" | "error" | "warning",
		message: string,
		fixed?: "true" | "false",
		button?: boolean,
		buttonText?: string,
		buttonAction?: () => void,
	) => void;
	stopCheckingRef: React.MutableRefObject<boolean>;
	iframeSrc: string;
	setIframeSrc: React.Dispatch<React.SetStateAction<string>>;
	catchPort: number | undefined;
	setCatchPort: React.Dispatch<React.SetStateAction<number | undefined>>;
	exitRef: boolean;
	setExitRef: React.Dispatch<React.SetStateAction<boolean>>;
	apps: any[];
	setApps: React.Dispatch<React.SetStateAction<any[]>>;
	socketRef: any;
	deleteLogs: any[];
	handleReloadQuickLaunch: () => Promise<void>;
	removedApps: any[];
	setRemovedApps: React.Dispatch<React.SetStateAction<any[]>>;
	availableApps: any[];
	setAvailableApps: React.Dispatch<React.SetStateAction<any[]>>;
	connectApp: (appId: string) => void;
	disconnectApp: (appId: string) => void;
	sockets: Record<string, Socket>;
	activeApps: any[];
	handleStopApp: (appId: string, appName: string) => void;
	addLog: (appId: string, message: string) => void;
	clearLogs: (appId: string) => void;
	getAllAppLogs: () => string[];
	appFinished: Record<string, boolean>;
	setAppFinished: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
	}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function GlobalContext({ children }: { children: React.ReactNode }) {
	// socket ref
	const [sockets, setSockets] = useState<Record<string, Socket>>({}); // multiple sockets
	const socketsRef = useRef<{ [key: string]: Socket }>({});
	const socketRef = useRef<any>(null);
	const [exitRef, setExitRef] = useState<boolean>(false);
	const pathname = useLocation().pathname;
	const [installedApps, setInstalledApps] = useState<string[]>([]);
	const [socket] = useState<any>(null);
	const [logs, setLogs] = useState<Record<string, string[]>>({});
	const [statusLog, setStatusLog] = useState<Record<string, { status: string; content: string }>>({});
	const [isServerRunning, setIsServerRunning] = useState<boolean>(false);
	// toast stuff
	const { addToast } = useToast();
	const showToast = (
		variant: "default" | "success" | "error" | "warning",
		message: string,
		fixed?: "true" | "false",
		button?: boolean,
		buttonText?: string,
		buttonAction?: () => void,
	) => {
		addToast({
			variant,
			children: message,
			fixed,
			button,
			buttonText,
			buttonAction,
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
	// delete logs
	const [deleteLogs, setDeleteLogs] = useState<any[]>([]);
	// active apps
	const [activeApps, setActiveApps] = useState<any[]>([]);
	const [removedApps, setRemovedApps] = useState<any[]>([]);
	const [availableApps, setAvailableApps] = useState<any[]>([]);
	const [appFinished, setAppFinished] = useState<{ [key: string]: boolean }>({});


	useEffect(() => {
		setData(null);
	}, [pathname]);

	// if app is active show logs instead of actions
	useEffect(() => {
		if (!data?.id || !Array.isArray(activeApps)) return;
	
		const isActive = activeApps.some(app => app.appId === data.id);
		console.log("app is active?:", isActive);
	
		if (isActive) {
			setShow({ [data?.id]: "logs" });
		}
	}, [activeApps, data?.id]);

	const handleReloadQuickLaunch = async () => {
		try {
			const port = await getCurrentPort();
			// get installed apps
			const response = await fetch(
				`http://localhost:${port}/scripts/installed`,
			);
			if (!response.ok) throw new Error("Failed to fetch installed apps");
			const data = await response.json();
			setInstalledApps(data.apps);

			// search data for installed apps
			const results = await Promise.all(
				data.apps
					.slice(0, 6) // maxApps is 6
					.map((app: string) =>
						fetch(`http://localhost:${port}/db/search/name/${app}`).then(
							(res) => (res.ok ? res.json() : []),
						),
					),
			);
			// set available apps
			setAvailableApps(results.flat());
			// set apps
			setApps(
				results
					.flat()
					.filter(
						(app) =>
							!removedApps.find((removedApp) => removedApp.id === app.id),
					)
					.slice(0, 6),
			);
			// setApps(results.flat().slice(0, 6));
		} catch (error) {
			console.error("Error in handleReloadQuickLaunch:", error);
			showToast("error", "Failed to reload quick launch apps");
		}
	};

	const isLocalAvailable = async (port: number) => {
		const socket = io(`http://localhost:${port}`);
		return new Promise<boolean>((resolve) => {
			if (stopCheckingRef.current === true) {
				socket.disconnect();
			}
			socket.on("connect", () => {
				console.log("connected");
				resolve(true);
				socket.disconnect();
			});
			socket.on("connect_error", () => {
				console.log("connect error");
				resolve(true);
				socket.disconnect();
			});
			socket.on("disconnect", () => {
				console.log("disconnect");
				resolve(false);
				socket.disconnect();
			});
			socket.on("error", (error) => {
				console.log("error:", error);
				resolve(false);
			});
			socket.on("disconnect", () => {
				console.log("disconnect");
			});
		});
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

	// async function setupSocket() {
	// 	try {
	// 		if (socketRef.current) {
	// 			socketRef.current.disconnect();
	// 			socketRef.current.removeAllListeners();
	// 			console.log("socketRef.current", socketRef.current);
	// 		}

	// 		const port = await getCurrentPort();
	// 		socketRef.current = io(`http://localhost:${port}`);

	// 		socketRef.current.on("clientUpdate", (message: string) => {
	// 			console.log("Received log:", message);
	// 			setLogs((prevLogs) => [...prevLogs, message]);
	// 		});

	// 		socketRef.current.on("connect", () => {
	// 			console.log("Connected to socket:", socketRef.current?.id);
	// 			setLogs((prevLogs) => [...prevLogs, "Connected to server"]);
	// 		});

	// 		socketRef.current.on("disconnect", () => {
	// 			console.log("Socket disconnected");
	// 			setLogs((prevLogs) => [...prevLogs, "Disconnected from server"]);
	// 		});

	// 		socketRef.current.on("missingDeps", (data) => {
	// 			setMissingDependencies(data);
	// 		});

	// 		socketRef.current.on(
	// 			"installUpdate",
	// 			(message: { type: string; content: string; status: string }) => {
	// 				const { type, status, content } = message;
	// 				console.log("Received log:", message);
	// 				if (content.toLowerCase().includes("error") || status === "error") {
	// 					errorRef.current = true;
	// 				}
	// 				// launch iframe if server is running
	// 				if (
	// 					(type === "log" || type === "info") &&
	// 					(content.toLowerCase().includes("started server") ||
	// 						content.toLowerCase().includes("http") ||
	// 						content.toLowerCase().includes("127.0.0.1") ||
	// 						content.toLowerCase().includes("localhost") ||
	// 						content.toLowerCase().includes("0.0.0.0"))
	// 				) {
	// 					const match = content
	// 						.replace(/\x1b\[[0-9;]*m/g, "")
	// 						.match(
	// 							/(?:https?:\/\/)?(?:localhost|127\.0\.0\.1|0\.0\.0\.0):(\d{2,5})/i,
	// 						);
	// 					console.log(match);
	// 					if (match) {
	// 						loadIframe(Number.parseInt(match[1]));
	// 					}
	// 				}
	// 				if (type === "log") {
	// 					setLogs((prevLogs) => [...prevLogs, content]);
	// 					if (content.includes("Cant kill process")) {
	// 						showToast(
	// 							"error",
	// 							"Error stopping script, please try again later or do it manually.",
	// 						);
	// 					}
	// 				}
	// 				if (type === "status") {
	// 					setStatusLog({ status: status || "pending", content });
	// 					if (content.toLowerCase().includes("actions executed")) {
	// 						console.log("Redirecting...");
	// 						stopCheckingRef.current = true;
	// 						setShow("actions");
	// 					}
	// 				}
	// 				if (type === "catch") {
	// 					stopCheckingRef.current = false;
	// 					setIframeAvailable(false);
	// 					// loadIframe(Number.parseInt(content));
	// 					setCatchPort(Number.parseInt(content));
	// 				}

	// 				if (content === "Script killed successfully" && !errorRef.current) {
	// 					stopCheckingRef.current = true;
	// 					showToast(
	// 						"success",
	// 						`${data?.name || "Script"} exited successfully.`,
	// 					);
	// 				}
	// 			},
	// 		);

	// 		socketRef.current.on("deleteUpdate", (message: string) => {
	// 			console.log("Received log:", message);
	// 			setDeleteLogs((prevLogs) => [...prevLogs, message]);
	// 		});
	// 	} catch (error) {
	// 		setError(true);
	// 		console.error("Error setting up socket:", error);
	// 		setLogs((prevLogs) => [...prevLogs, "Error setting up socket"]);
	// 	}
	// }

	async function connectApp(appId: string) {
		if (socketsRef.current[appId]) return;
	  
		const port = await getCurrentPort();
		const newSocket = setupSocket({appId, addLog, port, setShow, setMissingDependencies, setIframeAvailable, setCatchPort, loadIframe, setIframeSrc, errorRef, showToast, stopCheckingRef, statusLog, setStatusLog, setDeleteLogs, data, socketsRef, setAppFinished});
		socketsRef.current[appId] = newSocket;
		setSockets({ ...socketsRef.current });
	  }
	  

	  function disconnectApp(appId: string) {
		const socketToClose = socketsRef.current[appId];
		if (!socketToClose) return;
	  
		socketToClose.disconnect();
		delete socketsRef.current[appId];
		setSockets({ ...socketsRef.current });
	  
		setActiveApps((prev) => {
		  const filtered = prev.filter((app) => app.appId !== appId);
		  return filtered;
		});
	  }
	  
	// multiple logs
	const addLog = useCallback((appId: string, message: string) => {
		setLogs(prevLogs => ({
		  ...prevLogs,
		  [appId]: [...(prevLogs[appId] || []), message]
		}));
	  }, []);
	  
	const clearLogs = useCallback((appId: string) => {
		setLogs(prevLogs => ({ ...prevLogs, [appId]: [] }));
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
			appIds.map((appId) =>
				fetch(`http://localhost:${port}/db/search/${encodeURIComponent(appId)}`)
				.then((res) => {
					if (!res.ok) throw new Error(`Error getting app info ${appId}`);
					return res.json();
				})
				.then((data) => ({ appId, data }))
				.catch((error) => {
					console.error(error);
					return { appId, data: null };
				})
			)
			).then((results) => {
				console.log(results);
				setActiveApps(results);
			});
		}
		fetchAppInfo();
	  }, [sockets]);

	useEffect(() => {
		if (!pathname.includes("/install") && isServerRunning) {
			showToast(
				"default",
				"There is an application running in the background.",
				"true",
				true,
				"Return",
				() => {
					navigate(`/install/${data.id} `);
				},
			);
		}
	}, [pathname.includes("/install"), isServerRunning]);

	
	const handleStopApp = async (appId: string, appName: string) => {
		try {
		 console.log(appId, appName);
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
			showToast(
			  "success",
			  `Successfully stopped ${appName}`,
			);
			clearLogs(appId);
			setIsServerRunning(false);
		  } else {
			showToast(
			  "error",
			  `Error stopping ${appName}: ${response.status}`,
			);
		  }
		} catch (error) {
		  showToast(
			"error",
			`Error stopping ${appName}: ${error}`,
		  );
		  window.electron.ipcRenderer.invoke(
			"notify",
			"Error...",
			`Error stopping ${appName}: ${error}`,
		  );
		  addLog(appId, `Error stopping ${appName}: ${error}`);	
		} finally {
		 disconnectApp(appId);
		}
	  };

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
			}}
		>
			{children}
		</AppContext.Provider>
	);
}

export function useAppContext() {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error("Context must be used within an provider");
	}
	return context;
}
