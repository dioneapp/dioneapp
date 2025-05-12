import { createContext, useContext, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { getCurrentPort } from "@renderer/utils/getPort";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@renderer/utils/useToast";

interface AppContextType {
    setInstalledApps: React.Dispatch<React.SetStateAction<string[]>>;
    installedApps: string[];
    socket: any;
    logs: string[];
    setLogs: React.Dispatch<React.SetStateAction<string[]>>;
    statusLog: {
        status: string;
        content: string;
    };
    setStatusLog: React.Dispatch<React.SetStateAction<{
        status: string;
        content: string;
    }>>;
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
	setShow: React.Dispatch<React.SetStateAction<string>>;
	show: string;
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function GlobalContext({ children }: { children: React.ReactNode }) {
	const [exitRef, setExitRef] = useState<boolean>(false);
	const pathname = useLocation().pathname;
    const [installedApps, setInstalledApps] = useState<string[]>([]);
    const [socket, setSocket] = useState<any>(null);
    const [logs, setLogs] = useState<string[]>([]);
    const [statusLog, setStatusLog] = useState<{
        status: string;
        content: string;
    }>({ status: "", content: "" });
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
	const [show, setShow] = useState("actions");

	const isLocalAvailable = async (port) => {
		try {
			const response = await fetch(`http://localhost:${port}`);
			if (response.status !== 200) {
				return false;
			}
			return true;
		} catch (error) {
			return false;
		}
	};
	const stopCheckingRef = useRef(false);
	const loadIframe = async (localPort) => {
		stopCheckingRef.current = false;

		let isAvailable = false;
		while (!isAvailable && !stopCheckingRef.current) {
			isAvailable = await isLocalAvailable(localPort);
			if (!isAvailable && !stopCheckingRef.current) {
				await new Promise((resolve) => setTimeout(resolve, 1000));
			}
		}

		if (isAvailable && !stopCheckingRef.current) {
			setIframeSrc(`http://localhost:${localPort}`);
			setShow("iframe");
			setIframeAvailable(true);
			showToast("default", `${data.name} has opened a preview.`);
			window.electron.ipcRenderer.invoke(
				"notify",
				"Preview...",
				`${data.name} has opened a preview.`,
			);
		}
	};

	useEffect(() => {
		let socket: any = null;

		async function setupSocket() {
			try {
				const port = await getCurrentPort();
				socket = io(`http://localhost:${port}`);

				socket.on("clientUpdate", (message: string) => {
					console.log("Received log:", message);
					setLogs((prevLogs) => [...prevLogs, message]);
				});

				socket.on("connect", () => {
					console.log("Connected to socket:", socket.id);
					setLogs((prevLogs) => [...prevLogs, "Connected to server"]);
				});

				socket.on("disconnect", () => {
					console.log("Socket disconnected");
					setLogs((prevLogs) => [...prevLogs, "Disconnected from server"]);
				});

				socket.on("missingDeps", (data) => {
					setMissingDependencies(data);
				});

				socket.on(
					"installUpdate",
					(message: { type: string; content: string; status: string }) => {
						const { type, status, content } = message;
						console.log("Received log:", message);
						if (content.toLowerCase().includes("error") || status === "error") {
							errorRef.current = true;
						}
						// launch iframe if server is running
						if (
							(type === "log" &&
								content.toLowerCase().includes("started server")) ||
							content.toLowerCase().includes("http") ||
							content.toLowerCase().includes("127.0.0.1") ||
							content.toLowerCase().includes("localhost") ||
							content.toLowerCase().includes("0.0.0.0")
						) {
							loadIframe(Number.parseInt(content));
						}
						if (type === "log") {
							setLogs((prevLogs) => [...prevLogs, content]);
							if (content.includes("Cant kill process")) {
								showToast(
									"error",
									"Error stopping script, please try again later or do it manually.",
								);
							}
						}
						if (type === "status") {
							setStatusLog({ status: status || "pending", content });
							if (
								content.toLowerCase().includes("actions executed") &&
								!errorRef.current
							) {
								console.log("Redirecting...");
								window.location.reload();
							}
						}
						if (type === "catch") {
							setIframeAvailable(false);
							loadIframe(Number.parseInt(content));
							setCatchPort(Number.parseInt(content));
						}

						if (content === "Script killed successfully" && !errorRef.current) {
							console.log("Redirecting...");
							showToast(
								"success",
								`${data.name || "Script"} exited successfully.`,
							);
						}
					},
				);
			} catch (error) {
				setError(true);
				console.error("Error setting up socket:", error);
				setLogs((prevLogs) => [...prevLogs, "Error setting up socket"]);
			}
		}

		setupSocket();
		return () => {
			if (socket) {
				socket.disconnect();
			}
		};
	}, []);

	useEffect(() => {
		if (!pathname.includes('/install') && isServerRunning) {
			showToast("default", "There is an application running in the background.", "true", true, "Return", () => {
				navigate(`/install/${data.id} `);
			});
		}
	}, [pathname.includes('/install'), isServerRunning]);

    return (
        <AppContext.Provider value={{ 
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
			setExitRef
        }}>
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
