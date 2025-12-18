import { useTranslation } from "@/translations/translation-context";
import type { Icon } from "@phosphor-icons/react";
import {
	BellIcon,
	PackageIcon,
	PaletteIcon,
	ShieldIcon,
	SlidersHorizontalIcon,
} from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useMemo } from "react";

export type TabType =
	| "applications"
	| "interface"
	| "notifications"
	| "privacy"
	| "other";

interface Tab {
	id: TabType;
	label: string;
	icon: Icon;
}

interface SettingsTabsProps {
	activeTab: TabType;
	onTabChange: (tab: TabType) => void;
}

export default function SettingsTabs({
	activeTab,
	onTabChange,
}: SettingsTabsProps) {
	const { t } = useTranslation();

	const tabs: Tab[] = useMemo(
		() => [
			{
				id: "applications",
				label: t("settings.applications.title"),
				icon: PackageIcon,
			},
			{
				id: "interface",
				label: t("settings.interface.title"),
				icon: PaletteIcon,
			},
			{
				id: "notifications",
				label: t("settings.notifications.title"),
				icon: BellIcon,
			},
			{ id: "privacy", label: t("settings.privacy.title"), icon: ShieldIcon },
			{
				id: "other",
				label: t("settings.other.title"),
				icon: SlidersHorizontalIcon,
			},
		],
		[t],
	);

	return (
		<div className="border border-white/10 bg-white/5 backdrop-blur-sm rounded-xl p-1.5 flex gap-2 overflow-x-auto">
			{tabs.map((tab) => {
				const Icon = tab.icon;
				return (
					<button
						key={tab.id}
						onClick={() => onTabChange(tab.id)}
						className={`relative cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
							activeTab === tab.id
								? "text-white"
								: "text-neutral-400 hover:text-neutral-200 hover:bg-white/5"
						}`}
						type="button"
					>
						{activeTab === tab.id && (
							<motion.div
								layoutId="activeTab"
								className="absolute inset-0 border rounded-lg"
								style={{
									background: `linear-gradient(to right, color-mix(in srgb, var(--theme-gradient-from) 20%, transparent), color-mix(in srgb, var(--theme-gradient-to) 20%, transparent))`,
									borderColor: `color-mix(in srgb, var(--theme-accent) 30%, transparent)`,
								}}
								transition={{
									type: "spring",
									stiffness: 500,
									damping: 38,
								}}
							/>
						)}
						<Icon className="w-4 h-4 relative z-10" />
						<span className="relative z-10">{tab.label}</span>
					</button>
				);
			})}
		</div>
	);
}
