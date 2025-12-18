import { useTranslation } from "@/translations/translation-context";
import { CpuIcon, MonitorIcon } from "@phosphor-icons/react";

export default function NotSupported({
	reasons,
	data,
	onClose,
}: { reasons: string[]; data: any; onClose: (force?: boolean) => void }) {
	const { t } = useTranslation();

	const appName = data.name || "this app";
	const reason = reasons.includes("gpu") ? "GPU" : "OS";
	const rawText = t("feed.errors.notSupported");
	const parts = rawText.split("%s");

	return (
		<div
			className="absolute h-screen w-full bg-black/40 backdrop-blur-xl"
			style={{ zIndex: 999 }}
		>
			<div className="w-full h-full flex justify-center items-center">
				<div className="max-w-2xl max-h-96 rounded-xl w-full h-full bg-black/80 border border-white/10 backdrop-blur-sm overflow-hidden relative flex flex-col">
					<div className="flex items-start p-6">
						<div className="absolute">
							{reasons[0].includes("gpu") ? (
								<CpuIcon
									weight="bold"
									className="w-64 h-64 -ml-12 mt-36 opacity-80"
								/>
							) : (
								<MonitorIcon
									weight="bold"
									className="w-64 h-64 -ml-24 mt-38 opacity-80"
								/>
							)}
						</div>
						<div className="flex flex-col justify-end ml-auto max-w-xl gap-2 text-right">
							<h1 className="text-3xl font-semibold">
								{t("feed.errors.notSupportedTitle")}
							</h1>
							<h2 className="text-sm text-neutral-400 ">
								{parts[0]}{" "}
								<span className="text-neutral-200 hover:underline">
									{appName}
								</span>{" "}
								{parts[1]}{" "}
								<span className="text-neutral-200 hover:underline">
									{reason}
								</span>
								.{" "}
							</h2>
						</div>
					</div>
					<div className="flex gap-2 w-full ml-auto mt-auto justify-end items-end px-6 py-4">
						<button
							onClick={() => onClose(true)}
							className="bg-neutral-200/10 hover:bg-neutral-300/20 transition-all duration-300 cursor-pointer text-neutral-300 font-medium text-sm  py-1 w-44 rounded-full"
						>
							Continue anyway
						</button>
						<button
							onClick={() => onClose(false)}
							className="bg-neutral-200 hover:bg-neutral-300 transition-all duration-300 cursor-pointer text-black text-sm font-semibold py-1 w-24 rounded-full"
						>
							{t("toast.close")}
						</button>
						{/* <p
							onClick={() =>
								openLink(
									data.author_url ||
										"https://github.com/dioneapp/official-scripts",
								)
							}
							className="text-xs text-neutral-400 mt-2 hover:text-neutral-200 transition-all duration-300 cursor-pointer"
						>
							{t("report.contribute")}
						</p> */}
					</div>
				</div>
			</div>
		</div>
	);
}
