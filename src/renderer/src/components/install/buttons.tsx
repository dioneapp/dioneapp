import { useTranslation } from "@/translations/translation-context";
import {
	ArrowLeftIcon,
	BookmarkSimpleIcon,
	ShareNetworkIcon,
} from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

export default function Buttons({
	user,
	isLocal,
	handleShare,
	handleSave,
	saved,
}: {
	user: boolean;
	isLocal: boolean | undefined;
	handleShare: () => void;
	handleSave: () => void;
	saved: boolean;
}) {
	const { t } = useTranslation();
	const navigate = useNavigate();

	return (
		<div className="absolute top-0 left-0 right-0 z-50 p-6 flex items-center justify-between">
			{/* Back button */}
			<div id="no-draggable">
				<button
					type="button"
					onClick={() => navigate(-1)}
					className="flex items-center gap-2 px-4 py-1.5 border border-white/10 hover:bg-white/10 transition-colors duration-300 rounded-full text-neutral-300 cursor-pointer"
				>
					<ArrowLeftIcon className="h-4 w-4" />
					<span className="text-xs font-semibold">{t("common.back")}</span>
				</button>
			</div>

			{/* Action buttons */}
			{user && !isLocal && (
				<div id="no-draggable" className="flex items-center gap-2">
					<button
						type="button"
						onClick={() => handleShare()}
						className="p-2 border border-white/10 hover:bg-white/10 transition-colors duration-300 rounded-full text-neutral-300 cursor-pointer"
					>
						<ShareNetworkIcon className="h-4 w-4" />
					</button>
					<button
						type="button"
						onClick={() => handleSave()}
						className={`p-2 border transition-colors duration-300 rounded-full cursor-pointer ${
							!saved && "border-white/10 hover:bg-white/10 text-neutral-300"
						}`}
						style={
							saved
								? {
										borderColor:
											"color-mix(in srgb, var(--theme-accent) 50%, transparent)",
										backgroundColor:
											"color-mix(in srgb, var(--theme-accent) 20%, transparent)",
										color: "var(--theme-accent)",
									}
								: {}
						}
					>
						<BookmarkSimpleIcon
							className="h-4 w-4"
							weight={saved ? "fill" : "regular"}
							style={saved ? { color: "var(--theme-accent)" } : {}}
						/>
					</button>
				</div>
			)}
		</div>
	);
}
