import { useToast } from "@renderer/utils/useToast";
import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { getCurrentPort } from "../utils/getPort";
import IframeComponent from "@renderer/components/install/iframe";
import LogsComponent from "@renderer/components/install/logs";
import ActionsComponent from "@renderer/components/install/actions";
import { useAppContext } from "@renderer/components/layout/global-context";
import Icon from "@renderer/components/icons/icon";
import MissingDepsModal from "@renderer/components/layout/missing-deps-modal";

export default function Install() {
	const { setInstalledApps } = useAppContext();
	const { id } = useParams<{ id: string }>();
	// loading stuff
	const [_loading, setLoading] = useState<boolean>(true);
	const [_imgLoading, setImgLoading] = useState<boolean>(true);
	// data stuff
	const [data, setData] = useState<any | undefined>(undefined);
	const [installed, setInstalled] = useState<boolean>(false);
	// show
	const [show, setShow] = useState("actions");
	// logs stuff
	const [logs, setLogs] = useState<string[]>([]);
	const [statusLog, setStatusLog] = useState<{
		status: string;
		content: string;
	}>({ status: "", content: "" });
	// iframe stuff
	const [catchPort, setCatchPort] = useState<number>();
	const [iframeSrc, setIframeSrc] = useState<string>("");
	const [iframeAvailable, setIframeAvailable] = useState<boolean>(false);
	// toast stuff
	const { addToast } = useToast();
	const showToast = (
		variant: "default" | "success" | "error" | "warning",
		message: string,
		fixed?: "true" | "false",
	) => {
		addToast({
			variant,
			children: message,
			fixed,
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

	// fetch script data
	useEffect(() => {
		async function getData() {
			try {
				const port = await getCurrentPort();
				const response = await fetch(`http://localhost:${port}/search/${id}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});
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
							navigate(0); // should change this, but for now fix logs after stop script
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

	async function download() {
		setShow("logs");
		try {
			const port = await getCurrentPort();
			await fetch(`http://localhost:${port}/download/${id}`, {
				method: "GET",
			});
			setInstalledApps((prevApps) => [...prevApps, data.name]);
		} catch (error) {
			showToast("error", `Error initiating download: ${error}`);
			setLogs((prevLogs) => [...prevLogs, "Error initiating download"]);
		}
	}

	async function start() {
		try {
			const port = await getCurrentPort();
			await fetch(`http://localhost:${port}/scripts/start/${data.name}`, {
				method: "GET",
			});
		} catch (error) {
			showToast("error", `Error initiating ${data.name}: ${error}`);
			setLogs((prevLogs) => [...prevLogs, `Error initiating ${data.name}`]);
		}
	}

	async function stop() {
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
				showToast("success", `${data.name} stopped successfully.`);
				setLogs([]) // clear logs
				await fetchIfDownloaded();
			} else {
				showToast(
					"error",
					`Error stopping ${data.name}: Error ${response.status}`,
				);
			}
		} catch (error) {
			showToast("error", `Error stopping ${data.name}: ${error}`);
			setLogs((prevLogs) => [...prevLogs, `Error stopping ${data.name}`]);
		}
	}

	async function uninstall() {
		try {
			const port = await getCurrentPort();
			const response = await fetch(
				`http://localhost:${port}/scripts/delete/${data.name}`,
				{
					method: "GET",
				},
			);
			if (response.status === 200) {
				showToast("success", `${data.name} uninstalled successfully.`);
				setInstalled(false);
				await fetchIfDownloaded();
				setInstalledApps((prevApps) =>
					prevApps.filter((app) => app !== data.name),
				);
			} else {
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
		showToast("default", `Downloading ${data.name}...`);
		await download();
	};

	const handleStart = async () => {
		showToast("default", `Starting ${data.name}...`);
		setShow("logs");
		await start();
	};

	const handleStop = async () => {
		showToast("default", `Stopping ${data.name}...`);
		await stop();
	};

	const handleUninstall = async () => {
		showToast("default", `Uninstalling ${data.name}...`);
		await uninstall();
	};

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
			showToast("default", `${data.name} has opened a webview.`);
		}
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

	return (
		<>
			{missingDependencies && (
				<MissingDepsModal
					data={missingDependencies}
					set={setMissingDependencies}
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
									data={data}
									installed={installed}
									handleDownload={handleDownload}
									handleStart={handleStart}
									handleUninstall={handleUninstall}
									setImgLoading={setImgLoading}
								/>
							)}
						</AnimatePresence>
					</div>
				</div>
			</div>
		</>
	);
}
