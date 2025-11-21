import Icon from "@renderer/components/icons/icon";
import { CheckCircle, Loader2, TvMinimal, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../translations/translation-context";
import { sendDiscordReport } from "../utils/discord-webhook";
import { openLink } from "../utils/open-link";

export default function ErrorPage({ error }: { error?: Error }) {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [reportStatus, setReportStatus] = useState<
		"idle" | "pending" | "success" | "error" | "dev-mode"
	>("idle");
	const settings = JSON.parse(localStorage.getItem("config") || "{}");

	useEffect(() => {
		if (error && settings.sendAnonymousReports) {
			handleReportError();
		}
	}, [error]);

	async function handleReportError() {
		setReportStatus("pending");
		const errorToSend = `${error?.message?.charAt(0).toUpperCase()}${error?.message?.slice(1)} \n\n [${error?.stack?.substring(0, 200)}]`;
		const success = await sendDiscordReport(errorToSend, {
			userReport: false,
		});

		if (success === "dev-mode") {
			setReportStatus("dev-mode");
			return;
		}

		if (success) {
			setReportStatus("success");
		} else {
			setReportStatus("error");
		}
	}

	return (
		<div className="min-h-screen overflow-hidden">
			<div className="max-w-[2000px] h-screen overflow-hidden mx-auto px-4 sm:px-6 lg:px-8">
				<main className="flex flex-col h-full justify-center items-center pb-24">
					<Icon name="DioDead" className="h-44 w-44 mb-12" />
					<h1 className="text-2xl sm:text-3xl font-semibold mb-4">
						{t("error.title")}
					</h1>
					<p className="text-neutral-400 text-xs max-w-sm text-center text-pretty">
						{t("error.description")}
					</p>
					<div
						className={`gap-2 flex justify-center items-center mt-6 ${settings.sendAnonymousReports ? "flex-col" : "flex"}`}
					>
						{(!settings.sendAnonymousReports ||
							reportStatus === "success" ||
							reportStatus === "error") && (
							<button
								onClick={() => navigate(-1)}
								type="button"
								className=" py-1 px-4 bg-white hover:bg-white/80 transition-colors duration-400 rounded-full text-black font-semibold text-center cursor-pointer"
							>
								{t("error.return")}
							</button>
						)}
						{(settings.sendAnonymousReports || reportStatus !== "idle") && (
							<div className="absolute bottom-6 shadow-xl z-50">
								<button
									onClick={() =>
										openLink("https://github.com/dioneapp/dioneapp/issues")
									}
									type="button"
									className="px-4 border border-white/10 enabled:hover:bg-white/10 transition-colors duration-400 rounded-full text-neutral-300 py-1 text-center enabled:cursor-pointer flex gap-2"
									disabled
								>
									<span className="text-center py-1">
										{reportStatus === "pending" && (
											<Loader2 className="w-5 h-5 animate-spin text-orange-500" />
										)}
										{reportStatus === "success" && (
											<CheckCircle className="w-5 h-5 text-green-500" />
										)}
										{reportStatus === "error" && (
											<XCircle className="w-5 h-5 text-red-500" />
										)}
										{reportStatus === "dev-mode" && (
											<TvMinimal className="w-5 h-5 text-neutral-300" />
										)}
									</span>
									<span
										className={`flex text-sm items-center gap-2 ${reportStatus === "pending" ? "text-orange-500" : ""} ${reportStatus === "success" ? "text-green-500" : ""} ${reportStatus === "error" ? "text-red-500" : ""} ${reportStatus === "dev-mode" ? "text-neutral-300" : ""}`}
									>
										<p className="opacity-80">
											{reportStatus === "pending"
												? t("error.report.sending")
												: reportStatus === "success"
													? t("error.report.success")
													: reportStatus === "error"
														? t("error.report.failed")
														: "Error reporting disabled in dev mode"}
										</p>
									</span>
								</button>
							</div>
						)}
						{!settings.sendAnonymousReports && reportStatus === "idle" && (
							<button
								onClick={() => handleReportError()}
								type="button"
								className="px-4 bg-white/10 hover:bg-white/20 transition-colors duration-400 rounded-full text-center cursor-pointer py-1"
							>
								{t("error.report.toTeam")}
							</button>
						)}
					</div>
				</main>
			</div>
		</div>
	);
}
