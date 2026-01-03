import { Button, InputWithIcon } from "@/components/ui";
import { useTranslation } from "@/translations/translation-context";
import { openFolder } from "@/utils/open-link";
import { motion } from "framer-motion";
import { Folder } from "lucide-react";
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
				<Button
					variant="tertiary"
					size="md"
					onClick={() => handleCheckUpdates()}
				>
					{t("settings.other.checkUpdates.button")}
				</Button>
			</SettingItem>

			<SettingItem
				label={t("settings.other.logsDirectory.label")}
				description={t("settings.other.logsDirectory.description")}
			>
				<div className="flex gap-2 items-center justify-end w-full">
					<InputWithIcon
						required
						readOnly
						onClick={handleLogsDir}
						className="max-w-[calc(100%-12rem)] min-w-[18rem]"
						value={config.defaultLogsPath}
						onChange={(e) => {
							const value = e.target.value;
							if (value !== null && value.trim() !== "") {
								handleUpdate({ defaultLogsPath: value });
							}
						}}
						icon={<Folder className="w-4 h-4 text-neutral-300" />}
						onIconClick={() => openFolder(config.defaultLogsPath)}
						iconPosition="right"
						variant="mono"
					/>
				</div>
			</SettingItem>

			<SettingItem
				label={t("settings.other.variables.label")}
				description={t("settings.other.variables.description")}
			>
				<Button
					variant="tertiary"
					size="md"
					onClick={() => openVariablesModal(true)}
				>
					{t("settings.other.variables.button")}
				</Button>
			</SettingItem>

			<SettingItem
				label={t("settings.other.exportLogs.label")}
				description={t("settings.other.exportLogs.description")}
			>
				<Button
					variant="tertiary"
					size="md"
					onClick={() => handleExportLogs()}
				>
					{t("settings.other.exportLogs.button")}
				</Button>
			</SettingItem>

			<SettingItem
				label={t("settings.other.submitFeedback.label")}
				description={t("settings.other.submitFeedback.description")}
			>
				<Button
					variant="tertiary"
					size="md"
					onClick={() => handleReportError()}
				>
					{t("settings.other.submitFeedback.button")}
				</Button>
			</SettingItem>

			<SettingItem
				label={t("settings.other.showOnboarding.label")}
				description={t("settings.other.showOnboarding.description")}
			>
				<Button
					variant="tertiary"
					size="md"
					onClick={() => handleResetSettings()}
				>
					{t("settings.other.showOnboarding.button")}
				</Button>
			</SettingItem>

			<SettingsFooter
				packVersion={packVersion}
				port={port}
				versions={versions}
			/>
		</motion.div>
	);
}
