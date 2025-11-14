import { useTranslation } from "@renderer/translations/translationContext";
import { motion } from "framer-motion";

export default function SureNotLogin({
	onSkip,
	onLogin,
}: { onSkip: () => void; onLogin: () => void }) {
	const { t } = useTranslation();
	
	return (
		<section className="min-h-screen min-w-screen flex flex-col items-center justify-center px-4">
			<div className="flex justify-start items-center gap-4 w-screen h-full pl-12">
				<motion.div
					initial={{ opacity: 0, y: 30, filter: "blur(20px)" }}
					animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
					exit={{
						opacity: 0,
						y: -30,
						filter: "blur(20px)",
					}}
					key={2.5}
					transition={{ duration: 0.5 }}
					className="flex flex-col items-start gap-4 max-w-2xl"
				>
					<h1 className="font-semibold text-5xl">{t("loginFeatures.title")}</h1>
					<p className="text-neutral-400 text-wrap text-sm">
						{t("loginFeatures.description")}
					</p>
					<div className="flex gap-2 w-full mt-6 max-w-sm">
						<button
							onClick={onLogin}
							type="button"
							className="bg-white w-full hover:opacity-80 transition-opacity duration-300 rounded-full px-12 py-1.5 text-sm font-semibold text-black cursor-pointer"
						>
							{t("loginFeatures.login")}
						</button>
						<button
							onClick={onSkip}
							type="button"
							className="border w-full border-white/10 hover:bg-white/10 transition-colors duration-300 rounded-full px-6 py-1.5 text-sm font-medium text-neutral-400 cursor-pointer"
						>
							{t("loginFeatures.skip")}
						</button>
					</div>
				</motion.div>
				<div className="w-full flex justify-end items-center -mr-44 z-50">
					<div className="grid grid-cols-2 grid-rows-2 gap-2 w-full">
						<div className="flex flex-col gap-2 bg-black/70 hover:border-white/20 transition-colors duration-300 border border-white/10 rounded-lg w-full h-62 xl:h-72 relative overflow-hidden">
							<div className="absolute right-24 -top-24 w-34 h-44 bg-pink-800/20 rounded-full blur-3xl" />
							<div className="p-4 flex flex-col gap-2 h-full">
								<h2 className="font-semibold text-3xl">{t("loginFeatures.features.customReports.title")}</h2>
								<p className="text-neutral-400 text-wrap text-sm mt-auto">
									{t("loginFeatures.features.customReports.description")}
								</p>
							</div>
						</div>
						<div className="flex flex-col gap-2 bg-black/70 hover:border-white/20 transition-colors duration-300 border border-white/10 rounded-lg w-full h-62 xl:h-72 relative overflow-hidden">
							<div className="absolute right-24  w-34 h-44 bg-zinc-600/20 rounded-full blur-3xl" />
							<div className="p-4 flex flex-col gap-2 h-full">
								<h2 className="font-semibold text-3xl">{t("loginFeatures.features.createProfile.title")}</h2>
								<p className="text-neutral-400 text-wrap text-sm mt-auto">
									{t("loginFeatures.features.createProfile.description")}
								</p>
							</div>
						</div>
						<div className="flex flex-col gap-2 bg-black/70 hover:border-white/20 transition-colors duration-300 border border-white/10 rounded-lg w-full h-62 xl:h-72 relative overflow-hidden">
							<div className="absolute left-12 w-34 h-44 bg-[#BCB1E7]/20 rounded-full blur-3xl" />
							<div className="p-4 flex flex-col gap-2 h-full">
								<h2 className="font-semibold text-3xl">{t("loginFeatures.features.syncData.title")}</h2>
								<p className="text-neutral-400 text-wrap text-sm mt-auto">
									{t("loginFeatures.features.syncData.description")}
								</p>
							</div>
						</div>
						<div className="flex flex-col gap-2 bg-black/70 hover:border-white/20 transition-colors duration-300 border border-white/10 rounded-lg w-full h-62 xl:h-72 relative overflow-hidden">
							<div className="absolute right-0 top-24 w-44 h-44 bg-yellow-300/20 rounded-full blur-3xl" />
							<div className="p-4 flex flex-col gap-2 h-full">
								<h2 className="font-semibold text-3xl">
									{t("loginFeatures.features.earlyBirds.title")}
								</h2>
								<p className="text-neutral-400 text-wrap text-sm mt-auto">
									{t("loginFeatures.features.earlyBirds.description")}
								</p>
							</div>
						</div>
						<div className="flex flex-col gap-2 bg-black/70 hover:border-white/20 transition-colors duration-300 border border-white/10 rounded-lg w-full h-62 xl:h-72 relative overflow-hidden">
							<div className="absolute right-0 top-0 w-24 h-44 bg-red-300/20 rounded-full blur-3xl" />
							<div className="p-4 flex flex-col gap-2 h-full">
								<h2 className="font-semibold text-3xl">{t("loginFeatures.features.giveOutLikes.title")}</h2>
								<p className="text-neutral-400 text-wrap text-sm mt-auto">
									{t("loginFeatures.features.giveOutLikes.description")}
								</p>
							</div>
						</div>
						<div className="flex flex-col gap-2 bg-black/70 hover:border-white/20 transition-colors duration-300 border border-white/10 rounded-lg w-full h-62 xl:h-72 relative overflow-hidden">
							<div className="absolute left-0 -bottom-20 w-24 h-44 bg-white/20 rounded-full blur-3xl" />
							<div className="p-4 flex flex-col gap-2 h-full">
								<h2 className="font-semibold text-3xl">{t("loginFeatures.features.publishScripts.title")}</h2>
								<p className="text-neutral-400 text-wrap text-sm mt-auto">
									{t("loginFeatures.features.publishScripts.description")}
								</p>
							</div>
						</div>
						<div className="flex flex-col gap-2 bg-black/70 hover:border-white/20 transition-colors duration-300 border border-white/10 rounded-lg w-full h-62 xl:h-72 relative overflow-hidden">
							<div className="absolute left-0 -bottom-20 w-24 h-44 bg-blue-300/20 rounded-full blur-3xl" />
							<div className="p-4 flex flex-col gap-2 h-full">
								<h2 className="font-semibold text-3xl">{t("loginFeatures.features.achieveGoals.title")}</h2>
								<p className="text-neutral-400 text-wrap text-sm mt-auto">
									{t("loginFeatures.features.achieveGoals.description")}
								</p>
							</div>
						</div>
						<div className="flex flex-col gap-2 bg-black/70 hover:border-white/20 transition-colors duration-300 border border-white/10 rounded-lg w-full h-62 xl:h-72 relative overflow-hidden">
							<div className="absolute right-0 -top-20 w-44 h-44 bg-green-300/20 rounded-full blur-3xl" />
							<div className="p-4 flex flex-col gap-2 h-full">
								<h2 className="font-semibold text-3xl">{t("loginFeatures.features.getNewswire.title")}</h2>
								<p className="text-neutral-400 text-wrap text-sm mt-auto">
									{t("loginFeatures.features.getNewswire.description")}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
