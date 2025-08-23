import { sendDiscordReport } from "@renderer/utils/discordWebhook";
import { type Socket, io as clientIO } from "socket.io-client";
import type { SetupSocketProps } from "../types/context-types";

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
	setNotSupported,
	setIsServerRunning,
}: SetupSocketProps): Socket {
	if (socketsRef.current[appId]?.socket) {
		console.log(`Socket [${appId}] already exists`);
		return socketsRef.current[appId].socket;
	}
	const socket = clientIO(`http://localhost:${port}`);
	const settings = JSON.parse(localStorage.getItem("config") || "{}");

	socket.on("connect", () => {
		console.log(`Socket [${appId}] connected with ID: ${socket.id}`);
		socket.emit("registerApp", appId);
		// Don't modify isServerRunning here - let install.tsx handle it
		console.log(`Socket connected for app ${appId}`);
	});

	socket.on("disconnect", () => {
		console.warn(`Socket [${appId}] disconnected`);
		setIsServerRunning((prev) => ({ ...prev, [appId]: false }));
		delete socketsRef.current[appId];
	});

	socket.on("clientUpdate", (message: string) => {
		console.log("Received log:", message);
		addLog(appId, message);
	});

	socket.on("missingDeps", (data) => {
		console.log("MISSING DEPS FOUND");
		setMissingDependencies(data);
	});

	socket.on("installDep", (message: { type: string; content: string }) => {
		if (!message) return;
		const content = message.content || "";
		if (content.trim().length === 0) return;
		addLog(appId, content);
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
					content.toLowerCase().includes("0.0.0.0") ||
					content.toLowerCase().includes("running on") ||
					content.toLowerCase().includes("serving at") ||
					content.toLowerCase().includes("server running"))
			) {
				const match = content
					.replace(/\x1b\[[0-9;]*m/g, "")
					.match(
						/(?:https?:\/\/)?(?:localhost|127\.0\.0\.1|0\.0\.0\.0):(\d{2,5})/i,
					);
				if (match) {
					const detectedPort = Number.parseInt(match[1]);
					loadIframe(detectedPort);
					setCatchPort(detectedPort);
					setIframeAvailable(true);
					console.log(`Server detected on port ${detectedPort} from logs`);
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

					setAppFinished((prev) => ({ ...prev, [appId]: true }));
				}
			}
			if (type === "catch") {
				stopCheckingRef.current = false;
				const port = Number.parseInt(content);
				setCatchPort(port);



				// Start checking if the port is available
				let attempts = 0;
				const maxAttempts = 30; // Try for 30 seconds

				const checkPortAvailability = async () => {
					attempts++;
					try {
						await fetch(`http://localhost:${port}`, {
							method: 'HEAD',
							mode: 'no-cors'
						});
						// If we get here, the server is responding
						loadIframe(port);
						setIframeAvailable(true);
						console.log(`Port ${port} is now available after ${attempts} attempts`);
					} catch (error) {
						// Server not ready yet, try again
						if (attempts < maxAttempts) {
							setTimeout(checkPortAvailability, 1000);
						} else {
							console.log(`Port ${port} not available after ${maxAttempts} attempts, but continuing...`);
							// Even if port check fails, still try to load iframe
							// This handles cases where CORS blocks the check but the server is actually running
							loadIframe(port);
							setIframeAvailable(true);
						}
					}
				};

				// Start checking after a short delay to let the server start
				setTimeout(checkPortAvailability, 3000);
			}

			if (content === "Script killed successfully" && !errorRef.current) {
				stopCheckingRef.current = true;
				setIsServerRunning((prev) => ({ ...prev, [appId]: false }));
				showToast("success", `${data?.name || "Script"} exited successfully.`);
			}
		},
	);

	socket.on("notSupported", (message: { reasons: string }) => {
		const reasons = [message.reasons];
		setNotSupported((prev) => ({ ...prev, [appId]: { reasons } }));
		window.electron.ipcRenderer.invoke(
			"notify",
			"Script execution failed",
			"Do not meet the minimum requirements to use an app.",
		);
	});
	socket.on("deleteUpdate", (message: string) => {
		console.log("Received log:", message);
		setDeleteLogs((prevLogs) => [...prevLogs, message]);
	});

	socketsRef.current[appId] = { socket };
	return socket;
}
