import { useTranslation } from "@/translations/translation-context";
import { motion } from "framer-motion";
import SettingItem from "../setting-item";
import ToggleSwitch from "../toggle-switch";

interface PrivacyTabProps {
	config: any;
	handleUpdate: (newConfig: Partial<any>) => void;
}

export default function PrivacyTab({ config, handleUpdate }: PrivacyTabProps) {
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
				label={t("settings.privacy.errorReporting.label")}
				description={t("settings.privacy.errorReporting.description")}
			>
				<ToggleSwitch
					enabled={config.sendAnonymousReports}
					onChange={() =>
						handleUpdate({
							sendAnonymousReports: !config.sendAnonymousReports,
						})
					}
				/>
			</SettingItem>
		</motion.div>
	);
}
