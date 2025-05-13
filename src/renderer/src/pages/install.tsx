import Icon from "@renderer/components/icons/icon";
import ActionsComponent from "@renderer/components/install/actions";
import IframeComponent from "@renderer/components/install/iframe";
import LogsComponent from "@renderer/components/install/logs";
import { useAppContext } from "@renderer/components/layout/global-context";
import MissingDepsModal from "@renderer/components/layout/missing-deps-modal";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentPort } from "../utils/getPort";
import DeleteLoadingModal from "@renderer/components/layout/delete-loading-modal";

export default function Install({ id }: { id?: string }) {
	const {
		setInstalledApps,
		logs,
		setLogs,
		statusLog,
		isServerRunning,
		setIsServerRunning,
		setData,
		data,
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
		catchPort,
		exitRef,
		setApps,
		installedApps
	} = useAppContext();
	// loading stuff
	const [_loading, setLoading] = useState<boolean>(true);
	const [_imgLoading, setImgLoading] = useState<boolean>(true);
	// data stuff
	const [installed, setInstalled] = useState<boolean>(false);
	// navigation stuff
	const navigate = useNavigate();
	// delete 
	const [deleteStatus, setDeleteStatus] = useState<string>("");

	// fetch script data
	useEffect(() => {
		async function getData() {
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
					setData(script[0]);
				} else {
					throw new Error("Failed to fetch data");
				}
			} catch (error) {
				setError(true);
				console.error("Error fetching data:", error);
				setLogs((prevLogs) => [...prevLogs, "Error fetching script data"]);
			} finally {
				setLoading(false);
			}
		}

		getData();
	}, [id]);

	// on get exitRef, stop apps
	useEffect(() => {
		async function stopApps() {
			await stop("exit");
		}

		if (exitRef) {
			stopApps();
		}
	}, [exitRef]);

	async function fetchIfDownloaded() {
		if (data?.name) {
			const port = await getCurrentPort();
			const response = await fetch(
				`http://localhost:${port}/scripts/installed/${data.name}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
			if (response.ok) {
				const jsonData = await response.json();
				setInstalled(jsonData);
			} else {
				setError(true);
			}
		}
	}

	useEffect(() => {
		setIframeAvailable(false);
		fetchIfDownloaded();
	}, [data]);

	async function download() {
		setIsServerRunning(true);
		setShow("logs");
		try {
			const port = await getCurrentPort();
			window.electron.ipcRenderer.invoke(
				"notify",
				"Downloading...",
				`Starting download of ${data.name}`,
			);
			await fetch(`http://localhost:${port}/scripts/download/${id}`, {
				method: "GET",
			});
			if (!installedApps.includes(data.name)) {
				setInstalledApps((prevApps) => [...prevApps, data.name]);
			}
		} catch (error) {
			showToast("error", `Error initiating download: ${error}`);
			setLogs((prevLogs) => [...prevLogs, "Error initiating download"]);
			setIsServerRunning(false);
		}
	}

	async function start() {
		try {
			setIsServerRunning(true);
			const port = await getCurrentPort();
			window.electron.ipcRenderer.invoke(
				"notify",
				"Starting...",
				`Starting ${data.name}`,
			);
			await fetch(`http://localhost:${port}/scripts/start/${data.name}`, {
				method: "GET",
			});
		} catch (error) {
			showToast("error", `Error initiating ${data.name}: ${error}`);
			setLogs((prevLogs) => [...prevLogs, `Error initiating ${data.name}`]);
			setIsServerRunning(false);
		}
	}

	async function stop(type?: string) {
		try {
			const port = await getCurrentPort();
			const response = await fetch(
				`http://localhost:${port}/scripts/stop/${data.name}`,
				{
					method: "GET",
				},
			);
			if (response.status === 200) {
				setShow("actions");
				setInstalled(true);
				window.electron.ipcRenderer.invoke(
					"notify",
					"Stopping...",
					`${data.name} stopped successfully.`,
				);
				showToast("success", `${data.name} stopped successfully.`);
				setLogs([]); // clear logs
				await fetchIfDownloaded();
				setIsServerRunning(false);
				if (type === "exit") {
					window.electron.ipcRenderer.invoke("app:close");
				}
			} else {
				showToast(
					"error",
					`Error stopping ${data.name}: Error ${response.status}`,
				);
			}
		} catch (error) {
			showToast("error", `Error stopping ${data.name}: ${error}`);
			window.electron.ipcRenderer.invoke(
				"notify",
				"Error...",
				`Error stopping ${data.name}: ${error}`,
			);
			setLogs((prevLogs) => [...prevLogs, `Error stopping ${data.name}`]);
		}
	}

	async function uninstall() {
		try {
			setDeleteStatus("deleting");
			const port = await getCurrentPort();
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
				showToast("success", `${data.name} uninstalled successfully.`);
				setInstalled(false);
				await fetchIfDownloaded();
				setInstalledApps((prevApps) => prevApps.filter((app) => app !== data.name));
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
					`Error uninstalling ${data.name}, please try again later or do it manually.`,
				);
			}
		} catch (error) {
			showToast("error", `Error uninstalling ${data.name}: ${error}`);
			setLogs((prevLogs) => [...prevLogs, `Error uninstalling ${data.name}`]);
		}
	}

	const copyLogsToClipboard = () => {
		showToast("success", "Logs successfully copied to clipboard.");
		const logsText = logs.join("\n");
		navigator.clipboard.writeText(logsText);
	};

	const handleDownload = async () => {
		if (isServerRunning) {
			showToast(
				"error",
				"Server is already running.",
				undefined,
				true,
				"Stop",
				handleStop,
			);
			return;
		}
		showToast("default", `Downloading ${data.name}...`);
		await download();
	};

	const handleStart = async () => {
		if (isServerRunning) {
			showToast(
				"error",
				"Server is already running.",
				undefined,
				true,
				"Stop",
				handleStop,
			);
			return;
		}
		showToast("default", `Starting ${data.name}...`);
		setShow("logs");
		await start();
	};

	const handleStop = async () => {
		await stop();
	};

	const handleUninstall = async () => {
		showToast("default", `Uninstalling ${data.name}...`);
		await uninstall();
	};

	const handleReconnect = async () => {
		showToast("default", `Reconnecting ${data.name}...`);
		setShow("logs");
	};

	useEffect(() => {
		return () => {
			stopCheckingRef.current = true;
		};
	}, []);

	const handleReloadIframe = async () => {
		const iframe = document.getElementById("iframe") as HTMLIFrameElement;
		iframe.src = iframe.src;
	};

	async function onFinishInstallDeps() {
		setMissingDependencies(null);
		setLogs([]);
		setError(false);
		handleDownload();
	}

	function handleCloseDeleteModal() {
		setDeleteStatus("");
	}

	return (
		<>
			{deleteStatus !== "" && <DeleteLoadingModal status={deleteStatus} onClose={handleCloseDeleteModal} />}
			{missingDependencies && (
				<MissingDepsModal
					data={missingDependencies}
					set={setMissingDependencies}
					onFinish={onFinishInstallDeps}
				/>
			)}
			<div className="relative w-full h-full overflow-auto">
				{show === "actions" && (
					<div className="p-12 z-50 absolute">
						<button
							type="button"
							onClick={() => navigate(-1)}
							className="flex items-center justify-center gap-2 text-xs w-full border border-white/10 hover:bg-white/10 transition-colors duration-400 rounded-full text-neutral-400 py-2 px-4 text-center cursor-pointer"
						>
							<Icon name="Back" className="h-4 w-4" />
							<span className="font-semibold">Back</span>
						</button>
					</div>
				)}
				<div className="absolute inset-0 flex items-center justify-center p-4">
					<div className="w-full h-full flex justify-center items-center">
						<AnimatePresence mode="wait">
							{show === "iframe" && (
								<IframeComponent
									iframeSrc={iframeSrc}
									handleStop={handleStop}
									handleReloadIframe={handleReloadIframe}
									currentPort={catchPort as number}
									setShow={setShow}
								/>
							)}{" "}
							{show === "logs" && (
								<LogsComponent
									statusLog={statusLog}
									logs={logs}
									copyLogsToClipboard={copyLogsToClipboard}
									handleStop={handleStop}
									iframeAvailable={iframeAvailable}
									setShow={setShow}
								/>
							)}{" "}
							{show === "actions" && (
								<ActionsComponent
									handleReconnect={handleReconnect}
									isServerRunning={isServerRunning}
									data={data}
									installed={installed}
									setImgLoading={setImgLoading}
									handleDownload={handleDownload}
									handleStart={handleStart}
									handleUninstall={handleUninstall}
								/>
							)}
						</AnimatePresence>
					</div>
				</div>
			</div>
		</>
	);
}
