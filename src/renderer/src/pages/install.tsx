import ActionsComponent from "@renderer/components/install/actions";
import IframeComponent from "@renderer/components/install/iframe";
import LogsComponent from "@renderer/components/install/logs";
import DeleteLoadingModal from "@renderer/components/layout/delete-loading-modal";
import { useAppContext } from "@renderer/components/layout/global-context";
import MissingDepsModal from "@renderer/components/layout/missing-deps-modal";
import sendEvent from "@renderer/utils/events";
import { AnimatePresence } from "framer-motion";
import { ArrowLeft, Bookmark, Share2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../components/contexts/AuthContext";
import { useTranslation } from "../translations/translationContext";
import { getCurrentPort } from "../utils/getPort";

export default function Install({ id }: { id?: string }) {
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
	useEffect(() => {
		if (!isServerRunning || !data?.id) return;
		connectApp(data?.id);
	}, [isServerRunning]);

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
		fetchIfDownloaded();
	}, [data]);

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
		setIsServerRunning(true);
		setShow({ [data?.id]: "logs" });
		if (!data?.id) return;

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
			showToast(
				"error",
				t("toast.install.error.download").replace("%s", String(error)),
			);
			addLog(data?.id, "Error initiating download");
			setIsServerRunning(false);
		}
		handleReloadQuickLaunch();
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
			setIsServerRunning(true);
			addLog(data?.id, `Starting ${data.name}...`);
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
			setIsServerRunning(false);
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
				setIsServerRunning(false);
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
			console.log("should uninstall deps", deleteDeps);
			if (deleteDeps) {
				setDeleteStatus("deleting_deps");
				const response = await fetch(
					`http://localhost:${port}/deps/uninstall`,
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							dioneFile: data.name,
							selectedDeps: selectedDeps,
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
		console.log("result", result);
		const depsArray = Object.keys(result.result);
		console.log("this scripts uses:", depsArray);
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
		connectApp(data?.id);
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
				console.log("eventId", eventId);
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
			console.log("appid", data?.id);
			console.log("savedApps", savedApps);
			console.log(
				"saved",
				savedApps.some((app) => app.appId === data?.id),
			);
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

	useEffect(() => {
		console.log("selectedDeps", selectedDeps);
	}, [selectedDeps]);

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
				<div
					className="absolute inset-0 flex items-center justify-center bg-black/80 p-4 backdrop-blur-3xl"
					style={{ zIndex: 100 }}
				>
					<div
						className="p-6 rounded-xl border border-white/10 shadow-lg relative overflow-hidden max-w-2xl w-full backdrop-blur-md"
						style={{
							height: inUseDeps && inUseDeps.length <= 3 ? undefined : "28rem",
							minHeight:
								inUseDeps && inUseDeps.length <= 3 ? undefined : "16rem",
							maxHeight:
								inUseDeps && inUseDeps.length > 3 ? "28rem" : undefined,
						}}
					>
						<div className="flex justify-between w-full items-center">
							<h2 className="font-semibold text-lg flex items-center justify-center">
								{t("deleteLoading.uninstalling.deps")}
							</h2>
							<button
								type="button"
								className="cursor-pointer z-50 flex items-center justify-center p-2 bg-white/10 hover:bg-white/20 rounded-full"
								onClick={() => setDeleteDepsModal(false)}
							>
								<X className="h-3 w-3" />
							</button>
						</div>
						<div className="pt-6 w-full h-full flex flex-col">
							<div className="flex flex-col gap-2 w-full overflow-auto border border-white/10 rounded-xl p-4">
								{inUseDeps && inUseDeps.length > 0 ? (
									inUseDeps.map((dep, index) => {
										const selected = selectedDeps.includes(dep);
										return (
											<label
												key={index}
												className={`flex items-center gap-3 py-2 cursor-pointer select-none`}
												style={{ alignItems: "flex-start" }}
											>
												<input
													type="checkbox"
													checked={selected}
													onChange={() => {
														setSelectedDeps((prev) =>
															prev.includes(dep)
																? prev.filter((d) => d !== dep)
																: [...prev, dep],
														);
													}}
													className="form-checkbox h-4 w-4 rounded border-white/30 bg-transparent checked:bg-[#BCB1E7] checked:border-[#BCB1E7] focus:ring-0 focus:outline-none mt-0.5"
													style={{ accentColor: "#BCB1E7" }}
												/>
												<span className="text-xs text-neutral-300 font-medium">
													{dep}
												</span>
											</label>
										);
									})
								) : (
									<p className="text-xs text-neutral-400 text-center">
										{t("deleteLoading.error.deps")}
									</p>
								)}
							</div>
							<div className="mt-4 flex items-center justify-end gap-3">
								<button
									type="button"
									onClick={() => {
										setDeleteDepsModal(false);
										handleUninstall(false);
									}}
									className="flex items-center justify-center gap-2 p-4 text-xs bg-white/10 hover:bg-white/20 transition-colors duration-400 rounded-full text-white font-semibold py-1 text-center cursor-pointer"
								>
									{t("common.cancel")}
								</button>
								<button
									type="button"
									onClick={() => {
										setDeleteDepsModal(false);
										handleUninstall(true);
									}}
									className="flex items-center justify-center gap-2 p-4 text-xs bg-white hover:bg-white/80 transition-colors duration-400 rounded-full text-black font-semibold py-1 text-center cursor-pointer"
								>
									<span className="font-semibold">
										{t("actions.uninstall")}
									</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
			<div className="relative w-full h-full overflow-auto">
				{show[data?.id] === "actions" && (
					<>
						<div className="p-12 z-50 absolute">
							<button
								type="button"
								onClick={() => navigate("/")}
								className="flex items-center justify-center gap-2 text-xs w-full border border-white/10 hover:bg-white/10 transition-colors duration-400 rounded-full text-neutral-400 py-2 px-4 text-center cursor-pointer"
							>
								<ArrowLeft className="h-4 w-4" />
								<span className="font-semibold">{t("common.back")}</span>
							</button>
						</div>
						<div className="p-12 z-50 absolute right-0">
							{user && (
								<div className="flex items-center gap-2">
									<button
										type="button"
										onClick={() => handleShare()}
										className="flex items-center justify-center gap-2 text-xs w-full border border-white/10 hover:bg-white/10 transition-colors duration-400 rounded-full text-neutral-400 p-2 text-center cursor-pointer"
									>
										<Share2 className="h-4 w-4" />
									</button>
									<button
										type="button"
										onClick={() => handleSave()}
										className={`flex items-center justify-center gap-2 text-xs w-full border border-white/10 hover:bg-white/10 transition-colors duration-400 rounded-full text-neutral-400 p-2 text-center cursor-pointer ${saved ? "bg-white/10" : ""}`}
									>
										<Bookmark className="h-4 w-4" />
									</button>
								</div>
							)}
						</div>
					</>
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
								/>
							)}
						</AnimatePresence>
					</div>
				</div>
			</div>
		</>
	);
}
