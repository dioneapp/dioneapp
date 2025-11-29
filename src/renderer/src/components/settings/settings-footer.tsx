import { useTranslation } from "@/translations/translation-context";
import { openLink } from "@/utils/open-link";

interface SettingsFooterProps {
	packVersion: string | null;
	port: number | null;
	versions: {
		node: string;
		electron: string;
		chrome: string;
	};
}

export default function SettingsFooter({ packVersion, port, versions }: SettingsFooterProps) {
	const { t } = useTranslation();

	return (
		<div className="w-full flex items-end justify-between text-xs text-neutral-500 mt-4">
			<div>
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
				<button
					type="button"
					className="hover:underline cursor-pointer hover:text-neutral-400 transition-colors"
					onClick={() => openLink("https://github.com/dioneapp/dioneapp/releases")}
				>
					v{packVersion || "0.0.0"}
				</button>
				<p className="mt-1">
					{t("settingsFooter.port")}{" "}
					<button
						type="button"
						onClick={() => openLink(`http://localhost:${port}`)}
						className="hover:underline cursor-pointer hover:text-neutral-400 transition-colors"
					>
						{port}
					</button>
				</p>
				<p>Node v{versions.node}</p>
				<p>Electron v{versions.electron}</p>
				<p>Chromium v{versions.chrome}</p>
			</div>
		</div>
	);
}
