import { useTranslation } from "@/translations/translation-context";

interface SettingsFooterProps {
	packVersion: string | null;
	port: number | null;
	versions: {
		node: string;
		electron: string;
		chrome: string;
	};
}

export default function SettingsFooter({
	packVersion,
	port,
	versions,
}: SettingsFooterProps) {
	const { t } = useTranslation();

	return (
		<div className="flex justify-between w-full text-[10px] text-neutral-500 mt-5">
			<div className="mt-auto">
				<a
					href="https://getdione.app"
					target="_blank"
					rel="noopener noreferrer"
					className="hover:underline cursor-pointer hover:text-neutral-400 transition-colors"
				>
					getdione.app
				</a>
				<p className="mt-1">built with &hearts;</p>
			</div>
			<div className="text-right">
				<p>v{packVersion || "0.0.0"}</p>
				<p className="mt-1">
					{t("settingsFooter.port")} {port}
				</p>
				<p>Node v{versions.node}</p>
				<p>Electron v{versions.electron}</p>
				<p>Chromium v{versions.chrome}</p>
			</div>
		</div>
	);
}
