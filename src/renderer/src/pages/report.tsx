import { sendDiscordReport } from "@renderer/utils/discordWebhook";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ReportPage() {
	const navigate = useNavigate();
	const [description, setDescription] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<
		"idle" | "success" | "error"
	>("idle");

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
				<form onSubmit={handleSubmit} className="space-y-6">
					{/* description input */}
					<div className="space-y-2">
						<label className="block text-xl font-semibold">
							Describe the Issue
						</label>
						<p className="text-sm text-neutral-400">
							Please provide details about what happened and what you were
							trying to do.
						</p>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="w-full h-48 px-4 py-3 bg-white/5 rounded-xl focus:outline-none focus:ring-1 transition-all duration-200 focus:ring-white/10 border border-white/10 text-base"
							placeholder="Example: I was trying to install an application when this error occurred..."
							required
						/>
					</div>

					{/* system info */}
					<div className="bg-white/5 p-6 rounded-xl border border-white/10">
						<h3 className="text-lg font-medium mb-2">System Information</h3>
						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<span className="text-neutral-400">OS:</span>
								<span className="ml-2">{window.electron.process.platform}</span>
							</div>
							<div>
								<span className="text-neutral-400">Node:</span>
								<span className="ml-2">
									{window.electron.process.versions.node}
								</span>
							</div>
							<div>
								<span className="text-neutral-400">Electron:</span>
								<span className="ml-2">
									{window.electron.process.versions.electron}
								</span>
							</div>
							<div>
								<span className="text-neutral-400">Chrome:</span>
								<span className="ml-2">
									{window.electron.process.versions.chrome}
								</span>
							</div>
						</div>
					</div>

					{/* submit button and status */}
					<div className="flex items-center justify-between">
						{submitStatus === "success" && (
							<p className="text-green-500 flex items-center">
								<svg
									className="w-5 h-5 mr-2"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M5 13l4 4L19 7"
									/>
								</svg>
								Report sent successfully!
							</p>
						)}
						{submitStatus === "error" && (
							<p className="text-red-500 flex items-center">
								<svg
									className="w-5 h-5 mr-2"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
								Failed to send report. Please try again.
							</p>
						)}
						<div className="flex gap-3">
							<button
								type="submit"
								disabled={isSubmitting}
								className="px-6 py-2 text-sm font-medium bg-white text-black rounded-full hover:bg-white/80 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
							>
								{isSubmitting ? (
									<span className="flex items-center">
										<svg
											className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
											/>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											/>
										</svg>
										Sending...
									</span>
								) : (
									"Send Report"
								)}
							</button>
							<button
								type="button"
								onClick={() => navigate(-1)}
								className="px-6 py-2 text-sm font-medium bg-white/10 text-white rounded-full hover:bg-white/20 cursor-pointer transition-colors"
							>
								Cancel
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
