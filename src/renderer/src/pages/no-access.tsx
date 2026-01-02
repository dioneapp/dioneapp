import { useAuthContext } from "@/components/contexts/auth-context";
import { Button } from "@/components/ui";
import { useTranslation } from "@/translations/translation-context";
import { openLink } from "@/utils/open-link";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NoAccess() {
	const { t } = useTranslation();
	const { user, logout } = useAuthContext();
	const navigate = useNavigate();

	useEffect(() => {
		function checkAccess() {
			if (user) {
				if (user.tester === true) {
					navigate("/");
				}
			} else {
				navigate("/first-time");
			}
		}

		checkAccess();
	}, []);

	return (
		<section className="absolute w-screen h-screen inset-0 z-50 bg-[#080808] overflow-hidden">
			<div className="p-4 h-full w-full">
				<div className="flex flex-col justify-center items-center mt-auto h-full">
					<h1 className="text-4xl font-semibold mb-4">{t("noAccess.title")}</h1>
					<p className="text-neutral-400 text-balance text-center max-w-xl">
						{t("noAccess.description")}
					</p>
					<div className="flex gap-2 mt-6">
						<Button
							variant="primary"
							size="sm"
							onClick={() => openLink("https://getdione.app/beta/join")}
						>
							{t("noAccess.join")}
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => logout()}
							className="text-neutral-400"
						>
							{t("noAccess.logout")}
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
