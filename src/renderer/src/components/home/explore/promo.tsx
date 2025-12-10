import { useTranslation } from "@/translations/translation-context";
import { openLink } from "@/utils/open-link";

export default function PromoBanner() {
	const { t } = useTranslation();

	return (
		<div
			className="mt-6 w-full rounded-xl border border-white/10 overflow-hidden"
			style={{
				background:
					"linear-gradient(135deg, color-mix(in srgb, var(--theme-gradient-from) 8%, transparent), color-mix(in srgb, var(--theme-background) 50%, transparent), color-mix(in srgb, var(--theme-background) 80%, transparent))",
			}}
		>
			<div className="relative w-full p-5">
				{/* background effects */}
				<div
					className="absolute -top-12 -left-8 w-32 h-32 md:w-48 md:h-48 rounded-full blur-3xl pointer-events-none"
					style={{
						backgroundColor:
							"color-mix(in srgb, var(--theme-accent) 15%, transparent)",
					}}
				/>
				<div
					className="absolute -bottom-8 -right-8 w-24 h-24 md:w-32 md:h-32 rounded-full blur-2xl pointer-events-none"
					style={{
						backgroundColor:
							"color-mix(in srgb, var(--theme-accent) 10%, transparent)",
					}}
				/>
				<div className="relative flex flex-row items-center justify-between gap-4 z-10">
					<div className="flex flex-col space-y-1.5">
						<h3 className="text-base font-semibold text-white tracking-tight">
							{t("promo.title")}
						</h3>
						<p className="text-xs text-neutral-300 leading-relaxed">
							{t("promo.description")}
						</p>
					</div>
					<button
						type="button"
						onClick={() => openLink("https://getdione.app/featured/join")}
						className="px-5 py-2 bg-white hover:bg-white/90 rounded-full transition-all duration-300 text-sm font-semibold whitespace-nowrap cursor-pointer text-black shadow-lg hover:shadow-xl"
					>
						{t("promo.button")}
					</button>
				</div>
			</div>
		</div>
	);
}
