import { useTranslation } from "@/translations/translation-context";
import { motion } from "framer-motion";
import SettingItem from "../setting-item";
import ToggleSwitch from "../toggle-switch";

interface NotificationsTabProps {
	config: any;
	handleUpdate: (newConfig: Partial<any>) => void;
}

export default function NotificationsTab({
	config,
	handleUpdate,
}: NotificationsTabProps) {
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
				label={t("settings.notifications.systemNotifications.label")}
				description={t(
					"settings.notifications.systemNotifications.description",
				)}
			>
				<ToggleSwitch
					enabled={config.enableDesktopNotifications}
					onChange={() =>
						handleUpdate({
							enableDesktopNotifications: !config.enableDesktopNotifications,
						})
					}
				/>
			</SettingItem>

			<SettingItem
				label={t("settings.notifications.installationAlerts.label")}
				description={t("settings.notifications.installationAlerts.description")}
			>
				<ToggleSwitch
					enabled={config.notifyOnInstallComplete}
					onChange={() =>
						handleUpdate({
							notifyOnInstallComplete: !config.notifyOnInstallComplete,
						})
					}
				/>
			</SettingItem>

			<SettingItem
				label={t("settings.notifications.discordRPC.label")}
				description={t("settings.notifications.discordRPC.description")}
			>
				<ToggleSwitch
					enabled={config.enableDiscordRPC}
					onChange={() =>
						handleUpdate({
							enableDiscordRPC: !config.enableDiscordRPC,
						})
					}
				/>
			</SettingItem>

			<SettingItem
				label={t("settings.notifications.successSound.label")}
				description={t("settings.notifications.successSound.description")}
			>
				<ToggleSwitch
					enabled={config.enableSuccessSound}
					onChange={() =>
						handleUpdate({
							enableSuccessSound: !config.enableSuccessSound,
						})
					}
				/>
			</SettingItem>
		</motion.div>
	);
}
