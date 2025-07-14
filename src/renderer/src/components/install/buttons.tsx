import { useTranslation } from "@renderer/translations/translationContext";
import { ArrowLeft, Bookmark, Share2 } from "lucide-react";
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
		<>
			<div className="p-12 z-50 absolute">
				<button
					type="button"
					onClick={() => navigate(-1)}
					className="flex items-center justify-center gap-2 text-xs w-full border border-white/10 hover:bg-white/10 transition-colors duration-400 rounded-full text-neutral-400 py-2 px-4 text-center cursor-pointer"
				>
					<ArrowLeft className="h-4 w-4" />
					<span className="font-semibold">{t("common.back")}</span>
				</button>
			</div>
			<div className="p-12 z-50 absolute right-0">
				{user && !isLocal && (
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => handleShare()}
							className="flex items-center justify-center gap-2 text-xs w-full border border-white/10 hover:bg-white/10 transition-colors duration-400 rounded-full text-neutral-400 p-2 text-center cursor-pointer"
						>
							<Share2 className="h-4 w-4" />
						</button>
						<button
							type="button"
							onClick={() => handleSave()}
							className={`flex items-center justify-center gap-2 text-xs w-full border border-white/10 hover:bg-white/10 transition-colors duration-400 rounded-full text-neutral-400 p-2 text-center cursor-pointer ${saved ? "bg-white/10" : ""}`}
						>
							<Bookmark className="h-4 w-4" />
						</button>
					</div>
				)}
			</div>
		</>
	);
}
