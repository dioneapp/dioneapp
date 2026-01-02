import { Button, IconButton } from "@/components/ui";
import { useTranslation } from "@/translations/translation-context";
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
		<div className="absolute top-0 left-0 right-0 z-50 p-6 flex items-center justify-between">
			{/* Back button */}
			<div id="no-draggable">
				<Button variant="outline" size="sm" onClick={() => navigate(-1)}>
					<ArrowLeft className="h-4 w-4" />
					<span className="font-semibold">{t("common.back")}</span>
				</Button>
			</div>

			{/* Action buttons */}
			{user && !isLocal && (
				<div id="no-draggable" className="flex items-center gap-2">
					<IconButton
						icon={<Share2 className="h-4 w-4" />}
						variant="secondary"
						onClick={handleShare}
						tooltip={t("common.share")}
					/>
					<IconButton
						icon={
							<Bookmark
								className="h-4 w-4"
								style={saved ? { fill: "var(--theme-accent)" } : {}}
							/>
						}
						variant={saved ? undefined : "secondary"}
						onClick={handleSave}
						accentColor={saved}
						tooltip={saved ? t("common.saved") : t("common.save")}
					/>
				</div>
			)}
		</div>
	);
}
