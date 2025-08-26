import { useTranslation } from "../../translations/translationContext";

export default function Loading() {
	const { t } = useTranslation();

	return (
		<div className="h-42 rounded-xl border border-white/10 shadow-lg relative overflow-visible w-full backdrop-blur-md animate-pulse">
			<p className="text-neutral-700 text-xs h-full mt-auto flex items-center justify-center text-center">
				{t("common.loading")}
			</p>
		</div>
	);
}
