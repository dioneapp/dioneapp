import { useTranslation } from "@/translations/translation-context";
import { useScriptsContext } from "../../contexts/scripts-context";

interface SettingsFooterProps {
	packVersion: string | null;
	port: number | null;
	versions: {
		node: string;
		electron: string;
		chrome: string;
	};
	codename: string;
}

export default function SettingsFooter({
	packVersion,
	port,
	versions,
	codename,
}: SettingsFooterProps) {
	const { showToast } = useScriptsContext();
	const { t } = useTranslation();

	return (
		<>
			<div
				className={`h-0.5 rounded-xl w-full from-transparent via-white/40 to-transparent bg-linear-to-l mt-6`}
			/>
			<div className="flex justify-between w-full text-[10px] text-neutral-500  ">
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
					<p>CN: <span className="cursor-pointer hover:underline" onClick={() => { navigator.clipboard.writeText(codename); showToast("success", "Copied to clipboard"); }}>{codename}</span></p>
					<p>
						{t("settingsFooter.version")} {packVersion || "0.0.0"}
					</p>
					<p>
						{t("settingsFooter.port")} {port}
					</p>
					<p>Node v{versions.node}</p>
					<p>Electron v{versions.electron}</p>
					<p>Chromium v{versions.chrome}</p>
				</div>
			</div>
		</>
	);
}
