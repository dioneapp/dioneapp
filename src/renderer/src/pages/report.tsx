import { Button, Textarea } from "@/components/ui";
import { useTranslation } from "@/translations/translation-context";
import { sendDiscordReport } from "@/utils/discord-webhook";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ReportPage() {
	const navigate = useNavigate();
	const [description, setDescription] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<
		"idle" | "success" | "error"
	>("idle");
	const { t } = useTranslation();

	// handle form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setSubmitStatus("idle");

		try {
			const success = await sendDiscordReport("User Report", {
				UserDescription: description,
				UserReport: true,
			});

			setSubmitStatus(success ? "success" : "error");
			if (success) {
				setDescription("");
				// wait 2 seconds before navigating back
				setTimeout(() => navigate(-1), 2000);
			}
		} catch (err) {
			setSubmitStatus("error");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen bg-background p-6 flex items-center justify-center">
			<div className="max-w-3xl w-full">
				<form onSubmit={handleSubmit} className="space-y-2">
					{/* description input */}
					<div className="space-y-2">
						<label className="block text-xl font-semibold">
							{t("report.title")}
						</label>
						<p className="text-sm text-neutral-400">
							{t("report.description")}
						</p>
						<Textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="mt-4 w-full max-h-54 min-h-48 px-4 py-3 bg-white/5 rounded-xl focus:outline-none focus:ring-1 transition-all duration-200 focus:ring-white/10 border border-white/10 text-base"
							placeholder={t("report.placeholder")}
							required
							style={{ resize: "none" }}
						/>
					</div>

					{/* system info */}
					<div className="bg-white/5 p-6 rounded-xl border border-white/10">
						<h3 className="text-lg font-medium">
							{t("report.systemInformationTitle")}
						</h3>
						<p className="text-sm text-neutral-400 mb-4">
							{t("report.disclaimer")}
						</p>
						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<span className="text-neutral-400">OS</span>
								<span className="ml-2">{window.electron.process.platform}</span>
							</div>
							<div>
								<span className="text-neutral-400">
									Node
								</span>
								<span className="ml-2">
									{window.electron.process.versions.node}
								</span>
							</div>
							<div>
								<span className="text-neutral-400">
									Electron
								</span>
								<span className="ml-2">
									{window.electron.process.versions.electron}
								</span>
							</div>
							<div>
								<span className="text-neutral-400">
									Chromium
								</span>
								<span className="ml-2">
									{window.electron.process.versions.chrome}
								</span>
							</div>
						</div>
					</div>

					{/* submit button and status */}
					<div className="flex items-center justify-end">
						{submitStatus === "success" && (
							<p className="text-green-500 flex items-center mr-4">
								<CheckCircle className="w-5 h-5 mr-2" />
								{t("report.success")}
							</p>
						)}
						{submitStatus === "error" && (
							<p className="text-red-500 flex items-center mr-4">
								<XCircle className="w-5 h-5 mr-2" />
								{t("report.error")}
							</p>
						)}
						<div className="flex gap-3 mt-2">
							<Button
								type="submit"
								variant="primary"
								size="md"
								disabled={isSubmitting}
								className="px-6"
							>
								{isSubmitting ? (
									<span className="flex items-center">
										<Loader2 className="w-5 h-5 mr-2 animate-spin" />
										{t("report.sending")}
									</span>
								) : (
									<span>{t("report.send")}</span>
								)}
							</Button>
							<Button
								type="button"
								variant="secondary"
								size="md"
								onClick={() => navigate(-1)}
								className="px-5"
							>
								{t("common.cancel")}
							</Button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
