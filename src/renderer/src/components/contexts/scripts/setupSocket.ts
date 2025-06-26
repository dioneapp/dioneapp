import { sendDiscordReport } from "@renderer/utils/discordWebhook";
import { type Socket, io as clientIO } from "socket.io-client";

interface SetupSocketProps {
	appId: string;
	addLog: (appId: string, log: string) => void;
	port: number;
	setMissingDependencies: React.Dispatch<React.SetStateAction<any>>;
	setIframeAvailable: React.Dispatch<React.SetStateAction<boolean>>;
	setCatchPort: React.Dispatch<React.SetStateAction<number | undefined>>;
	loadIframe: (port: number) => void;
	setIframeSrc: React.Dispatch<React.SetStateAction<string>>;
	errorRef: React.MutableRefObject<boolean>;
	showToast: (
		variant: "default" | "success" | "error" | "warning",
		message: string,
		fixed?: "true" | "false",
		button?: boolean,
		buttonText?: string,
		buttonAction?: () => void,
	) => void;
	stopCheckingRef: React.MutableRefObject<boolean>;
	statusLog: Record<string, { status: string; content: string }>;
	setStatusLog: React.Dispatch<
		React.SetStateAction<Record<string, { status: string; content: string }>>
	>;
	setDeleteLogs: React.Dispatch<React.SetStateAction<string[]>>;
	data: any;
	socketsRef: React.MutableRefObject<Record<string, Socket>>;
	setAppFinished: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export function setupSocket({
	appId,
	addLog,
	port,
	setMissingDependencies,
	setIframeAvailable,
	setCatchPort,
	loadIframe,
	errorRef,
	showToast,
	stopCheckingRef,
	setStatusLog,
	setDeleteLogs,
	data,
	socketsRef,
	setAppFinished,
}: SetupSocketProps): Socket {
	if (socketsRef.current[appId]) {
		console.log(`Socket [${appId}] already exists`);
		return socketsRef.current[appId];
	}
	const socket = clientIO(`http://localhost:${port}`);
	const settings = JSON.parse(localStorage.getItem("config") || "{}");
	
	socket.on("connect", () => {
		console.log(`Socket [${appId}] connected with ID: ${socket.id}`);
		socket.emit("registerApp", appId);
	});

	socket.on("disconnect", () => {
		console.warn(`Socket [${appId}] disconnected`);
		delete socketsRef.current[appId];
	});

	socket.on("clientUpdate", (message: string) => {
		console.log("Received log:", message);
		addLog(appId, message);
	});

	socket.on("missingDeps", (data) => {
		setMissingDependencies(data);
	});

	socket.on(
		"installUpdate",
		(message: { type: string; content: string; status: string }) => {
			const { type, status, content } = message;
			console.log(`[${appId}] LOG:`, message);
			if (content.toLowerCase().includes("error") || status === "error") {
				errorRef.current = true;
				if (settings.sendAnonymousReports && content) {
					sendDiscordReport(content, {
						userReport: false,
					});
				}
			}
			// launch iframe if server is running
			if (
				(type === "log" || type === "info") &&
				(content.toLowerCase().includes("started server") ||
					content.toLowerCase().includes("http") ||
					content.toLowerCase().includes("127.0.0.1") ||
					content.toLowerCase().includes("localhost") ||
					content.toLowerCase().includes("0.0.0.0"))
			) {
				const match = content
					.replace(/\x1b\[[0-9;]*m/g, "")
					.match(
						/(?:https?:\/\/)?(?:localhost|127\.0\.0\.1|0\.0\.0\.0):(\d{2,5})/i,
					);
				if (match) {
					loadIframe(Number.parseInt(match[1]));
					setIframeAvailable(true);
				}
			}
			if (type === "log") {
				addLog(appId, content);
				if (content.includes("Cant kill process")) {
					showToast(
						"error",
						"Error stopping script, please try again later or do it manually.",
					);
				}
			}
			if (type === "status") {
				setStatusLog({ [appId]: { status: status || "pending", content } });
				if (content.toLowerCase().includes("actions executed")) {
					window.electron.ipcRenderer.invoke(
						"notify",
						"Actions executed",
						`${data.name} has finished successfully.`,
					);
					stopCheckingRef.current = true;
					setAppFinished({ [appId]: true });
				}
			}
			if (type === "catch") {
				stopCheckingRef.current = false;
				setIframeAvailable(false);
				// loadIframe(Number.parseInt(content));
				setCatchPort(Number.parseInt(content));
			}

			if (content === "Script killed successfully" && !errorRef.current) {
				stopCheckingRef.current = true;
				showToast("success", `${data?.name || "Script"} exited successfully.`);
			}
		},
	);

	socket.on("deleteUpdate", (message: string) => {
		console.log("Received log:", message);
		setDeleteLogs((prevLogs) => [...prevLogs, message]);
	});

	socketsRef.current[appId] = socket;
	return socket;
}
