import { useAuthContext } from "@/components/contexts/auth-context";
import WorkspaceEditor from "@/components/features/editor/editor";
import ActionsComponent from "@/components/features/install/actions";
import IframeComponent from "@/components/features/install/iframe";
import LogsComponent from "@/components/features/install/logs";
import NotSupported from "@/components/features/install/not-supported";
import CustomCommandsModal from "@/components/features/modals/custom-commands";
import DeleteLoadingModal from "@/components/features/modals/delete-loading";
import { useTranslation } from "@/translations/translation-context";
import { apiFetch, apiJson } from "@/utils/api";
import sendEvent from "@/utils/events";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	useScriptsContext,
	useScriptsLogsContext,
} from "../components/contexts/scripts-context";

export default function Install({
	id,
	isLocal,
	action,
}: {
	id?: string;
	isLocal?: boolean;
	action?: "install" | "start" | "navigate";
}) {
	const {
		setInstalledApps,
		isServerRunning,
		setIsServerRunning,
		setData,
		data,
		setError,
		iframeAvailable,
		setMissingDependencies,
		missingDependencies,
		setShow,
		show,
		showToast,
		iframeSrc,
		catchPort,
		exitRef,
		setApps,
		installedApps,
		connectApp,
		handleReloadQuickLaunch,
		handleStopApp,
		activeApps,
		appFinished,
		loadIframe,
		setLocalApps,
		notSupported,
		sockets,
		wasJustInstalled,
		setWasJustInstalled,
		shouldCatch,
		canStop,
		terminalStatesRef,
	} = useScriptsContext();

	const { logs, addLogLine, clearLogs, getAllAppLogs } =
		useScriptsLogsContext();

	const { t } = useTranslation();
	const navigate = useNavigate();
	// loading stuff
	const [_loading, setLoading] = useState<boolean>(true);
	const [_imgLoading, setImgLoading] = useState<boolean>(true);
	// data stuff
	const [installed, setInstalled] = useState<boolean>(false);
	// delete
	const [deleteStatus, setDeleteStatus] = useState<string>("");
	const [deleteDepsModal, setDeleteDepsModal] = useState<boolean>(false);
	const [inUseDeps, setInUseDeps] = useState<any>([]);
	const [selectedDeps, setSelectedDeps] = useState<any>([]);
	// config
	const [config, setConfig] = useState<any>(null);
	// user
	const { user } = useAuthContext();
	const [saved, setSaved] = useState(false);
	const savedApps = JSON.parse(localStorage.getItem("savedApps") || "[]");
	// max apps limit (default 6)
	const maxApps = 6;
	// not supported modal
	const [notSupportedModal, setNotSupportedModal] = useState<boolean>(false);

	// auto-install missing dependencies
	const [installingDeps, setInstallingDeps] = useState<boolean>(false);

	// start options
	const [startOptions, setStartOptions] = useState<any>(null);
	const [selectedStart, setSelectedStart] = useState<any>(null);
	const [openCustomCommands, setOpenCustomCommands] = useState<boolean>(false);
	const [customizableCommands, setCustomizableCommands] = useState<
		Record<string, string>
	>({});

	// state
	const [executing, setExecuting] = useState<"start" | "install" | null>(null);

	useEffect(() => {
		async function autoInstallMissingDependencies() {
			if (!data?.id || !data?.name) return;
			const missing = missingDependencies.filter(
				(dep) =>
					dep.reason === "not-installed" || dep.reason === "version-mismatch",
			);
			console.log(missing);
			if (!missing || missing.length === 0) {
				await onFinishInstallDeps();
				return;
			}

			// Only switch to logs view if we're not already there
			if (show[data.id] !== "logs") {
				setShow({ [data.id]: "logs" });
			}

			try {
				const response = await apiFetch(`/deps/install/${data.id}`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						dependencies: missing,
						nameFolder: data.name.replace(/\s+/g, "-"),
					}),
				});
				if (!response.ok) {
					throw new Error(String(response.status));
				}
				const result = await response.json();
				if (result?.success) {
					addLogLine(data.id, "dependencies installed successfully");
					await onFinishInstallDeps();
				} else {
					showToast(
						"error",
						t("missingDeps.logs.error.install").replace(
							"{error}",
							"unknown error",
						),
					);
					addLogLine(data.id, "error installing dependencies");
				}
			} catch (err: any) {
				showToast(
					"error",
					t("missingDeps.logs.error.install").replace(
						"{error}",
						String(err?.message || err?.toString() || "Unknown error"),
					),
				);
				addLogLine(data.id, `error installing dependencies: ${String(err)}`);
			} finally {
				setInstallingDeps(false);
			}
		}

		if (missingDependencies && !installingDeps) {
			setInstallingDeps(true);
			autoInstallMissingDependencies();
		}
	}, [missingDependencies, data?.id]);

	// connect to server
	// useEffect(() => {
	//     if (!isServerRunning || !data?.id) return;
	//     connectApp(data?.id, isLocal);
	// }, [isServerRunning]);

	useEffect(() => {
		if (notSupported[data?.id]) {
			setNotSupportedModal(true);
		}
	}, [notSupported]);

	// stop server and show actions if installation finish
	useEffect(() => {
		async function stopApp() {
			if (!data?.id) return;
			if (appFinished[data.id] === true) {
				// stop app on finished
				await handleStopApp(data.id, data.name);
				if (config?.autoOpenAfterInstall) {
					// ensure socket connection
					try {
						if (!sockets[data?.id] || !sockets[data?.id]?.socket?.connected) {
							await connectApp(data?.id, isLocal);
							// wait a moment for socket to connect
							await new Promise((resolve) => setTimeout(resolve, 500));
						} else {
							console.log("socket already present and connected for", data?.id);
						}
					} catch (err) {
						console.warn("error connecting socket before auto-open", err);
					}

					// avoid duplicate log lines
					if (!isServerRunning[data.id]) {
						await start();
					}
				} else {
					setShow({ [data.id]: "actions" });
				}
			}
		}
		stopApp();
	}, [
		appFinished,
		data?.id,
		config?.autoOpenAfterInstall,
		wasJustInstalled,
		missingDependencies,
		handleStopApp,
		fetchIfDownloaded,
		setShow,
		start,
		isLocal,
	]);

	useEffect(() => {
		setData(null);
		setSaved(false);
		setWasJustInstalled(false);

		return () => {
			setData(null);
			setSaved(false);
			setWasJustInstalled(false);
		};
	}, []);

	// fetch script data
	useEffect(() => {
		async function getData() {
			if (!id) return;
			if (isLocal) return;
			try {
				const script = await apiJson(`/db/search/${id}`);
				setData(script);
			} catch (error) {
				setError(true);
				console.error("Error fetching data:", error);
				addLogLine(data?.id, "Error fetching script data");
			} finally {
				setLoading(false);
			}
		}

		async function getLocalData() {
			if (!id) return;
			if (!isLocal) return;
			try {
				console.log("id", id);
				const script = await apiJson(
					`/local/get_app/${encodeURIComponent(id)}`,
				);
				setData(script);
			} catch (error) {
				setError(true);
				console.error("Error fetching data:", error);
				addLogLine(data?.id, "Error fetching script data");
			} finally {
				setLoading(false);
			}
		}

		if (isLocal) {
			getLocalData();
		} else {
			getData();
		}
	}, [id, isLocal]);

	// on get exitRef, stop apps
	useEffect(() => {
		async function stopApps() {
			await stop("exit");
		}

		if (exitRef) {
			stopApps();
		}
	}, [exitRef]);

	// get settings
	useEffect(() => {
		async function getSettings() {
			const config = await apiJson("/config");
			setConfig(config);
		}
		getSettings();
	}, []);

	async function fetchIfDownloaded() {
		if (data?.name) {
			const endpoint = isLocal
				? `/local/installed/${encodeURIComponent(data.name)}`
				: `/scripts/installed/${data.name}`;
			const jsonData = await apiJson<boolean>(endpoint);
			setInstalled(jsonData);
			return jsonData;
		}
		return false;
	}

	async function handleActions(action: "install" | "start" | "navigate") {
		if (action === "install") {
			await download();
		} else if (action === "start") {
			await start();
		} else if (action === "navigate") {
			// do nothing
		}
	}

	useEffect(() => {
		fetchIfDownloaded();
		if (action) {
			handleActions(action);
		}
	}, [data, isLocal, action]);

	useEffect(() => {
		if (show[data?.id] === "actions") {
			fetchIfDownloaded();
		}
	}, [show]);

	async function download(force?: boolean) {
		setExecuting(null);
		const tooMuchApps = activeApps.length >= maxApps;
		if (tooMuchApps) {
			showToast(
				"error",
				t("toast.install.error.tooManyApps").replace("%s", String(maxApps)),
			);
			return;
		}
		clearLogs(data?.id);
		setIsServerRunning((prev) => ({ ...prev, [data?.id]: true }));
		setExecuting("install");
		// only switch to logs view if we're not already there
		if (show[data?.id] !== "logs") {
			setShow({ [data?.id]: "logs" });
		}
		if (!data?.id) return;

		// only connect if we don't already have a socket connection
		if (!sockets[data?.id]) {
			await connectApp(data?.id, isLocal);
			await new Promise((resolve) => setTimeout(resolve, 500)); // wait for socket to connect
		}

		try {
			window.electron.ipcRenderer.invoke(
				"notify",
				"Downloading...",
				`Starting download of ${data.name}`,
			);

			if (isLocal) {
				await apiFetch(`/local/load/${data.name}`, {
					method: "GET",
				});
			} else {
				if (force) {
					await apiFetch(`/scripts/download/${id}?force=true`, {
						method: "GET",
					});
				} else {
					await apiFetch(`/scripts/download/${id}`, {
						method: "GET",
					});
				}
			}

			if (!installedApps.some((app) => app.name === data.name)) {
				setInstalledApps((prevApps) => [...prevApps, { name: data.name }]);
				setWasJustInstalled(true);
			}
			setIsServerRunning((prev) => ({ ...prev, [data?.id]: false }));
		} catch (error) {
			showToast(
				"error",
				t("toast.install.error.download").replace("%s", String(error)),
			);
			addLogLine(data?.id, "Error initiating download");
			setIsServerRunning((prev) => ({ ...prev, [data?.id]: false }));
		}

		handleReloadQuickLaunch();
		if (!isLocal) {
			updateDownloadsCount();
		}
	}

	async function updateDownloadsCount() {
		if (!data?.id) return;
		const response = await apiFetch(`/db/update-script/${data.id}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				downloads: data.downloads + 1,
				updated_at: new Date().toISOString(),
			}),
		});

		if (!response.ok) {
			throw new Error("Failed to update downloads count");
		}
		const result = await response.json();
		console.log(result);
	}

	async function start(
		selectedStart?: string,
		replaceCommands?: Record<string, string>,
	) {
		if (isServerRunning[data?.id]) {
			showToast("error", t("toast.install.error.serverRunning"));
			return;
		}

		setExecuting(null);
		const tooMuchApps = activeApps.length >= maxApps;
		if (tooMuchApps) {
			showToast(
				"error",
				t("toast.install.error.tooManyApps").replace("%s", String(maxApps)),
			);
			return;
		}
		try {
			if (!data.name || !data.id) return;
			if (isServerRunning[data?.id]) return;
			setIsServerRunning((prev) => ({ ...prev, [data?.id]: true }));
			setExecuting("start");

			// only connect if we don't already have a socket connection
			if (!sockets[data?.id]) {
				await connectApp(data?.id, isLocal);
				await new Promise((resolve) => setTimeout(resolve, 500)); // wait for socket to connect
			}

			if (!isServerRunning[data?.id]) {
				setShow({ [data?.id]: "logs" });
				window.electron.ipcRenderer.invoke(
					"notify",
					"Starting...",
					`Starting ${data.name}`,
				);
				await apiFetch(
					`/scripts/start/${data?.name}/${data?.id}${selectedStart ? `?start=${encodeURIComponent(selectedStart)}` : ""}`,
					{
						method: "POST",
						body: JSON.stringify({ replaceCommands }),
						headers: {
							"Content-Type": "application/json",
						},
					},
				);
			}
		} catch (error) {
			showToast(
				"error",
				t("toast.install.error.start")
					.replace("%s", data.name)
					.replace("%s", String(error)),
			);
			addLogLine(data?.id, `Error initiating ${data.name}`);
			setIsServerRunning((prev) => ({ ...prev, [data?.id]: false }));
		}
	}

	async function stop(type?: string) {
		try {
			console.log("stopping...");
			const response = await apiFetch(`/scripts/stop/${data.name}/${data.id}`, {
				method: "GET",
			});
			if (response.status === 200) {
				setShow({ [data?.id]: "actions" });
				setInstalled(true);
				// window.electron.ipcRenderer.invoke(
				//     "notify",
				//     "Stopping...",
				//     `${data.name} stopped successfully.`,
				// );
				// showToast(
				//     "success",
				//     t("toast.install.success.stopped").replace("%s", data.name),
				// );
				clearLogs(data?.id);
				setExecuting(null);
				await fetchIfDownloaded();
				setIsServerRunning((prev) => ({ ...prev, [data?.id]: false }));
				if (type === "exit") {
					window.electron.ipcRenderer.invoke("app:close");
				}
			} else {
				showToast(
					"error",
					t("toast.install.error.stop")
						.replace("%s", data?.name || "app")
						.replace("%s", String(response.status)),
				);
			}
		} catch (error) {
			showToast(
				"error",
				t("toast.install.error.stop")
					.replace("%s", data?.name)
					.replace("%s", String(error)),
			);
			window.electron.ipcRenderer.invoke(
				"notify",
				"Error...",
				`Error stopping ${data.name}: ${error}`,
			);
			addLogLine(data?.id, `Error stopping ${data.name}`);
		}
	}

	async function uninstall(deleteDeps?: boolean) {
		try {
			setDeleteStatus("deleting");
			if (deleteDeps) {
				setDeleteStatus("deleting_deps");
				const result = await apiJson<{
					success?: boolean;
					reasons?: string[];
					error?: string;
				}>("/deps/uninstall", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						dioneFile: encodeURIComponent(data.name),
						selectedDeps,
					}),
				});
				if (result.success) {
					await uninstallApp();
				} else {
					setDeleteStatus("error_deps");
					window.electron.ipcRenderer.invoke(
						"notify",
						"Error...",
						`Error uninstalling dependencies: ${result.reasons?.join(", ") || result.error || "Unknown error"}.`,
					);
					showToast(
						"error",
						`Error uninstalling dependencies: ${result.reasons?.join(", ") || result.error || "Unknown error"}.`,
					);
					addLogLine(
						data?.id,
						`Error uninstalling dependencies: ${result.reasons?.join(", ") || result.error || "Unknown error"}`,
					);
				}
			} else {
				await uninstallApp();
			}
		} catch (error) {
			setDeleteStatus("error");
			showToast(
				"error",
				t("toast.install.error.uninstall")
					.replace("%s", data.name)
					.replace("%s", String(error)),
			);
			addLogLine(data?.id, `Error uninstalling ${data.name}`);
		}
		await handleStopApp(data?.id, data?.name);
		setLocalApps((prev) => prev.filter((app) => app.name !== data.name));
		handleReloadQuickLaunch();
	}

	async function uninstallApp() {
		const response = await apiFetch(`/scripts/delete/${data.name}`, {
			method: "GET",
		});
		if (response.status === 200) {
			setDeleteStatus("deleted");
			window.electron.ipcRenderer.invoke(
				"notify",
				"Uninstalling...",
				`${data.name} uninstalled successfully.`,
			);
			showToast(
				"success",
				t("toast.install.success.uninstalled").replace("%s", data.name),
			);
			setInstalled(false);
			await fetchIfDownloaded();
			setInstalledApps((prevApps) =>
				prevApps.filter((app) => app.name !== data.name),
			);
			setApps((prevApps) => prevApps.filter((app) => app?.name !== data.name));
		} else {
			setDeleteStatus("error");
			window.electron.ipcRenderer.invoke(
				"notify",
				"Error...",
				`Error uninstalling ${data.name}: Error ${response.status}`,
			);
			showToast(
				"error",
				t("toast.install.error.uninstall")
					.replace("%s", data.name)
					.replace("%s", String(response.status)),
			);
		}
	}

	const copyLogsToClipboard = () => {
		showToast("success", t("toast.install.success.logsCopied"));
		const logsText = getAllAppLogs().join("\n");
		window.copyToClipboard.writeText(logsText);
	};

	const handleDownload = async () => {
		showToast(
			"default",
			t("toast.install.downloading").replace("%s", data.name),
		);
		await download();
	};

	const handleStart = async (selectedStartOpt?: any) => {
		if (isServerRunning[data?.id]) {
			showToast("error", t("toast.install.error.serverRunning"));
			return;
		}
		if (selectedStartOpt) {
			setSelectedStart(selectedStartOpt);

			const replaceCommands: Record<string, string> = {};
			console.log("selectedStart", selectedStartOpt);
			for (const step of selectedStartOpt.steps as any[]) {
				for (const cmd of step.commands as any[]) {
					if (typeof cmd === "object" && cmd.customizable) {
						replaceCommands[cmd.command] = cmd.command;
					}
				}
			}

			if (Object.keys(replaceCommands).length > 0) {
				console.log("custom commands (old -> new):", replaceCommands);
				setCustomizableCommands(replaceCommands);
				setOpenCustomCommands(true);
			} else {
				showToast(
					"default",
					t("toast.install.starting").replace("%s", data.name),
				);
				if (show[data?.id] !== "logs") {
					setShow({ [data?.id]: "logs" });
				}
				setSelectedStart(selectedStartOpt.name);
				await start(selectedStartOpt.name);
			}
		} else {
			await start();
		}
	};

	const handleUninstall = async (deleteDeps?: boolean) => {
		showToast(
			"default",
			t("toast.install.uninstalling").replace("%s", data.name),
		);
		await uninstall(deleteDeps);
	};

	async function checkInUse() {
		if (!data?.name) return;
		const result = await apiJson<{ result?: string[] }>("/deps/in-use", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ dioneFile: data?.name }),
		});
		setInUseDeps(result.result || []);
		setSelectedDeps(result.result || []);
		return result.result || [];
	}

	const handleDeleteDeps = async () => {
		if (config?.alwaysUninstallDependencies) {
			await uninstall(true);
		} else {
			const deps = await checkInUse();
			if (deps && deps.length > 0) {
				setDeleteDepsModal(!deleteDepsModal);
			} else {
				console.log(`DEPS: ${JSON.stringify(deps)}`);
				console.log(`${deps?.length ?? 0} deps in use`);
				await uninstall(false);
			}
		}
	};

	const handleReconnect = async () => {
		showToast(
			"default",
			t("toast.install.reconnecting").replace("%s", data.name),
		);
		// only switch to logs view if we're not already there
		if (show[data?.id] !== "logs") {
			// connectApp(data?.id, isLocal); // commented out to avoid duplicate logs when an app finished installation and is reconnecting to start
			setShow({ [data?.id]: "logs" });
		}
	};

	async function onFinishInstallDeps() {
		// remove app from installed apps
		setInstalledApps((prevApps) =>
			prevApps.filter((app) => app.name !== data.name),
		);
		setApps((prevApps) => prevApps.filter((app) => app?.name !== data.name));

		// clear missing deps
		setMissingDependencies(null);

		// show success toast
		showToast("success", t("toast.install.success.depsInstalled"));

		// clear logs
		clearLogs(data?.id);

		// clear errors
		setError(false);

		// show retrying toast
		showToast("default", t("toast.install.retrying").replace("%s", data.name));

		if (sockets[data?.id]) {
			if (!installed) {
				await handleDownload();
			}
		} else {
			await connectApp(data?.id, isLocal);
			await new Promise((resolve) => setTimeout(resolve, 500)); // wait for socket to connect
			await handleDownload();
		}
	}

	function handleCloseDeleteModal() {
		console.log("isLocal", isLocal);
		if (isLocal) {
			navigate("/library");
		}
		setDeleteStatus("");
	}

	async function handleShare() {
		if (user.id && user !== undefined && user !== null) {
			await sendEvent({
				user: user.id,
				type: "event",
				event: "share",
				app_id: data?.id,
				app_name: data?.name,
			});
		}
		window.copyToClipboard.writeText(`dione://download=${data?.id}`);
		showToast("success", t("toast.install.success.shared"));
	}

	async function handleSave() {
		if (!saved) {
			if (!user.id) return;
			if (user.id && user !== undefined && user !== null) {
				const result = await sendEvent({
					user: user.id,
					type: "event",
					event: "save_app",
					app_id: data?.id,
					app_name: data?.name,
				});

				if (result === "error") return;
				const newSaved = { eventId: result.id, appId: data?.id };
				localStorage.setItem(
					"savedApps",
					JSON.stringify([...savedApps, newSaved]),
				);
				setSaved(true);
			}
		} else {
			if (!user.id) return;
			if (user.id && user !== undefined && user !== null) {
				const eventId = savedApps.find(
					(app) => app.appId === data?.id,
				)?.eventId;
				if (!eventId) return;
				const result = await sendEvent({
					id: eventId,
					event: "unsave_app",
					updatedata: "true",
				});
				if (result === "error") return;
				localStorage.setItem(
					"savedApps",
					JSON.stringify(savedApps.filter((app) => app.appId !== data?.id)),
				);
				setSaved(false);
			}
		}
	}

	useEffect(() => {
		if (savedApps.some((app) => app.appId === data?.id)) {
			setSaved(true);
		}
	}, [savedApps, data]);

	const stopApp = async () => {
		await fetchIfDownloaded();
		await handleStopApp(data.id, data.name);
		setExecuting(null);
		window.electron.ipcRenderer.send("close-preview-window");
	};

	useEffect(() => {
		if (data) {
			setShow({ [data.id]: "actions" });
		}
	}, [data]);

	useEffect(() => {
		if (!data?.id) return;
		if (
			iframeAvailable[data.id] &&
			isServerRunning[data.id] &&
			installed &&
			!shouldCatch[data.id]
		) {
			loadIframe(catchPort[data.id]);
			const logText = `INFO: Preview started for ${data.name} on port ${catchPort[data.id]}`;

			// avoid duplicate log lines
			if (!logs[data.id]?.includes(logText)) {
				addLogLine(data.id, logText);
			}
		}
	}, [
		iframeAvailable,
		isServerRunning[data?.id],
		installed,
		catchPort,
		data?.id,
	]);

	useEffect(() => {
		async function fetchStartOptions() {
			if (data) {
				try {
					const options = await apiJson(
						`/scripts/start-options/${encodeURIComponent(data.name)}`,
					);
					console.log("options", options);
					setStartOptions(options);
				} catch (error) {
					console.error("Failed to fetch start options", error);
				}
			}
		}
		if (installed === true) {
			fetchStartOptions();
		}
	}, [installed]);

	const handleEditCommand = (oldCommand: string, newValue: string) => {
		setCustomizableCommands((prev) => ({
			...prev,
			[oldCommand]: newValue,
		}));
	};

	return (
		<>
			{openCustomCommands && (
				<CustomCommandsModal
					commands={customizableCommands}
					onEdit={handleEditCommand}
					onLaunch={() => {
						if (customizableCommands && selectedStart) {
							start(selectedStart.name, customizableCommands);
						}
						setOpenCustomCommands(false);
					}}
					onCancel={() => setOpenCustomCommands(false)}
				/>
			)}
			{(deleteStatus !== "" || deleteDepsModal) && (
				<DeleteLoadingModal
					status={deleteStatus}
					onClose={() => {
						handleCloseDeleteModal();
						setDeleteDepsModal(false);
					}}
					inUseDeps={inUseDeps}
					selectedDeps={selectedDeps}
					setSelectedDeps={setSelectedDeps}
					onConfirm={() => {
						setDeleteDepsModal(false);
						handleUninstall(true);
					}}
					showDepsSelection={deleteDepsModal}
				/>
			)}
			<div className="relative w-full h-full overflow-auto">
				{/* Subtle background light effect */}
				<div className="absolute inset-0 pointer-events-none overflow-hidden">
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-xl bg-gradient-to-br from-[var(--theme-accent)] to-[var(--theme-accent-secondary)] opacity-[0.08] blur-[120px]"></div>
				</div>

				{notSupportedModal && (
					<NotSupported
						reasons={notSupported[data?.id].reasons}
						data={data}
						onClose={(force?: boolean) => {
							if (!force) {
								stopApp();
								setShow({ [data?.id]: "actions" });
								setNotSupportedModal(false);
							} else {
								setNotSupportedModal(false);
								download(true);
							}
						}}
					/>
				)}

				<div className="flex h-full w-full relative z-10">
					<div className="w-full h-full flex justify-center items-center">
						<AnimatePresence>
							{show[data?.id] === "iframe" && (
								<IframeComponent
									iframeSrc={iframeSrc[data?.id]}
									handleStop={() => stopApp()}
									currentPort={catchPort[data.id]}
									setShow={setShow}
									data={data}
								/>
							)}{" "}
							{show[data?.id] === "editor" && (
								<WorkspaceEditor data={data} setShow={setShow} />
							)}{" "}
							{show[data?.id] === "logs" && (
								<LogsComponent
									logs={logs}
									copyLogsToClipboard={copyLogsToClipboard}
									handleStop={() => stopApp()}
									iframeAvailable={iframeAvailable[data?.id]}
									setShow={setShow}
									appId={data?.id}
									executing={executing}
									canStop={canStop[data?.id]}
									terminalStatesRef={terminalStatesRef}
								/>
							)}{" "}
							{show[data?.id] === "actions" && (
								<ActionsComponent
									handleReconnect={handleReconnect}
									isServerRunning={isServerRunning}
									data={data}
									installed={installed}
									setImgLoading={setImgLoading}
									handleDownload={handleDownload}
									handleStart={handleStart}
									handleUninstall={handleUninstall}
									handleDeleteDeps={handleDeleteDeps}
									startOptions={startOptions}
									isLocal={isLocal}
									setShow={setShow}
									user={user}
									handleShare={handleShare}
									handleSave={handleSave}
									saved={saved}
								/>
							)}
						</AnimatePresence>
					</div>
				</div>
			</div>
		</>
	);
}
