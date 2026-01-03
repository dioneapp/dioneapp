import { Button, InputWithIcon } from "@/components/ui";
import { useTranslation } from "@/translations/translation-context";
import AnimatedCount from "@/utils/animate-count";
import { openFolder } from "@/utils/open-link";
import { joinPath } from "@/utils/path";
import { motion } from "framer-motion";
import { Folder, Trash2 } from "lucide-react";
import SettingItem from "../setting-item";
import ToggleSwitch from "../toggle-switch";

interface ApplicationsTabProps {
	config: any;
	cacheSize: number | null;
	deleteCacheStatus: string | null;
	handleUpdate: (newConfig: Partial<any>) => void;
	handleSaveDir: (setting1: string, setting2?: string) => void;
	handleDeleteCache: () => void;
}

export default function ApplicationsTab({
	config,
	cacheSize,
	deleteCacheStatus,
	handleUpdate,
	handleSaveDir,
	handleDeleteCache,
}: ApplicationsTabProps) {
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
				label={t("settings.applications.installationDirectory.label")}
				description={t(
					"settings.applications.installationDirectory.description",
				)}
			>
				<div className="flex gap-2 items-center justify-end w-full">
					<InputWithIcon
						required
						readOnly
						onClick={() => {
							handleSaveDir("defaultInstallFolder", "defaultBinFolder");
						}}
						className="max-w-[calc(100%-12rem)] min-w-[18rem]"
						value={joinPath(config.defaultInstallFolder)}
						onChange={(e) => {
							const value = e.target.value;
							if (value !== null && value.trim() !== "") {
								handleUpdate({
									defaultInstallFolder: value,
									defaultBinFolder: value,
								});
							}
						}}
						icon={<Folder className="w-4 h-4 text-neutral-300" />}
						onIconClick={() =>
							openFolder(joinPath(config.defaultInstallFolder))
						}
						iconPosition="right"
						variant="mono"
					/>
				</div>
			</SettingItem>

			<SettingItem
				label={t("settings.applications.cleanUninstall.label")}
				description={t("settings.applications.cleanUninstall.description")}
			>
				<ToggleSwitch
					enabled={config.alwaysUninstallDependencies}
					onChange={() =>
						handleUpdate({
							alwaysUninstallDependencies: !config.alwaysUninstallDependencies,
						})
					}
				/>
			</SettingItem>

			<SettingItem
				label={t("settings.applications.autoOpenAfterInstall.label")}
				description={t(
					"settings.applications.autoOpenAfterInstall.description",
				)}
			>
				<ToggleSwitch
					enabled={config.autoOpenAfterInstall}
					onChange={() =>
						handleUpdate({
							autoOpenAfterInstall: !config.autoOpenAfterInstall,
						})
					}
				/>
			</SettingItem>

			<SettingItem
				label={t("settings.applications.deleteCache.label")}
				description={t("settings.applications.deleteCache.description")}
			>
				<div className="flex flex-col gap-2 group">
					<Button
						variant="tertiary"
						size="md"
						onClick={handleDeleteCache}
						disabled={deleteCacheStatus === "deleting"}
					>
						<Trash2 className="w-4 h-4" />
						{deleteCacheStatus === null ? (
							<span>{t("settings.applications.deleteCache.button")}</span>
						) : (
							<span
								className={`${
									deleteCacheStatus === "deleted"
										? "text-green-700"
										: deleteCacheStatus === "error"
											? "text-red-500"
											: "text-orange-500"
								}`}
							>
								{deleteCacheStatus === "deleting"
									? t("settings.applications.deleteCache.deleting")
									: deleteCacheStatus === "deleted"
										? t("settings.applications.deleteCache.deleted")
										: t("settings.applications.deleteCache.error")}
							</span>
						)}
						<div className="flex gap-0 items-center justify-center text-xs bg-black/20 rounded-xl font-mono px-2">
							<AnimatedCount
								value={cacheSize || 0}
								suffix="GB"
								className="text-black text-right"
							/>
						</div>
					</Button>
				</div>
			</SettingItem>
		</motion.div>
	);
}
