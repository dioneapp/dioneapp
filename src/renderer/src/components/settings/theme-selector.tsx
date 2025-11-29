import { useTranslation } from "@/translations/translation-context";
import {
	type Theme,
	applyTheme,
	getStoredBackgroundIntensity,
	getStoredTheme,
	setBackgroundIntensity,
	themes,
} from "@/utils/theme";
import { useState } from "react";
import SettingItem from "./setting-item";
import ThemePreview from "./theme-preview";
import ToggleSwitch from "./toggle-switch";

export default function ThemeSelector() {
	const { t } = useTranslation();
	const [selectedTheme, setSelectedTheme] = useState<Theme>(getStoredTheme());
	const [isIntense, setIsIntense] = useState<boolean>(
		getStoredBackgroundIntensity() === "intense",
	);

	const handleThemeChange = (theme: Theme) => {
		setSelectedTheme(theme);
		applyTheme(theme, isIntense ? "intense" : "subtle");
	};

	const handleIntensityToggle = (enabled: boolean) => {
		setIsIntense(enabled);
		setBackgroundIntensity(enabled ? "intense" : "subtle");
	};

	return (
		<div className="flex flex-col gap-4 w-full">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
				{(Object.keys(themes) as Theme[]).map((theme) => (
					<ThemePreview
						key={theme}
						theme={theme}
						isActive={selectedTheme === theme}
						isIntense={isIntense}
						onClick={() => handleThemeChange(theme)}
					/>
				))}
			</div>

			<SettingItem
				label={t("settings.interface.intenseBackgrounds.label")}
				description={t("settings.interface.intenseBackgrounds.description")}
				layout="row"
			>
				<ToggleSwitch enabled={isIntense} onChange={handleIntensityToggle} />
			</SettingItem>
		</div>
	);
}
