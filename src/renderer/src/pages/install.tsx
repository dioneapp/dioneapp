import ActionsComponent from "@renderer/components/install/actions";
import Buttons from "@renderer/components/install/buttons";
import IframeComponent from "@renderer/components/install/iframe";
import LogsComponent from "@renderer/components/install/logs";
import NotSupported from "@renderer/components/install/not-supported";
import CustomCommandsModal from "@renderer/components/modals/custom-commands";
import DeleteDepsModal from "@renderer/components/modals/delete-deps";
import sendEvent from "@renderer/utils/events";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../components/contexts/AuthContext";
import { useScriptsContext } from "../components/contexts/ScriptsContext";
import DeleteLoadingModal from "../components/modals/delete-loading";
import { useTranslation } from "../translations/translationContext";
import { getCurrentPort } from "../utils/getPort";

export default function Install({
	id,
	isLocal,
}: { id?: string; isLocal?: boolean }) {
	const {
		setInstalledApps,
		logs,
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
		addLog,
		clearLogs,
		getAllAppLogs,
		activeApps,
		appFinished,
		loadIframe,
		setLocalApps,
		notSupported,
		sockets,
		wasJustInstalled,
		setWasJustInstalled,
	} = useScriptsContext();

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
	const [editedCommand, setEditedCommand] = useState<string | null>(null);

	useEffect(() => {
		async function autoInstallMissingDependencies() {
			if (!data?.id || !data?.name) return;
			const port = await getCurrentPort();
			const missing = (missingDependencies || [])
				.filter((dep: any) => !dep.installed)
				.map((dep: any) => dep.name);
			if (!missing || missing.length === 0) {
				await onFinishInstallDeps();
				return;
			}

			// Only switch to logs view if we're not already there
			if (show[data.id] !== "logs") {
				setShow({ [data.id]: "logs" });
			}
			addLog(
				data.id,
				`installing required dependencies: ${missing.join(", ")}`,
			);
			try {
				const response = await fetch(
					`http://localhost:${port}/deps/install/${data.id}`,
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							dependencies: missing,
							nameFolder: data.name.replace(/\s+/g, "-"),
						}),
					},
				);
				if (!response.ok) {
					throw new Error(String(response.status));
				}
				const result = await response.json();
				if (result?.success) {
					addLog(data.id, "dependencies installed successfully");
					await onFinishInstallDeps();
				} else {
					showToast(
						"error",
						t("missingDeps.logs.error.install").replace(
							"{error}",
							"unknown error",
						),
					);
					addLog(data.id, "error installing dependencies");
				}
			} catch (err: any) {
				showToast(
					"error",
					t("missingDeps.logs.error.install").replace(
						"{error}",
						String(err?.message || err?.toString() || "Unknown error"),
					),
				);
				addLog(data.id, `error installing dependencies: ${String(err)}`);
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
	// 	if (!isServerRunning || !data?.id) return;
	// 	connectApp(data?.id, isLocal);
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
				await handleStopApp(data.id, data.name);
				await fetchIfDownloaded();
				setShow({ [data.id]: "actions" });

				// auto-open the app if the setting is enabled and it was just installed
				// but only if we're not in the middle of installing dependencies
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

	useEffect(() => {
		async function autoStart() {
			console.log(
				`setting ${config?.autoOpenAfterInstall}, finished ${wasJustInstalled}, missing deps ${!missingDependencies}`,
			);
			if (
				config?.autoOpenAfterInstall &&
				wasJustInstalled &&
				!missingDependencies
			) {
				const port = await getCurrentPort();
				let response: Response;
				if (isLocal) {
					response = await fetch(
						`http://localhost:${port}/local/installed/${encodeURIComponent(data.name)}`,
						{
							method: "GET",
							headers: {
								"Content-Type": "application/json",
							},
						},
					);
				} else {
					response = await fetch(
						`http://localhost:${port}/scripts/installed/${data.name}`,
						{
							method: "GET",
							headers: {
								"Content-Type": "application/json",
							},
						},
					);
				}

				if (response.ok) {
					const isActuallyInstalled = await response.json();
					if (isActuallyInstalled) {
						setTimeout(async () => {
							setShow({ [data?.id]: "logs" });
							await start();
							setWasJustInstalled(false);
						}, 1000);
					}
				}
			}
		}

		autoStart();
	}, [wasJustInstalled, installed]);

	// fetch script data
	useEffect(() => {
		async function getData() {
			if (!id) return;
			if (isLocal) return;
			try {
				const port = await getCurrentPort();
				const response = await fetch(
					`http://localhost:${port}/db/search/${id}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
						},
					},
				);
				if (response.ok) {
					const script = await response.json();
					setData(script);
				} else {
					throw new Error("Failed to fetch data");
				}
			} catch (error) {
				setError(true);
				console.error("Error fetching data:", error);
				addLog(data?.id, "Error fetching script data");
			} finally {
				setLoading(false);
			}
		}

		async function getLocalData() {
			if (!id) return;
			if (!isLocal) return;
			try {
				const port = await getCurrentPort();
				console.log("id", id);
				const response = await fetch(
					`http://localhost:${port}/local/get_app/${encodeURIComponent(id)}`,
				);
				if (response.ok) {
					const script = await response.json();
					setData(script);
				} else {
					console.log("response", response);
					throw new Error("Failed to fetch data");
				}
			} catch (error) {
				setError(true);
				console.error("Error fetching data:", error);
				addLog(data?.id, "Error fetching script data");
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
			const port = await getCurrentPort();
			const response = await fetch(`http://localhost:${port}/config`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (response.ok) {
				const config = await response.json();
				setConfig(config);
			}
		}
		getSettings();
	}, []);

	async function fetchIfDownloaded() {
		if (data?.name) {
			const port = await getCurrentPort();
			let response: Response;
			if (isLocal) {
				response = await fetch(
					`http://localhost:${port}/local/installed/${encodeURIComponent(data.name)}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
						},
					},
				);
			} else {
				response = await fetch(
					`http://localhost:${port}/scripts/installed/${data.name}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
						},
					},
				);
			}
			if (response.ok) {
				const jsonData = await response.json();
				setInstalled(jsonData);
			} else {
				setError(true);
			}
		}
	}

	useEffect(() => {
		fetchIfDownloaded();
	}, [data, isLocal]);

	useEffect(() => {
		if (show[data?.id] === "actions") {
			fetchIfDownloaded();
		}
	}, [show]);

	async function download(force?: boolean) {
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
			const port = await getCurrentPort();
			window.electron.ipcRenderer.invoke(
				"notify",
				"Downloading...",
				`Starting download of ${data.name}`,
			);

			if (isLocal) {
				await fetch(`http://localhost:${port}/local/load/${data.name}`, {
					method: "GET",
				});
			} else {
				if (force) {
					await fetch(
						`http://localhost:${port}/scripts/download/${id}?force=true`,
						{
							method: "GET",
						},
					);
				} else {
					await fetch(`http://localhost:${port}/scripts/download/${id}`, {
						method: "GET",
					});
				}
			}

			if (!installedApps.includes(data.name)) {
				setInstalledApps((prevApps) => [...prevApps, data.name]);
				setWasJustInstalled(true);
			}
			setIsServerRunning((prev) => ({ ...prev, [data?.id]: false }));
		} catch (error) {
			showToast(
				"error",
				t("toast.install.error.download").replace("%s", String(error)),
			);
			addLog(data?.id, "Error initiating download");
			setIsServerRunning((prev) => ({ ...prev, [data?.id]: false }));
		}

		handleReloadQuickLaunch();
		if (!isLocal) {
			updateDownloadsCount();
		}
	}

	async function updateDownloadsCount() {
		if (!data?.id) return;
		const port = await getCurrentPort();
		const response = await fetch(
			`http://localhost:${port}/db/update-script/${data.id}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					downloads: data.downloads + 1,
					updated_at: new Date().toISOString(),
				}),
			},
		);

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
		const tooMuchApps = activeApps.length >= maxApps;
		if (tooMuchApps) {
			showToast(
				"error",
				t("toast.install.error.tooManyApps").replace("%s", String(maxApps)),
			);
			return;
		}
		try {
			if (!data.name) return;
			setIsServerRunning((prev) => ({ ...prev, [data?.id]: true }));
			addLog(data?.id, `Starting ${data.name}...`);

			// only connect if we don't already have a socket connection
			if (!sockets[data?.id]) {
				await connectApp(data?.id, isLocal);
				await new Promise((resolve) => setTimeout(resolve, 500)); // wait for socket to connect
			}

			const port = await getCurrentPort();
			window.electron.ipcRenderer.invoke(
				"notify",
				"Starting...",
				`Starting ${data.name}`,
			);
			await fetch(
				`http://localhost:${port}/scripts/start/${data?.name}/${data?.id}${selectedStart ? `?start=${encodeURIComponent(selectedStart)}` : ""}`,
				{
					method: "POST",
					body: JSON.stringify({ replaceCommands }),
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
		} catch (error) {
			showToast(
				"error",
				t("toast.install.error.start")
					.replace("%s", data.name)
					.replace("%s", String(error)),
			);
			addLog(data?.id, `Error initiating ${data.name}`);
			setIsServerRunning((prev) => ({ ...prev, [data?.id]: false }));
		}
	}

	async function stop(type?: string) {
		try {
			console.log("stopping...");
			const port = await getCurrentPort();
			const response = await fetch(
				`http://localhost:${port}/scripts/stop/${data.name}/${data.id}/${catchPort}`,
				{
					method: "GET",
				},
			);
			if (response.status === 200) {
				setShow({ [data?.id]: "actions" });
				setInstalled(true);
				window.electron.ipcRenderer.invoke(
					"notify",
					"Stopping...",
					`${data.name} stopped successfully.`,
				);
				showToast(
					"success",
					t("toast.install.success.stopped").replace("%s", data.name),
				);
				clearLogs(data?.id);
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
			addLog(data?.id, `Error stopping ${data.name}`);
		}
	}

	async function uninstall(deleteDeps?: boolean) {
		try {
			const port = await getCurrentPort();
			setDeleteStatus("deleting");
			if (deleteDeps) {
				setDeleteStatus("deleting_deps");
				const response = await fetch(
					`http://localhost:${port}/deps/uninstall`,
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							dioneFile: encodeURIComponent(data.name),
							selectedDeps: selectedDeps,
						}),
					},
				);
				const result = await response.json();
				if (result.success) {
					await uninstallApp(port);
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
					addLog(
						data?.id,
						`Error uninstalling dependencies: ${result.reasons?.join(", ") || result.error || "Unknown error"}`,
					);
				}
			} else {
				await uninstallApp(port);
			}
		} catch (error) {
			setDeleteStatus("error");
			showToast(
				"error",
				t("toast.install.error.uninstall")
					.replace("%s", data.name)
					.replace("%s", String(error)),
			);
			addLog(data?.id, `Error uninstalling ${data.name}`);
		}
		await handleStopApp(data?.id, data?.name);
		setLocalApps((prev) => prev.filter((app) => app.name !== data.name));
		handleReloadQuickLaunch();
	}

	async function uninstallApp(port: number) {
		const response = await fetch(
			`http://localhost:${port}/scripts/delete/${data.name}`,
			{
				method: "GET",
			},
		);
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
				prevApps.filter((app) => app !== data.name),
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
		navigator.clipboard.writeText(logsText);
	};

	const handleDownload = async () => {
		showToast(
			"default",
			t("toast.install.downloading").replace("%s", data.name),
		);
		await download();
	};

	const handleStart = async (selectedStartOpt?: any) => {
		if (selectedStartOpt) {
			setSelectedStart(selectedStartOpt);

			const replaceCommands: Record<string, string> = {};
			console.log("selectedStart", selectedStartOpt);
			(selectedStartOpt.steps as any[]).forEach((step) => {
				(step.commands as any[]).forEach((cmd) => {
					if (typeof cmd === "object" && cmd.customizable) {
						replaceCommands[cmd.command] = cmd.command;
					}
				});
			});

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
		const port = await getCurrentPort();
		const response = await fetch(`http://localhost:${port}/deps/in-use`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ dioneFile: data?.name }),
		});
		const result = await response.json();
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
				console.log(`${deps.length} deps in use`);
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
			setShow({ [data?.id]: "logs" });
		}
	};
	const handleReloadIframe = async () => {
		const iframe = document.getElementById("iframe") as HTMLIFrameElement;
		iframe.src = iframe.src;
	};

	async function onFinishInstallDeps() {
		// remove app from installed apps
		setInstalledApps((prevApps) => prevApps.filter((app) => app !== data.name));
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
			await handleDownload();
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
		navigator.clipboard.writeText(`dione://download=${data?.id}`);
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
		window.electron.ipcRenderer.send("close-preview-window");
	};

	useEffect(() => {
		if (data) {
			setShow({ [data.id]: "actions" });
		}
	}, [data]);

	useEffect(() => {
		if (iframeAvailable) {
			loadIframe(catchPort as number);
		}
	}, []);

	useEffect(() => {
		async function fetchStartOptions() {
			if (data) {
				const port = await getCurrentPort();
				const res = await fetch(
					`http://localhost:${port}/scripts/start-options/${encodeURIComponent(data.name)}`,
				);
				if (res.status === 200) {
					const options = await res.json();
					console.log("options", options);
					setStartOptions(options);
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
			{deleteStatus !== "" && (
				<DeleteLoadingModal
					status={deleteStatus}
					onClose={handleCloseDeleteModal}
				/>
			)}
			{deleteDepsModal && (
				<DeleteDepsModal
					inUseDeps={inUseDeps}
					selectedDeps={selectedDeps}
					setSelectedDeps={setSelectedDeps}
					handleUninstall={handleUninstall}
					setDeleteDepsModal={setDeleteDepsModal}
				/>
			)}
			<div className="relative w-full h-full overflow-auto">
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
				{show[data?.id] === "actions" && (
					<Buttons
						user={user}
						isLocal={isLocal}
						handleShare={handleShare}
						handleSave={handleSave}
						saved={saved}
					/>
				)}
				<div className="flex h-screen w-full">
					<div className="w-full h-full flex justify-center items-center">
						<AnimatePresence>
							{show[data?.id] === "iframe" && (
								<IframeComponent
									iframeSrc={iframeSrc}
									handleStop={() => stopApp()}
									handleReloadIframe={handleReloadIframe}
									currentPort={catchPort as number}
									setShow={setShow}
									data={data}
								/>
							)}{" "}
							{show[data?.id] === "logs" && (
								<LogsComponent
									logs={logs}
									copyLogsToClipboard={copyLogsToClipboard}
									handleStop={() => stopApp()}
									iframeAvailable={iframeAvailable}
									setShow={setShow}
									appId={data?.id}
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
								/>
							)}
						</AnimatePresence>
					</div>
				</div>
			</div>
		</>
	);
}
