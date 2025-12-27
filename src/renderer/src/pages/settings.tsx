import { useAuthContext } from "@/components/contexts/auth-context";
import VariablesModal from "@/components/modals/variables";
import SettingsTabs, {
	type TabType,
} from "@/components/settings/settings-tabs";
import ApplicationsTab from "@/components/settings/tabs/applications-tab";
import InterfaceTab from "@/components/settings/tabs/interface-tab";
import NotificationsTab from "@/components/settings/tabs/notifications-tab";
import OtherTab from "@/components/settings/tabs/other-tab";
import PrivacyTab from "@/components/settings/tabs/privacy-tab";
import { useTranslation } from "@/translations/translation-context";
import { apiFetch, apiJson, getBackendPort } from "@/utils/api";
import { joinPath } from "@/utils/path";
import { useToast } from "@/utils/use-toast";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useScriptsContext } from "../components/contexts/scripts-context";

export default function Settings() {
	const [port, setPort] = useState<number | null>(null);
	const [packVersion, setPackVersion] = useState<string | null>(null);
	const [versions] = useState<{
		node: string;
		electron: string;
		chrome: string;
	}>({
		node: window.electron.process.versions.node || "",
		electron: window.electron.process.versions.electron || "",
		chrome: window.electron.process.versions.chrome || "",
	});
	const [config, setConfig] = useState<any | null>(null);
	const { setLanguage, language, t } = useTranslation();
	const { logout } = useAuthContext();
	const { handleReloadQuickLaunch } = useScriptsContext();
	const navigate = useNavigate();
	const { addToast } = useToast();

	const [cacheSize, setCacheSize] = useState<number | null>(null);
	const [deleteCacheStatus, setDeleteCacheStatus] = useState<string | null>(
		null,
	);
	const [variablesModal, setVariablesModal] = useState(false);
	const [activeTab, setActiveTab] = useState<TabType>("applications");

	useEffect(() => {
		const fetchPort = async () => {
			const currentPort = await getBackendPort();
			setPort(currentPort);
		};
		fetchPort();
	}, []);

	useEffect(() => {
		const fetchVersion = async () => {
			const version = await window.electron.ipcRenderer.invoke("get-version");
			setPackVersion(version);
		};
		fetchVersion();
	}, []);

	useEffect(() => {
		fetchConfig();
	}, []);

	useEffect(() => {
		fetchCacheSize();
	}, []);

	async function fetchCacheSize() {
		window.electron.ipcRenderer
			.invoke("check-folder-size")
			.then((size) => setCacheSize(size || 0))
			.catch((error) => {
				console.error("Error loading cache size:", error);
				setCacheSize(0);
			});
	}

	async function fetchConfig() {
		try {
			const data = await apiJson<any>("/config");
			setConfig(data);
		} catch (err) {
			console.error("Failed to load config:", err);
		}
	}

	// handle to update config
	const handleUpdate = async (newConfig: Partial<any>) => {
		if (!config) return;
		console.log("new config:", JSON.stringify({ ...config, ...newConfig }));
		try {
			const updatedConfig = await apiJson<any>("/config/update", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ ...config, ...newConfig }),
			});

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
							<text>${t("notifications.enabled.title")}</text>
							<text>${t("notifications.enabled.description")}</text>
						</binding>
					</visual>
					<actions>
						<action content="${t("notifications.learnMore")}" activationType="protocol" arguments="https://getdione.app/docs" />
					</actions>
				</toast>
				`;
				window.electron.ipcRenderer.invoke(
					"notify",
					t("notifications.enabled.title"),
					t("notifications.enabled.description"),
					xml as string,
				);
			}

			setConfig(updatedConfig);
			// update local storage
			localStorage.setItem("config", JSON.stringify(updatedConfig));
			window.dispatchEvent(new Event("config-updated"));
			if (
				updatedConfig.defaultInstallFolder !== config.defaultInstallFolder ||
				updatedConfig.defaultBinFolder !== config.defaultBinFolder
			) {
				handleReloadQuickLaunch();
			}
		} catch (error) {
			console.error("Error updating config:", error);
		}
	};

	async function handleSaveDir(setting1: string, setting2?: string) {
		const result = await window.electron.ipcRenderer.invoke(
			"save-dir",
			joinPath(config[setting1], "apps"),
		);
		if (!result.canceled && result.filePaths[0]) {
			const chosen = result.filePaths[0];
			// disallow any whitespace in path
			if (/\s/.test(chosen)) {
				alert(
					"Selected path cannot contain spaces. Please choose a different folder.",
				);
				return;
			}
			if (setting2) {
				handleUpdate({
					[setting1]: chosen,
					[setting2]: chosen,
				});
			} else {
				handleUpdate({ [setting1]: chosen });
			}
		}
	}

	async function handleLogsDir() {
		const result = await window.electron.ipcRenderer.invoke(
			"save-dir",
			config.defaultLogsPath,
		);
		if (!result.canceled && result.filePaths[0]) {
			handleUpdate({ defaultLogsPath: result.filePaths[0] });
		}
	}

	const handleReportError = (error?: Error | string) => {
		navigate("/report", { state: { error } });
	};

	async function handleResetSettings() {
		localStorage.clear();
		await apiFetch("/config/delete", {
			method: "POST",
		});
		await window.electron.ipcRenderer.invoke("check-first-launch");
		await logout();
		// terminate session
		window.electron.ipcRenderer.send("end-session");
		navigate("/first-time");
	}

	async function handleDeleteCache() {
		setDeleteCacheStatus("deleting");
		const result = await window.electron.ipcRenderer.invoke("delete-folder");
		if (result) {
			console.log("Cache deleted successfully");
			setDeleteCacheStatus("deleted");
			setTimeout(() => {
				setDeleteCacheStatus(null);
			}, 3000);
			fetchCacheSize();
		} else {
			console.error("Failed to delete cache");
			setDeleteCacheStatus("error");
		}
	}

	const openVariablesModal = (state: boolean) => {
		setVariablesModal(state);
	};

	const handleCheckUpdates = () => {
		window.electron.ipcRenderer.invoke("check-update-and-notify");
	};

	const handleExportLogs = async () => {
		try {
			const result =
				await window.electron.ipcRenderer.invoke("export-debug-logs");

			if (result.canceled) {
				return;
			}

			if (result.success) {
				addToast({
					variant: "success",
					children: "Debug logs exported successfully",
				});
				console.log("Debug logs exported to:", result.path);
			} else {
				console.error("Failed to export debug logs:", result.error);
				addToast({
					variant: "error",
					children: "Failed to export debug logs. Please try again.",
				});
			}
		} catch (error) {
			console.error("Error exporting debug logs:", error);
			addToast({
				variant: "error",
				children: "Failed to export debug logs. Please try again.",
			});
		}
	};

	const renderTabContent = () => {
		if (!config) return null;

		switch (activeTab) {
			case "applications":
				return (
					<ApplicationsTab
						config={config}
						cacheSize={cacheSize}
						deleteCacheStatus={deleteCacheStatus}
						handleUpdate={handleUpdate}
						handleSaveDir={handleSaveDir}
						handleDeleteCache={handleDeleteCache}
					/>
				);

			case "interface":
				return (
					<InterfaceTab
						config={config}
						language={language}
						handleUpdate={handleUpdate}
						setLanguage={setLanguage}
					/>
				);

			case "notifications":
				return <NotificationsTab config={config} handleUpdate={handleUpdate} />;

			case "privacy":
				return <PrivacyTab config={config} handleUpdate={handleUpdate} />;

			case "other":
				return (
					<OtherTab
						config={config}
						handleUpdate={handleUpdate}
						handleLogsDir={handleLogsDir}
						handleCheckUpdates={handleCheckUpdates}
						handleExportLogs={handleExportLogs}
						openVariablesModal={openVariablesModal}
						handleReportError={handleReportError}
						handleResetSettings={handleResetSettings}
						packVersion={packVersion || "loading..."}
						port={port || 0}
						versions={versions}
					/>
				);

			default:
				return null;
		}
	};

	return (
		<>
			<div className="h-full pt-4">
				<div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
					<main className="flex flex-col gap-6 py-5">
						{/* Header */}
						<div className="flex flex-col gap-2">
							<h1 className="text-2xl sm:text-3xl font-semibold">Settings</h1>
							<p className="text-sm text-neutral-400">
								Manage your application preferences and configurations
							</p>
						</div>

						{/* Tabs Navigation */}
						<SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

						{/* Tab Content */}
						{config && (
							<div className="border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm rounded-xl p-6 h-full">
								<AnimatePresence mode="wait">
									{renderTabContent()}
								</AnimatePresence>
							</div>
						)}
					</main>
				</div>
			</div>
			{variablesModal && (
				<div>
					<VariablesModal onClose={() => openVariablesModal(false)} />
				</div>
			)}
		</>
	);
}
