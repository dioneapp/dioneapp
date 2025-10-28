import successSound from "@renderer/components/first-time/sounds/success.mp3";
import { sendDiscordReport } from "@renderer/utils/discordWebhook";
import { type Socket, io as clientIO } from "socket.io-client";
import type { SetupSocketProps } from "../types/context-types";

export function setupSocket({
	appId,
	addLog,
	port,
	setMissingDependencies,
	setDependencyDiagnostics,
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
	setWasJustInstalled,
	setProgress,
}: SetupSocketProps): Socket {
	if (socketsRef.current[appId]?.socket) {
		console.log(`Socket [${appId}] already exists`);
		return socketsRef.current[appId].socket;
	}
	const socket = clientIO(`http://localhost:${port}`);
	const settings = JSON.parse(localStorage.getItem("config") || "{}");

	// progress tracking state per socket/app
	let structuredRunActive = false;
	let currentRunId: string | undefined;
	let steps: { id: string; label: string; weight: number }[] = [];
	let finished = new Set<string>();
	let currentStepId: string | undefined;
	let currentStepProgress = 0;
	let lastPercent = 0;
	let debounceTimer: any;

	const applyProgress = (
		nextPercent: number,
		label?: string,
		status: "running" | "success" | "error" = "running",
	) => {
		const smooth = 0.6 * lastPercent + 0.4 * nextPercent;
		lastPercent = smooth;
		setProgress((prev) => ({
			...prev,
			[appId]: {
				mode: structuredRunActive
					? "determinate"
					: prev[appId]?.mode || "indeterminate",
				percent: Math.max(0, Math.min(100, smooth)),
				label: label || prev[appId]?.label,
				status,
				runId: currentRunId,
				steps: steps,
			},
		}));
		if (debounceTimer) clearTimeout(debounceTimer);
		debounceTimer = undefined;
	};
	const scheduleApply = (
		nextPercent: number,
		label?: string,
		status?: "running" | "success" | "error",
	) => {
		if (debounceTimer) clearTimeout(debounceTimer);
		debounceTimer = setTimeout(
			() => applyProgress(nextPercent, label, status as any),
			80,
		);
	};

	const computePercent = () => {
		const finishedWeight = steps.reduce(
			(acc, s) => acc + (finished.has(s.id) ? s.weight : 0),
			0,
		);
		const currentWeight =
			steps.find((s) => s.id === currentStepId)?.weight || 0;
		const percent =
			(finishedWeight + currentWeight * currentStepProgress) * 100;
		return percent;
	};

	// heuristic milestones when no structured run
	const milestones = [
		{
			re: /all required dependencies are installed/i,
			weight: 0.15,
			label: "Dependencies installed",
		},
		{
			re: /using virtual environment|creating\/using virtual environment|virtual environment/i,
			weight: 0.25,
			label: "Environment ready",
		},
		{
			re: /build tools initialized|build tools ready/i,
			weight: 0.35,
			label: "Build tools",
		},
		{
			re: /working on directory|changed working directory/i,
			weight: 0.45,
			label: "Preparing workspace",
		},
		{ re: /executing:/i, weight: 0.55, label: "Executing" },
		{
			re: /running on|serving at|server running|localhost|127\.0\.0\.1|0\.0\.0\.0|http:\/\/|https:\/\//i,
			weight: 1.0,
			label: "Service running",
		},
	];
	const seenMilestones = new Set<number>();

	socket.on("connect", () => {
		console.log(`Socket [${appId}] connected with ID: ${socket.id}`);
		socket.emit("registerApp", appId);
	});

	socket.on("disconnect", () => {
		console.warn(`Socket [${appId}] disconnected`);
		delete socketsRef.current[appId];
	});

	// structured progress events
	socket.on("run_progress", (evt: any) => {
		if (!evt || !evt.type) return;
		switch (evt.type) {
			case "run_started": {
				structuredRunActive = true;
				currentRunId = evt.runId;
				steps = Array.isArray(evt.steps) ? evt.steps : [];
				finished = new Set();
				currentStepId = undefined;
				currentStepProgress = 0;
				lastPercent = 0;
				scheduleApply(0, steps[0]?.label || "Starting", "running");
				break;
			}
			case "step_started": {
				currentStepId = evt.id;
				currentStepProgress = 0;
				scheduleApply(
					computePercent(),
					steps.find((s) => s.id === currentStepId)?.label,
				);
				break;
			}
			case "step_progress": {
				if (evt.id === currentStepId) {
					currentStepProgress = Math.max(
						0,
						Math.min(1, Number(evt.progress) || 0),
					);
					scheduleApply(
						computePercent(),
						steps.find((s) => s.id === currentStepId)?.label,
					);
				}
				break;
			}
			case "step_finished": {
				finished.add(evt.id);
				if (evt.id === currentStepId) currentStepProgress = 1;
				scheduleApply(
					computePercent(),
					steps.find((s) => s.id === currentStepId)?.label,
				);
				break;
			}
			case "run_finished": {
				structuredRunActive = true;
				const success = !!evt.success;
				lastPercent = success ? 100 : lastPercent;
				applyProgress(
					success ? 100 : lastPercent,
					success ? "Running" : "Failed",
					success ? "success" : "error",
				);
				break;
			}
			default:
				break;
		}
	});

	socket.on("clientUpdate", (message: string) => {
		console.log("Received log:", message);
		addLog(appId, message);
		// heuristic progress update if no structured run
		if (!structuredRunActive) {
			const text = message || "";
			for (let i = 0; i < milestones.length; i++) {
				if (!seenMilestones.has(i) && milestones[i].re.test(text)) {
					seenMilestones.add(i);
					const target = milestones[i].weight * 100;
					scheduleApply(
						target,
						milestones[i].label,
						/error|failed/i.test(text) ? "error" : "running",
					);
				}
			}
		}
	});

	socket.on("missingDeps", (data) => {
		console.log("MISSING DEPS FOUND");
		setMissingDependencies(data);
	});

	socket.on("dependencyDiagnostics", (payload) => {
		if (!payload || !payload.dependency) return;
		setDependencyDiagnostics((prev) => {
			const next = { ...prev };
			const current = { ...(next[appId] || {}) };
			current[payload.dependency] = payload;
			next[appId] = current;
			return next;
		});
	});

	socket.on("installDep", (message: { type: string; content: string }) => {
		if (!message) return;
		let content = message.content ?? "";
		if (content.trim().length === 0) return;
		if (!/[\r\n]$/.test(content)) {
			content += "\n";
		}
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
				((type === "log" || type === "info") &&
					(content.toLowerCase().includes("started server") ||
						content.toLowerCase().includes("http") ||
						content.toLowerCase().includes("127.0.0.1") ||
						content.toLowerCase().includes("localhost") ||
						content.toLowerCase().includes("0.0.0.0"))) ||
				content.toLowerCase().includes("0.0.0.0") ||
				content.toLowerCase().includes("running on") ||
				content.toLowerCase().includes("serving at") ||
				content.toLowerCase().includes("server running")
			) {
				const match = content
					.replace(/\x1b\[[0-9;]*m/g, "")
					.match(
						/(?:https?:\/\/)?(?:localhost|127\.0\.0\.1|0\.0\.0\.0):(\d{2,5})/i,
					);
				if (match) {
					loadIframe(Number.parseInt(match[1]));
					setCatchPort((prev) => ({
						...prev,
						[appId]: Number.parseInt(match[1]),
					}));
					setIframeAvailable((prev) => ({ ...prev, [appId]: true }));
				}
			}
			if (type === "log") {
				addLog(appId, content);
				// heuristic progress while no structured run
				if (!structuredRunActive) {
					const text = content || "";
					for (let i = 0; i < milestones.length; i++) {
						if (!seenMilestones.has(i) && milestones[i].re.test(text)) {
							seenMilestones.add(i);
							const target = milestones[i].weight * 100;
							scheduleApply(target, milestones[i].label);
						}
					}
				}
				if (content.includes("Cant kill process")) {
					showToast(
						"error",
						"Error stopping script, please try again later or do it manually.",
					);
				}
			}
			if (type === "status") {
				setStatusLog({ [appId]: { status: status || "pending", content } });
				// reflect status into progress
				if (status === "error") {
					scheduleApply(lastPercent, content, "error");
				}
				if (
					status === "success" &&
					content.toLowerCase().includes("actions executed")
				) {
					scheduleApply(100, "Completed", "success");
				}
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
				setIframeAvailable((prev) => ({ ...prev, [appId]: false }));
				// loadIframe(Number.parseInt(content));
				setCatchPort((prev) => ({ ...prev, [appId]: Number.parseInt(content) }));
			}

			if (content === "Script killed successfully" && !errorRef.current) {
				stopCheckingRef.current = true;
				showToast("success", `${data?.name || "Script"} exited successfully.`);
			}

			if (type === "installFinished") {
				console.log("App finished installation");
				setWasJustInstalled(true);

				if (settings.enableSuccessSound) {
					const audioRef = new Audio(successSound);
					audioRef.volume = 0.7;
					audioRef.currentTime = 0;
					audioRef.loop = false;
					audioRef.muted = false;
					audioRef.play().catch((e) => console.warn("Audio play failed:", e));
				}
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
