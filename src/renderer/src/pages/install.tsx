import ActionsComponent from "@renderer/components/install/actions";
import Buttons from "@renderer/components/install/buttons";
import IframeComponent from "@renderer/components/install/iframe";
import LogsComponent from "@renderer/components/install/logs";
import DeleteDepsModal from "@renderer/components/modals/delete-deps";
import sendEvent from "@renderer/utils/events";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuthContext } from "../components/contexts/AuthContext";
import { useScriptsContext } from "../components/contexts/ScriptsContext";
import DeleteLoadingModal from "../components/modals/delete-loading";
import MissingDepsModal from "../components/modals/missing-deps";
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
	} = useScriptsContext();
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

	// connect to server
	// useEffect(() => {
	// 	if (!isServerRunning || !data?.id) return;
	// 	connectApp(data?.id, isLocal);
	// }, [isServerRunning]);

	// stop server and show actions if installation finish
	useEffect(() => {
		async function stopApp() {
			if (!data?.id) return;

			if (appFinished[data.id] === true) {
				await handleStopApp(data.id, data.name);
				setShow({ [data.id]: "actions" });
			}
		}
		stopApp();
	}, [appFinished, data?.id]);

	useEffect(() => {
		setData(null);
		setSaved(false);

		return () => {
			setData(null);
			setSaved(false);
		};
	}, []);

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
					`http://localhost:${port}/local/get/${encodeURIComponent(id)}`,
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

	async function download() {
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
		setShow({ [data?.id]: "logs" });
		if (!data?.id) return;

		await connectApp(data?.id, isLocal);
		await new Promise((resolve) => setTimeout(resolve, 500)); // wait for socket to connect

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
				await fetch(`http://localhost:${port}/scripts/download/${id}`, {
					method: "GET",
				});
			}

			if (!installedApps.includes(data.name)) {
				setInstalledApps((prevApps) => [...prevApps, data.name]);
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
		const response = await fetch(`http://localhost:${port}/db/update-script/${data.id}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				downloads: data.downloads + 1,
				updated_at: new Date().toISOString(),
			})
		});

		if (!response.ok) {
			throw new Error("Failed to update downloads count");
		}
		const result = await response.json();
		console.log(result);
	}

	async function start() {
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

			await connectApp(data?.id, isLocal);
			await new Promise((resolve) => setTimeout(resolve, 500)); // wait for socket to connect

			const port = await getCurrentPort();
			window.electron.ipcRenderer.invoke(
				"notify",
				"Starting...",
				`Starting ${data.name}`,
			);
			await fetch(
				`http://localhost:${port}/scripts/start/${data?.name}/${data?.id}`,
				{
					method: "GET",
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
				`http://localhost:${port}/scripts/stop/${data.name}/${data.id}`,
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

	const handleStart = async () => {
		showToast("default", t("toast.install.starting").replace("%s", data.name));
		setShow({ [data?.id]: "logs" });
		await start();
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
		const depsArray = Object.keys(result.result);
		setInUseDeps(depsArray);
		setSelectedDeps(depsArray);
		return depsArray;
	}

	const handleDeleteDeps = async () => {
		if (config?.alwaysUninstallDependencies) {
			await uninstall(true);
		} else {
			const deps = await checkInUse();
			if (deps && deps.length > 0) {
				setDeleteDepsModal(!deleteDepsModal);
			} else {
				await uninstall(false);
			}
		}
	};

	const handleReconnect = async () => {
		showToast(
			"default",
			t("toast.install.reconnecting").replace("%s", data.name),
		);
		setShow({ [data?.id]: "logs" });
	};
	const handleReloadIframe = async () => {
		const iframe = document.getElementById("iframe") as HTMLIFrameElement;
		iframe.src = iframe.src;
	};

	async function onFinishInstallDeps() {
		// remove app from installed apps
		setInstalledApps((prevApps) => prevApps.filter((app) => app !== data.name));
		setApps((prevApps) => prevApps.filter((app) => app?.name !== data.name));
		// restart backend
		await window.electron.ipcRenderer.invoke("restart-backend");
		// clear missing deps
		setMissingDependencies(null);
		// show success toast
		showToast("success", t("toast.install.success.depsInstalled"));
		// clear logs
		clearLogs(data?.id);
		// clear errors
		setError(false);
		// show logs
		setShow({ [data?.id]: "logs" });
		// setIsServerRunning(false);
		showToast("default", t("toast.install.retrying").replace("%s", data.name));
		await handleStopApp(data?.id, data?.name);
		// setup socket again
		connectApp(data?.id, isLocal);
		await handleDownload();
	}

	function handleCloseDeleteModal() {
		setDeleteStatus("");
	}

	const { t } = useTranslation();

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

	return (
		<>
			{deleteStatus !== "" && (
				<DeleteLoadingModal
					status={deleteStatus}
					onClose={handleCloseDeleteModal}
				/>
			)}
			{missingDependencies && (
				<MissingDepsModal
					data={missingDependencies}
					set={setMissingDependencies}
					onFinish={onFinishInstallDeps}
					workingDir={data?.name}
					appId={data?.id}
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
						<AnimatePresence mode="wait">
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
