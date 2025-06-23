import { getCurrentPort } from "@renderer/utils/getPort";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useTranslation } from "../../translations/translationContext";
import Icon from "../icons/icon";

interface props {
	data: any;
	set: React.Dispatch<React.SetStateAction<any>>;
	onFinish: () => void;
	workingDir: string;
	appId: string;
}

export default function MissingDepsModal({
	data,
	set,
	onFinish,
	workingDir,
	appId,
}: props) {
	const { t } = useTranslation();
	const [page, setPage] = useState(0);
	const [logs, setLogs] = useState<string[]>([]);

	useEffect(() => {
		let socket: any = null;

		async function setupSocket() {
			try {
				const port = await getCurrentPort();
				socket = io(`http://localhost:${port}`);

				socket.on("installDep", (message: { name: string; output: string }) => {
					console.log("Received log:", message);
					setLogs((prevLogs) => [...prevLogs, message.output]);
				});

				socket.on("connect", () => {
					console.log("Connected to socket:", socket.id);
					socket.emit("registerApp", appId);
					setLogs((prevLogs) => [...prevLogs, t("missingDeps.logs.connected")]);
				});

				socket.on("disconnect", () => {
					console.log("Socket disconnected");
					setLogs((prevLogs) => [
						...prevLogs,
						t("missingDeps.logs.disconnected"),
					]);
				});
			} catch (error) {
				console.error("Error setting up socket:", error);
				setLogs((prevLogs) => [
					...prevLogs,
					t("missingDeps.logs.error.socket"),
				]);
			}
		}

		setLogs([t("missingDeps.logs.initializing")]);
		setupSocket();
		return () => {
			if (socket) {
				socket.disconnect();
			}
		};
	}, []);

	async function install() {
		setPage(1);
		setLogs([]); // clean logs
		setLogs([t("missingDeps.logs.loading")]);

		try {
			const port = await getCurrentPort();
			const nameFolder = workingDir.replace(/\s+/g, "-");

			const missingDeps = data
				.filter((dep) => !dep.installed)
				.map((dep) => dep.name);

			if (missingDeps.length === 0) {
				setLogs((prevLogs) => [
					...prevLogs,
					t("missingDeps.logs.allInstalled"),
				]);
				return;
			}

			const response = await fetch(
				`http://localhost:${port}/deps/install/${appId}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ dependencies: missingDeps, nameFolder }),
				},
			);

			if (!response.ok) {
				throw new Error(response.statusText);
			}

			await onFinish();
		} catch (error: any) {
			setLogs((prevLogs) => [
				...prevLogs,
				t("missingDeps.logs.error.install").replace(
					"{error}",
					error?.message || error?.toString() || "Unknown error",
				),
			]);
		}
	}

	return (
		<div
			className="absolute inset-0 flex items-center justify-center bg-black/80 p-4 backdrop-blur-3xl"
			style={{ zIndex: 80 }}
		>
			{page === 0 && (
				<div className="p-6 rounded-xl border border-white/10 shadow-lg relative overflow-hidden max-w-2xl max-h-2/4 h-full w-full backdrop-blur-md">
					<div className="flex justify-between w-full items-center">
						<h2 className="font-semibold text-lg flex items-center justify-center">
							{t("missingDeps.title")}
						</h2>
						<button
							className="cursor-pointer z-50 flex items-center justify-center p-2 bg-white/10 hover:bg-white/20 rounded-full"
							type="button"
							onClick={() => set(null)}
						>
							<Icon name="Close" className="h-3 w-3" />
						</button>
					</div>
					<div className="py-6 w-full h-full flex flex-col">
						<div className="flex flex-col gap-4 w-full h-full overflow-auto border border-white/10 rounded-xl p-4">
							{data.map((dep) => (
								<>
									<div
										className="flex items-center justify-between"
										key={dep.name}
									>
										<p className="text-xs text-neutral-400">
											{dep.name}
											{dep.version ? `@${dep.version}` : ""}
										</p>
										<span>
											{dep.installed || dep.reason === "installed" ? (
												<Icon name="Installed" className="h-4 w-4" />
											) : (
												<>
													{dep.reason === "not-accepted" && (
														<Icon name="NotAccepted" className="h-4 w-4" />
													)}
													{dep.reason === "version-not-satisfied" && (
														<Icon name="NotSatisfied" className="h-4 w-4" />
													)}
													{dep.reason === "error" && (
														<Icon name="NotInstalled" className="h-4 w-4" />
													)}
												</>
											)}
										</span>
									</div>
									<div
										className="h-[0.1px] w-full bg-neutral-400/10 rounded-full last:hidden"
										key={dep}
									/>
								</>
							))}
						</div>
						<div className="mt-4 flex items-center justify-end">
							<button
								onClick={install}
								type="button"
								className="flex items-center justify-center gap-2 p-4 text-xs bg-white hover:bg-white/80 transition-colors duration-400 rounded-full text-black font-semibold py-1 text-center cursor-pointer"
							>
								{t("missingDeps.install")}
							</button>
						</div>
					</div>
				</div>
			)}
			{page === 1 && (
				<div className="p-6 rounded-xl border border-white/10 shadow-lg relative overflow-hidden max-w-2xl max-h-2/4 h-full w-full backdrop-blur-md">
					<div className="flex justify-between w-full items-center">
						<h2 className="font-semibold text-lg flex items-center justify-center">
							{t("missingDeps.installing")}
						</h2>
						<button
							className="cursor-pointer z-50 flex items-center justify-center p-2 bg-white/10 rounded-full"
							type="button"
							onClick={() => set(null)}
						>
							<Icon name="Close" className="h-3 w-3" />
						</button>
					</div>
					<div className="py-6 w-full h-full flex flex-col">
						<div className="flex flex-col gap-4 w-full max-h-60 overflow-auto border border-white/10 rounded p-4">
							{logs.map((log) => (
								<p
									className={`text-xs select-text whitespace-pre-wrap text-wrap ${log.startsWith("ERROR") || log.includes("error") ? "text-red-400" : log.startsWith("WARN:") ? "text-yellow-400" : log.startsWith("INFO:") ? "text-blue-400" : "text-neutral-300"}`}
									key={log}
								>
									{log || t("missingDeps.logs.loading")}
								</p>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
