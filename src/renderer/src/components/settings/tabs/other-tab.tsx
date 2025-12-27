import { useTranslation } from "@/translations/translation-context";
import { openFolder } from "@/utils/open-link";
import { motion } from "framer-motion";
import CustomInput from "../custom-input";
import SettingItem from "../setting-item";
import SettingsFooter from "../settings-footer";
import ToggleSwitch from "../toggle-switch";

interface OtherTabProps {
	config: any;
	handleUpdate: (newConfig: Partial<any>) => void;
	handleLogsDir: () => void;
	handleCheckUpdates: () => void;
	handleExportLogs: () => void;
	openVariablesModal: (state: boolean) => void;
	handleReportError: () => void;
	handleResetSettings: () => void;
	packVersion: string;
	port: number;
	versions: { node: string; electron: string; chrome: string };
}

export default function OtherTab({
	config,
	handleUpdate,
	handleLogsDir,
	handleCheckUpdates,
	handleExportLogs,
	openVariablesModal,
	handleReportError,
	handleResetSettings,
	packVersion,
	port,
	versions,
}: OtherTabProps) {
	const { t } = useTranslation();

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.2 }}
			className="flex flex-col gap-6"
		>
			<SettingItem
				label={t("settings.other.disableAutoUpdate.label")}
				description={t("settings.other.disableAutoUpdate.description")}
			>
				<ToggleSwitch
					enabled={config.disableAutoUpdate}
					onChange={() =>
						handleUpdate({
							disableAutoUpdate: !config.disableAutoUpdate,
						})
					}
				/>
			</SettingItem>

			<SettingItem
				label={t("settings.other.checkUpdates.label")}
				description={t("settings.other.checkUpdates.description")}
			>
				<button
					onClick={() => handleCheckUpdates()}
					className="px-6 py-2 text-sm font-medium bg-white text-black rounded-xl hover:bg-white/80 disabled:opacity-50 transition-colors cursor-pointer"
					type="button"
				>
					{t("settings.other.checkUpdates.button")}
				</button>
			</SettingItem>

			<SettingItem
				label={t("settings.other.logsDirectory.label")}
				description={t("settings.other.logsDirectory.description")}
			>
				<CustomInput
					value={config.defaultLogsPath}
					onChange={(value) => handleUpdate({ defaultLogsPath: value })}
					onClick={handleLogsDir}
					onClickIcon={() => openFolder(config.defaultLogsPath)}
				/>
			</SettingItem>

			<SettingItem
				label={t("settings.other.variables.label")}
				description={t("settings.other.variables.description")}
			>
				<button
					onClick={() => openVariablesModal(true)}
					className="px-6 py-2 text-sm font-medium bg-white text-black rounded-xl hover:bg-white/80 disabled:opacity-50 transition-colors cursor-pointer"
					type="button"
				>
					{t("settings.other.variables.button")}
				</button>
			</SettingItem>

			<SettingItem
				label={t("settings.other.exportLogs.label")}
				description={t("settings.other.exportLogs.description")}
			>
				<button
					onClick={() => handleExportLogs()}
					className="px-6 py-2 text-sm font-medium bg-white text-black rounded-xl hover:bg-white/80 disabled:opacity-50 transition-colors cursor-pointer"
					type="button"
				>
					{t("settings.other.exportLogs.button")}
				</button>
			</SettingItem>

			<SettingItem
				label={t("settings.other.submitFeedback.label")}
				description={t("settings.other.submitFeedback.description")}
			>
				<button
					onClick={() => handleReportError()}
					className="px-6 py-2 text-sm font-medium bg-white text-black rounded-xl hover:bg-white/80 disabled:opacity-50 transition-colors cursor-pointer"
					type="button"
				>
					{t("settings.other.submitFeedback.button")}
				</button>
			</SettingItem>

			<SettingItem
				label={t("settings.other.showOnboarding.label")}
				description={t("settings.other.showOnboarding.description")}
			>
				<button
					onClick={() => handleResetSettings()}
					className="px-6 py-2 text-sm font-medium bg-white text-black rounded-xl hover:bg-white/80 disabled:opacity-50 transition-colors cursor-pointer"
					type="button"
				>
					{t("settings.other.showOnboarding.button")}
				</button>
			</SettingItem>

			<SettingsFooter
				packVersion={packVersion}
				port={port}
				versions={versions}
			/>
		</motion.div>
	);
}
