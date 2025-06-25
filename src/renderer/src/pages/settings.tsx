import { getCurrentPort } from "@renderer/utils/getPort";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Folder } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { languages, useTranslation } from "../translations/translationContext";
import { openLink } from "../utils/openLink";

// custom dropdown component
const CustomSelect = ({
	value,
	onChange,
	options,
}: {
	value: string;
	onChange: (value: string) => void;
	options: { value: string; label: string }[];
}) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="relative">
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="bg-white/10 border text-left border-white/5 text-neutral-200 h-10 px-4 w-44 rounded-full text-sm focus:outline-none hover:bg-white/20 cursor-pointer transition-colors duration-400 flex items-center justify-between"
			>
				<span>{options.find((opt) => opt.value === value)?.label}</span>
				<motion.div
					animate={{ rotate: isOpen ? 180 : 0 }}
					transition={{ duration: 0.35 }}
					className="ml-2"
				>
					<ChevronDown className="w-4 h-4" />
				</motion.div>
			</button>

			<AnimatePresence>
				{isOpen && (
					<>
						<div
							className="fixed inset-0 z-40"
							onClick={() => setIsOpen(false)}
						/>
						<motion.div
							key="dropdown"
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 10 }}
							transition={{ duration: 0.22 }}
							className="backdrop-blur-md backdrop-filter absolute z-50 mt-2 w-44 p-2 rounded-xl border border-white/5 shadow-lg bg-[#2e2d32]/90"
						>
							<div className="flex flex-col gap-1">
								{options.map((option) => (
									<button
										type="button"
										key={option.value}
										onClick={() => {
											onChange(option.value);
											setIsOpen(false);
										}}
										className={`w-full text-left rounded-xl px-4 py-2 text-sm transition-colors duration-200 
											${
												option.value !== value
													? "hover:bg-white/20 cursor-pointer text-neutral-300 hover:text-white"
													: "bg-white/20 text-white"
											}`}
									>
										{option.label}
									</button>
								))}
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</div>
	);
};

export default function Settings() {
	const [port, setPort] = useState<number | null>(null);
	const [versions] = useState(window.electron.process.versions);
	const [config, setConfig] = useState<any | null>(null);
	const { setLanguage, t } = useTranslation();
	const navigate = useNavigate();

	useEffect(() => {
		// get actual port
		const fetchPort = async () => {
			const currentPort = await getCurrentPort();
			setPort(currentPort);
		};
		fetchPort();

		// fetch config
		fetchConfig();
	}, [port]);

	async function fetchConfig() {
		if (port) {
			fetch(`http://localhost:${port}/config`)
				.then((res) => res.json())
				.then((data) => setConfig(data))
				.catch((err) => console.error("Failed to load config:", err));
		}
	}

	// handle to update config
	const handleUpdate = async (newConfig: Partial<any>) => {
		if (!port || !config) return;
		console.log("new config:", JSON.stringify({ ...config, ...newConfig }));
		try {
			const response = await fetch(`http://localhost:${port}/config/update`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ ...config, ...newConfig }),
			});

			if (!response.ok) throw new Error("Failed to update config");
			const updatedConfig = await response.json();

			// update language in translation context if language changed
			if (newConfig.language && newConfig.language !== config.language) {
				setLanguage(newConfig.language);
			}

			if (
				updatedConfig.enableDesktopNotifications === true &&
				updatedConfig.enableDesktopNotifications !==
					config.enableDesktopNotifications
			) {
				const xml = `
				<toast launch="dione://action=navigate&amp;contentId=351" activationType="protocol">
					<visual>
						<binding template="ToastGeneric">
							<text>Notifications enabled</text>
							<text>You will receive notifications for important events.</text>
						</binding>
					</visual>
					<actions>
						<action content="Learn more" activationType="protocol" arguments="https://getdione.app/docs" />
					</actions>
				</toast>
				`;
				window.electron.ipcRenderer.invoke(
					"notify",
					"Notifications enabled",
					"You will receive notifications for important events.",
					xml as string,
				);
			}

			setConfig(updatedConfig);
			// update local storage
			localStorage.setItem("config", JSON.stringify(updatedConfig));
			window.dispatchEvent(new Event("config-updated"));
		} catch (error) {
			console.error("Error updating config:", error);
		}
	};

	async function handleSaveDir() {
		const result = await window.electron.ipcRenderer.invoke(
			"save-dir",
			`${config.defaultInstallFolder}\\apps`,
		);
		console.log("result", result);
		if (!result.canceled && result.filePaths[0]) {
			handleUpdate({ defaultInstallFolder: result.filePaths[0] });
		}
	}

	async function handleLogsDir() {
		const result = await window.electron.ipcRenderer.invoke(
			"save-dir",
			config.defaultLogsPath,
		);
		console.log("result", result);
		if (!result.canceled && result.filePaths[0]) {
			handleUpdate({ defaultLogsPath: result.filePaths[0] });
		}
	}

	const handleReportError = (error?: Error | string) => {
		navigate("/report", { state: { error } });
	};

	async function handleResetSettings() {
		await window.electron.ipcRenderer.invoke("delete-config");
		localStorage.removeItem("session");
		localStorage.removeItem("user");
		localStorage.removeItem("dbUser");
		// terminate session
		window.electron.ipcRenderer.send("end-session");
		navigate("/first-time");
	}

	return (
		<div className="min-h-screen bg-background pt-4">
			<div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
				<main className="flex flex-col gap-6 py-5">
					{/* background */}
					<div className="absolute top-0 left-0 w-full h-full bg-gradient-to-bl from-[#BCB1E7] to-[#080808] opacity-15 rounded-3xl blur-3xl z-0" />
					<div>
						<div className="flex flex-col space-y-4 h-full">
							{config && (
								<div className="flex flex-col space-y-8 h-full z-50 mb-12">
									<div className="flex flex-col">
										{/* Apps */}
										<h2 className="text-2xl sm:text-3xl font-semibold mb-6">
											{t("settings.applications.title")}
										</h2>
										<div className="flex flex-col gap-2">
											<div className="flex justify-between w-full items-center h-full space-y-2">
												<div className="h-full flex items-start justify-center flex-col mt-auto">
													<label className="text-neutral-200 font-medium">
														{t(
															"settings.applications.installationDirectory.label",
														)}
													</label>
													<p className="text-xs text-neutral-400 w-80">
														{t(
															"settings.applications.installationDirectory.description",
														)}
													</p>
												</div>
												<div className="flex gap-2 items-center justify-end w-full">
													<div className="relative">
														<input
															onClick={handleSaveDir}
															type="text"
															placeholder="Select folder"
															readOnly
															value={`${config.defaultInstallFolder}\\apps`}
															className="bg-white/10 border border-white/5 text-neutral-200 font-mono text-sm h-10 px-4 pr-12 rounded-full truncate max-w-[calc(100%-12rem)] min-w-[18rem] focus:outline-none hover:bg-white/20 cursor-pointer transition-colors duration-200"
														/>
														<div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
															<Folder className="w-4 h-4 text-neutral-400" />
														</div>
													</div>
												</div>
											</div>
											<div className="flex justify-between w-full items-center h-full space-y-2">
												<div className="h-full flex items-start justify-center flex-col mt-auto">
													<label className="text-neutral-200 font-medium">
														{t("settings.applications.cleanUninstall.label")}
													</label>
													<p className="text-xs text-neutral-400">
														{t(
															"settings.applications.cleanUninstall.description",
														)}
													</p>
												</div>
												<button
													type="button"
													onClick={() =>
														handleUpdate({
															alwaysUninstallDependencies:
																!config.alwaysUninstallDependencies,
														})
													}
													className={`relative w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 border border-white/5 cursor-pointer ${
														config.alwaysUninstallDependencies
															? "bg-green-500/30"
															: "bg-red-500/30"
													}`}
												>
													<span
														className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
															config.alwaysUninstallDependencies
																? "translate-x-6"
																: "translate-x-0"
														}`}
													/>
												</button>
											</div>
										</div>
									</div>
									<div className="flex flex-col">
										{/* Interface */}
										<div className="w-full h-0.5 bg-white/10 mt-4 mb-8" />
										<h2 className="text-2xl sm:text-3xl font-semibold mb-6">
											{t("settings.interface.title")}
										</h2>
										<div className="flex justify-between w-full items-center h-full space-y-2">
											<div className="h-full flex items-start justify-center flex-col mt-auto">
												<label className="text-neutral-200 font-medium">
													{t("settings.interface.displayLanguage.label")}
												</label>
												<p className="text-xs text-neutral-400">
													{t("settings.interface.displayLanguage.description")}
												</p>
											</div>
											<CustomSelect
												value={config.language}
												onChange={(value) => handleUpdate({ language: value })}
												options={Object.entries(languages).map(
													([value, label]) => ({ value, label }),
												)}
											/>
										</div>
										<div>
											<a
												href="https://github.com/dioneapp/dioneapp"
												target="_blank"
												rel="noopener noreferrer"
												className="text-xs text-neutral-400 hover:text-neutral-200 transition-colors duration-200 px-2 py-0.5 rounded-xl bg-white/10"
											>
												{t("settings.interface.helpTranslate")}
											</a>
										</div>
									</div>
									<div className="flex flex-col space-y-4">
										<div className="flex justify-between w-full items-center h-full space-y-2">
											<div className="h-full flex items-start justify-center flex-col mt-auto">
												<label className="text-neutral-200 font-medium">
													{t("settings.interface.compactView.label")}
												</label>
												<p className="text-xs text-neutral-400">
													{t("settings.interface.compactView.description")}
												</p>
											</div>
											<button
												type="button"
												onClick={() =>
													handleUpdate({ compactMode: !config.compactMode })
												}
												className={`relative w-12 h-6 flex items-center rounded-full p-1 duration-300 border border-white/5 cursor-pointer ${
													config.compactMode
														? "bg-green-500/30"
														: "bg-red-500/30"
												}`}
											>
												<span
													className={`bg-white w-4 h-4 rounded-full shadow-md duration-300 ${
														config.compactMode
															? "translate-x-6"
															: "translate-x-0"
													}`}
												/>
											</button>
										</div>
									</div>
									{/*  */}
									<div className="flex flex-col">
										{/* Account */}
										<div className="w-full h-0.5 bg-white/10 mt-4 mb-8" />
										<h2 className="text-2xl sm:text-3xl font-semibold mb-6">
											{t("settings.notifications.title")}
										</h2>
										<div className="flex flex-col gap-2">
											<div className="flex justify-between w-full items-center h-full space-y-2">
												<div className="h-full flex items-start justify-center flex-col mt-auto">
													<label className="text-neutral-200 font-medium">
														{t(
															"settings.notifications.systemNotifications.label",
														)}
													</label>
													<p className="text-xs text-neutral-400">
														{t(
															"settings.notifications.systemNotifications.description",
														)}
													</p>
												</div>
												<button
													type="button"
													onClick={() =>
														handleUpdate({
															enableDesktopNotifications:
																!config.enableDesktopNotifications,
														})
													}
													className={`relative w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 border border-white/5 cursor-pointer ${
														config.enableDesktopNotifications
															? "bg-green-500/30"
															: "bg-red-500/30"
													}`}
												>
													<span
														className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
															config.enableDesktopNotifications
																? "translate-x-6"
																: "translate-x-0"
														}`}
													/>
												</button>
											</div>
											<div className="flex justify-between w-full items-center h-full space-y-2">
												<div className="h-full flex items-start justify-center flex-col mt-auto">
													<label className="text-neutral-200 font-medium">
														{t(
															"settings.notifications.installationAlerts.label",
														)}
													</label>
													<p className="text-xs text-neutral-400">
														{t(
															"settings.notifications.installationAlerts.description",
														)}
													</p>
												</div>
												<button
													type="button"
													onClick={() =>
														handleUpdate({
															notifyOnInstallComplete:
																!config.notifyOnInstallComplete,
														})
													}
													className={`relative w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 border border-white/5 cursor-pointer ${
														config.notifyOnInstallComplete
															? "bg-green-500/30"
															: "bg-red-500/30"
													}`}
												>
													<span
														className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
															config.notifyOnInstallComplete
																? "translate-x-6"
																: "translate-x-0"
														}`}
													/>
												</button>
											</div>
										</div>
									</div>
									{/*  */}
									<div className="flex flex-col">
										{/* Privacy */}
										<div className="w-full h-0.5 bg-white/10 mt-4 mb-8" />
										<h2 className="text-2xl sm:text-3xl font-semibold mb-6">
											{t("settings.privacy.title")}
										</h2>
										<div className="flex flex-col gap-2">
											<div className="flex justify-between w-full items-center h-full space-y-2">
												<div className="h-full flex items-start justify-center flex-col mt-auto">
													<label className="text-neutral-200 font-medium">
														{t("settings.privacy.errorReporting.label")}
													</label>
													<p className="text-xs text-neutral-400">
														{t("settings.privacy.errorReporting.description")}
													</p>
												</div>
												<button
													type="button"
													onClick={() =>
														handleUpdate({
															sendAnonymousReports:
																!config.sendAnonymousReports,
														})
													}
													className={`relative w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 border border-white/5 cursor-pointer ${
														config.sendAnonymousReports
															? "bg-green-500/30"
															: "bg-red-500/30"
													}`}
												>
													<span
														className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
															config.sendAnonymousReports
																? "translate-x-6"
																: "translate-x-0"
														}`}
													/>
												</button>
											</div>
										</div>
									</div>
									{/*  */}
									<div className="flex flex-col">
										{/* Other */}
										<div className="w-full h-0.5 bg-white/10 mt-4 mb-8" />
										<h2 className="text-2xl sm:text-3xl font-semibold mb-6">
											{t("settings.other.title")}
										</h2>
										<div className="flex flex-col gap-2">
											<div className="flex justify-between w-full items-center h-full space-y-2">
												<div className="h-full flex items-start justify-center flex-col mt-auto">
													<label className="text-neutral-200 font-medium">
														{t("settings.other.logsDirectory.label")}
													</label>
													<p className="text-xs text-neutral-400">
														{t("settings.other.logsDirectory.description")}
													</p>
												</div>
												<div className="flex gap-2 items-center justify-end w-full">
													<div className="relative">
														<input
															required
															readOnly
															onClick={handleLogsDir}
															className="bg-white/10 border border-white/5 text-neutral-200 font-mono text-sm h-10 px-4 pr-12 rounded-full truncate max-w-[calc(100%-12rem)] min-w-[18rem] focus:outline-none hover:bg-white/20 cursor-pointer transition-colors duration-200"
															type="text"
															value={config.defaultLogsPath}
															onChange={(e) => {
																const value = e.target.value;
																if (value !== null && value.trim() !== "") {
																	handleUpdate({ defaultLogsPath: value });
																}
															}}
														/>
														<div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
															<Folder className="w-4 h-4 text-neutral-400" />
														</div>
													</div>
												</div>
											</div>
											<div className="flex justify-between w-full items-center h-full space-y-2">
												<div className="h-full flex items-start justify-center flex-col mt-auto">
													<label className="text-neutral-200 font-medium">
														{t("settings.other.submitFeedback.label")}
													</label>
													<p className="text-xs text-neutral-400">
														{t("settings.other.submitFeedback.description")}
													</p>
												</div>
												<button
													onClick={() => handleReportError()}
													className="px-6 py-2 text-sm font-medium bg-white text-black rounded-full hover:bg-white/80 disabled:opacity-50 transition-colors cursor-pointer"
													type="button"
												>
													{t("settings.other.submitFeedback.button")}
												</button>
											</div>
											<div className="flex justify-between w-full items-center h-full space-y-2">
												<div className="h-full flex items-start justify-center flex-col mt-auto">
													<label className="text-neutral-200 font-medium">
														{t("settings.other.showOnboarding.label")}
													</label>
													<p className="text-xs text-neutral-400">
														{t("settings.other.showOnboarding.description")}
													</p>
												</div>
												<button
													onClick={() => handleResetSettings()}
													className="px-6 py-2 text-sm font-medium bg-white text-black rounded-full hover:bg-white/80 disabled:opacity-50 transition-colors cursor-pointer"
													type="button"
												>
													{t("settings.other.showOnboarding.button")}
												</button>
											</div>
										</div>
									</div>
								</div>
							)}
							<div className="w-full flex items-end justify-between text-xs text-neutral-500 z-50 mt-14 pb-4">
								<div>
									<a
										href="https://getdione.app"
										target="_blank"
										rel="noopener noreferrer"
										className="hover:underline cursor-pointer"
									>
										getdione.app
									</a>
									<p>built with &hearts;</p>
								</div>
								<div className="text-right">
									<p>
										Port{" "}
										<button
											type="button"
											onClick={() => openLink(`http://localhost:${port}`)}
											className="hover:underline cursor-pointer"
										>
											{port}
										</button>
									</p>
									<p>Node v{versions.node}</p>
									<p>Electron v{versions.electron}</p>
									<p>Chromium v{versions.chrome}</p>
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
