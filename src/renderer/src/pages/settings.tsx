import { getCurrentPort } from "@renderer/utils/getPort";
import { openLink } from "@renderer/utils/openLink";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@renderer/components/icons/icon";

// custom dropdown component
const CustomSelect = ({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: { value: string; label: string }[] }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="relative">
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="bg-white/10 border text-left border-white/5 text-neutral-200 h-10 px-4 w-44 rounded-full text-sm focus:outline-none hover:bg-white/20 backdrop-blur-sm cursor-pointer transition-colors duration-400 flex items-center justify-between"
			>
				<span>{options.find(opt => opt.value === value)?.label}</span>
				<span className="ml-2">{isOpen ? '▲' : '▼'}</span>
			</button>
			{isOpen && (
				<div className="absolute z-50 mt-1 w-44 rounded-xl bg-[#1a1a1a] border border-white/5 shadow-lg backdrop-blur-xl">
					{options.map((option) => (
						<button
							key={option.value}
							onClick={() => {
								onChange(option.value);
								setIsOpen(false);
							}}
							className={`w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors duration-200 ${
								option.value === value ? 'text-white bg-white/20' : 'text-neutral-300'
							} ${option.value === options[0].value ? 'rounded-t-xl' : ''} ${
								option.value === options[options.length - 1].value ? 'rounded-b-xl' : ''
							}`}
						>
							{option.label}
						</button>
					))}
				</div>
			)}
		</div>
	);
};

export default function Settings() {
	const [port, setPort] = useState<number | null>(null);
	const [versions] = useState(window.electron.process.versions);
	const [config, setConfig] = useState<any | null>(null);
	// const logged = JSON.parse(localStorage.getItem("user") || "{}");
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

	const handleReportError = (error?: Error | string) => {
		navigate("/report", { state: { error } });
	};

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
											Applications
										</h2>
										<div className="flex flex-col gap-2">
											<div className="flex justify-between w-full items-center h-full space-y-2">
												<div className="h-full flex items-start justify-center flex-col mt-auto">
													<label className="text-neutral-200 font-medium">
														Installation Directory
													</label>
													<p className="text-xs text-neutral-400 w-80">
														Choose where new applications will be installed by default
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
															className="text-xs font-mono text-center text-neutral-300 pl-6 pr-12 focus:outline-none focus:ring-none rounded-full max-w-[calc(100%-12rem)] min-w-[18rem] w-fit truncate h-10 bg-white/10 backdrop-blur-3xl cursor-pointer hover:bg-white/20 duration-200 transition-colors"
														/>
														<div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
															<Icon name="Folder" className="w-4 h-4 text-neutral-400" />
														</div>
													</div>
												</div>
											</div>
											<div className="flex justify-between w-full items-center h-full space-y-2">
												<div className="h-full flex items-start justify-center flex-col mt-auto">
													<label className="text-neutral-200 font-medium">
														Clean Uninstall
													</label>
													<p className="text-xs text-neutral-400">
														Remove all related dependencies when uninstalling applications
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
											Interface
										</h2>
										<div className="flex justify-between w-full items-center h-full space-y-2">
											<div className="h-full flex items-start justify-center flex-col mt-auto">
												<label className="text-neutral-200 font-medium">
													Display Language
												</label>
												<p className="text-xs text-neutral-400">
													Choose your preferred interface language
												</p>
											</div>
											<CustomSelect
												value={config.language}
												onChange={(value) => handleUpdate({ language: value })}
												options={[
													{ value: "en", label: "English" }
												]}
											/>
										</div>
										<div className="mt-1">
											<a 
												href="https://github.com/dioneapp/dioneapp" 
												target="_blank" 
												rel="noopener noreferrer"
												className="text-xs text-neutral-400 hover:text-neutral-200 transition-colors duration-200 px-2 py-0.5 rounded-xl bg-white/10"
											>
												🤔 Not seeing your language? Help us add more!
											</a>
										</div>
									</div>
									<div className="flex flex-col space-y-4">
										<div className="flex justify-between w-full items-center h-full space-y-2">
											<div className="h-full flex items-start justify-center flex-col mt-auto">
												<label className="text-neutral-200 font-medium">
													Compact View
												</label>
												<p className="text-xs text-neutral-400">
													Use a more condensed layout to fit more content on screen
												</p>
											</div>
											<button
												type="button"
												onClick={() =>
													handleUpdate({ compactMode: !config.compactMode })
												}
												className={`relative w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 border border-white/5 cursor-pointer ${
													config.compactMode
														? "bg-green-500/30"
														: "bg-red-500/30"
												}`}
											>
												<span
													className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
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
											Notifications
										</h2>
										<div className="flex flex-col gap-2">
											<div className="flex justify-between w-full items-center h-full space-y-2">
												<div className="h-full flex items-start justify-center flex-col mt-auto">
													<label className="text-neutral-200 font-medium">
														System Notifications
													</label>
													<p className="text-xs text-neutral-400">
														Show desktop notifications for important events
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
														Installation Alerts
													</label>
													<p className="text-xs text-neutral-400">
														Get notified when application installations complete
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
											Privacy
										</h2>
										<div className="flex flex-col gap-2">
											<div className="flex justify-between w-full items-center h-full space-y-2">
												<div className="h-full flex items-start justify-center flex-col mt-auto">
													<label className="text-neutral-200 font-medium">
														Error Reporting
													</label>
													<p className="text-xs text-neutral-400">
														Help improve Dione by sending anonymous error reports
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
										{/* Logs */}
										<div className="w-full h-0.5 bg-white/10 mt-4 mb-8" />
										<h2 className="text-2xl sm:text-3xl font-semibold mb-6">
											Logs
										</h2>
										<div className="flex flex-col gap-2">
											<div className="flex justify-between w-full items-center h-full space-y-2">
												<div className="h-full flex items-start justify-center flex-col mt-auto">
													<label className="text-neutral-200 font-medium">
														Logs Directory
													</label>
													<p className="text-xs text-neutral-400">
														Location where application logs are stored
													</p>
												</div>
												<div className="flex gap-2 items-center justify-end w-full">
													<div className="relative">
														<input
															required
															readOnly
															className="text-xs font-mono text-center text-neutral-300 pl-6 pr-12 focus:outline-none focus:ring-none rounded-full max-w-[calc(100%-12rem)] min-w-[18rem] w-fit truncate h-10 bg-white/10 backdrop-blur-3xl cursor-pointer hover:bg-white/20 duration-200 transition-colors"
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
															<Icon name="Folder" className="w-4 h-4 text-neutral-400" />
														</div>
													</div>
												</div>
											</div>
											<div className="flex justify-between w-full items-center h-full space-y-2">
												<div className="h-full flex items-start justify-center flex-col mt-auto">
													<label className="text-neutral-200 font-medium">
														Submit Feedback
													</label>
													<p className="text-xs text-neutral-400">
														Report any issues or problems you encounter
													</p>
												</div>
												<button
													onClick={() => handleReportError()}
													className="px-6 py-2 text-sm font-medium bg-white text-black rounded-full hover:bg-white/80 disabled:opacity-50 transition-colors cursor-pointer"
													type="button"
												>
													Send Report
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
