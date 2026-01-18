import { Select } from "@/components/ui";
import { languages, useTranslation } from "@/translations/translation-context";
import { motion } from "framer-motion";
import SettingItem from "../setting-item";
import ThemeSelector from "../theme-selector";
import ToggleSwitch from "../toggle-switch";

interface InterfaceTabProps {
	config: any;
	language: string;
	handleUpdate: (newConfig: Partial<any>) => void;
	setLanguage: (lang: any) => void;
}

export default function InterfaceTab({
	config,
	language,
	handleUpdate,
	setLanguage,
}: InterfaceTabProps) {
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
				label={t("settings.interface.displayLanguage.label")}
				description={t("settings.interface.displayLanguage.description")}
			>
				<Select
					value={language}
					onChange={(value) => setLanguage(value as any)}
					options={Object.entries(languages).map(([value, label]) => ({
						value,
						label,
					}))}
					width="w-44"
				/>
			</SettingItem>
			<SettingItem
				label={t("settings.interface.disableFeaturedVideos.label")}
				description={t("settings.interface.disableFeaturedVideos.description")}
			>
				<ToggleSwitch
					enabled={config.disableFeaturedVideos}
					onChange={() =>
						handleUpdate({
							disableFeaturedVideos: !config.disableFeaturedVideos,
						})
					}
				/>
			</SettingItem>
			<SettingItem
				label={t("settings.interface.theme.label")}
				description={t("settings.interface.theme.description")}
				layout="column"
			>
				<ThemeSelector />
			</SettingItem>
			<SettingItem
				label={t("settings.interface.layoutMode.label")}
				description={t("settings.interface.layoutMode.description")}
			>
				<Select
					value={config.layoutMode || "sidebar"}
					onChange={(value) => handleUpdate({ layoutMode: value })}
					options={[
						{
							value: "sidebar",
							label: t("settings.interface.layoutMode.sidebar"),
						},
						{
							value: "topbar",
							label: t("settings.interface.layoutMode.topbar"),
						},
					]}
					width="w-44"
				/>
			</SettingItem>

			{(config.layoutMode === "sidebar" || !config.layoutMode) && (
				<SettingItem
					label={t("settings.interface.compactView.label")}
					description={t("settings.interface.compactView.description")}
				>
					<ToggleSwitch
						enabled={config.compactMode}
						onChange={() => handleUpdate({ compactMode: !config.compactMode })}
					/>
				</SettingItem>
			)}
		</motion.div>
	);
}
