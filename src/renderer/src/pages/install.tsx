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
		installedApps,
		setupSocket,
		handleReloadQuickLaunch,
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
	const [deleteDepsModal, setDeleteDepsModal] = useState<boolean>(false);
	const [inUseDeps, setInUseDeps] = useState<any>([]);
	// config
	const [config, setConfig] = useState<any>(null);

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
					setData(script);
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

	useEffect(() => {
		if (show === "actions") {
			fetchIfDownloaded();
		}
	}, [show]);

	async function download() {
		setLogs([]); // clear logs
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
			setIsServerRunning(false);
		} catch (error) {
			showToast("error", `Error initiating download: ${error}`);
			setLogs((prevLogs) => [...prevLogs, "Error initiating download"]);
			setIsServerRunning(false);
		}
		handleReloadQuickLaunch();
	}

	async function start() {
		try {
			if (!data.name) return;
			setIsServerRunning(true);
			const port = await getCurrentPort();
			window.electron.ipcRenderer.invoke(
				"notify",
				"Starting...",
				`Starting ${data.name}`,
			);
			await fetch(`http://localhost:${port}/scripts/start/${data?.name}`, {
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

	async function uninstall(deleteDeps?: boolean) {
		try {
			const port = await getCurrentPort();
			setDeleteStatus("deleting");
			console.log("should uninstall deps", deleteDeps);
			if (deleteDeps && inUseDeps.length > 0) {
				setDeleteStatus("deleting_deps");
				const response = await fetch(
					`http://localhost:${port}/deps/uninstall`,
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							dioneFile: data.name,
							dependency: data.name,
						}),
					},
				);
				const result = await response.json();
				console.log("result", result);
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
					setLogs((prevLogs) => [
						...prevLogs,
						`Error uninstalling dependencies: ${result.reasons?.join(", ") || result.error || "Unknown error"}`,
					]);
				}
			} else {
				await uninstallApp(port);
			}
		} catch (error) {
			setDeleteStatus("error");
			showToast("error", `Error uninstalling ${data.name}: ${error}`);
			setLogs((prevLogs) => [...prevLogs, `Error uninstalling ${data.name}`]);
		}

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
			showToast("success", `${data.name} uninstalled successfully.`);
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
				`Error uninstalling ${data.name}, please try again later or do it manually.`,
			);
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
		stopCheckingRef.current = true;
		await stop();
	};

	const handleUninstall = async (deleteDeps?: boolean) => {
		showToast("default", `Uninstalling ${data.name}...`);
		await uninstall(deleteDeps);
	};

	const handleDeleteDeps = async () => {
		if (config?.alwaysUninstallDependencies) {
			await uninstall(true);
		} else {
			setDeleteDepsModal(!deleteDepsModal);
		}
	};

	const handleReconnect = async () => {
		showToast("default", `Reconnecting ${data.name}...`);
		setShow("logs");
	};
	const handleReloadIframe = async () => {
		const iframe = document.getElementById("iframe") as HTMLIFrameElement;
		iframe.src = iframe.src;
	};

	async function onFinishInstallDeps() {
		setMissingDependencies(null); // clear missing deps
		showToast("success", "Dependencies installed successfully.");
		setLogs([]); // clear logs
		setError(false); // clear error
		setShow("logs");
		// setIsServerRunning(false);
		showToast("default", `Trying to install ${data.name} again...`);
		setupSocket();
		await handleStop();
		await handleDownload();
	}

	function handleCloseDeleteModal() {
		setDeleteStatus("");
	}

	useEffect(() => {
		if (!deleteDepsModal) return;
		if (!data.name) return;
		async function checkInUse() {
			const port = await getCurrentPort();
			const response = await fetch(`http://localhost:${port}/deps/in-use`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ dioneFile: data?.name }),
			});
			const result = await response.json();
			const depsArray = Object.keys(result.result);
			setInUseDeps(depsArray);
		}

		checkInUse();
	}, [deleteDepsModal]);

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
				/>
			)}
			{deleteDepsModal && (
				<div
					className="absolute inset-0 flex items-center justify-center bg-black/80 p-4 backdrop-blur-3xl"
					style={{ zIndex: 100 }}
				>
					<div className="p-6 rounded-xl border border-white/10 shadow-lg relative overflow-hidden max-w-2xl max-h-3/4 h-full w-full backdrop-blur-md">
						<button
							type="button"
							className="absolute right-8 top-8 cursor-pointer"
							onClick={() => setDeleteDepsModal(false)}
						>
							<Icon name="Close" className="h-4 w-4" />
						</button>
						<div className="flex flex-col gap-6 justify-center w-full h-full items-center">
							<h2 className="font-semibold text-lg flex items-center justify-center">
								Should Dione uninstall dependencies?
							</h2>
							<div className="w-full max-w-sm">
								{inUseDeps ? (
									<div className="w-full h-44 flex flex-col gap-2 justify-center items-center overflow-auto">
										<ul className="overflow-auto border border-white/50 w-full rounded p-6 gap-2 flex flex-col">
											{inUseDeps?.map((dep, index) => (
												<div
													key={index}
													className="w-full gap-4 flex flex-col text-sm text-neutral-300"
												>
													<li
														className="border border-white/50 rounded w-full p-2"
														key={index}
													>
														{dep}
													</li>
												</div>
											))}
										</ul>
									</div>
								) : (
									<p className="text-xs text-neutral-400">
										No dependencies are currently in use.
									</p>
								)}
							</div>
							<div className="flex items-center gap-4 mt-12">
								<button
									type="button"
									onClick={() => {
										setDeleteDepsModal(false);
										handleUninstall(false);
									}}
									className="flex items-center justify-center gap-2 p-4 text-xs bg-white hover:bg-white/80 transition-colors duration-400 rounded-full text-black font-semibold py-1 text-center cursor-pointer"
								>
									<span className="font-semibold">No</span>
								</button>
								<button
									type="button"
									onClick={() => {
										setDeleteDepsModal(false);
										handleUninstall(true);
									}}
									className="flex items-center justify-center gap-2 p-4 text-xs bg-white hover:bg-white/80 transition-colors duration-400 rounded-full text-black font-semibold py-1 text-center cursor-pointer"
								>
									<span className="font-semibold">Yes</span>
								</button>
							</div>
						</div>
					</div>
				</div>
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
									data={data}
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
									handleDeleteDeps={handleDeleteDeps}
								/>
							)}
						</AnimatePresence>
					</div>
				</div>
			</div>
		</>
	);
}
