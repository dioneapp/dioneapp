import { useTranslation } from "@/translations/translation-context";
import { motion } from "framer-motion";
import {
	Bell,
	type LucideIcon,
	Package,
	Palette,
	Settings2,
	Shield,
} from "lucide-react";
import { Button } from "@/components/ui";

export type TabType =
	| "applications"
	| "interface"
	| "notifications"
	| "privacy"
	| "other";

interface Tab {
	id: TabType;
	label: string;
	icon: LucideIcon;
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

	const tabs: Tab[] = [
		{
			id: "applications",
			label: t("settings.applications.title"),
			icon: Package,
		},
		{ id: "interface", label: t("settings.interface.title"), icon: Palette },
		{
			id: "notifications",
			label: t("settings.notifications.title"),
			icon: Bell,
		},
		{ id: "privacy", label: t("settings.privacy.title"), icon: Shield },
		{ id: "other", label: t("settings.other.title"), icon: Settings2 },
	];

	return (
		<div className="border border-white/10 bg-white/5 backdrop-blur-sm rounded-xl p-1.5 flex gap-2 overflow-x-auto">
			{tabs.map((tab) => {
				const Icon = tab.icon;
				return (
					<Button
						key={tab.id}
						onClick={() => onTabChange(tab.id)}
						variant="ghost"
						size="sm"
						className={`relative flex items-center gap-2 whitespace-nowrap ${
							activeTab === tab.id
								? "text-white"
								: "text-neutral-400 hover:text-neutral-200"
						}`}
					>
						{activeTab === tab.id && (
							<motion.div
								layoutId="activeTab"
								className="absolute inset-0 border rounded-xl"
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
					</Button>
				);
			})}
		</div>
	);
}
