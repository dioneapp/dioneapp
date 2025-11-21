import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../components/contexts/auth-context";
import { useTranslation } from "../translations/translation-context";
import { openLink } from "../utils/open-link";

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
						<button
							className="bg-white hover:opacity-80 transition-opacity duration-300 rounded-full px-10 py-2 text-sm font-semibold text-black cursor-pointer"
							onClick={() => openLink("https://getdione.app/beta/join")}
							type="button"
						>
							{t("noAccess.join")}
						</button>
						<button
							className="border border-white/10 hover:bg-white/10 transition-colors duration-300 rounded-full px-8 py-2 text-sm font-medium text-neutral-400 cursor-pointer"
							onClick={() => logout()}
							type="button"
						>
							{t("noAccess.logout")}
						</button>
					</div>
				</div>
			</div>
		</section>
	);
}
