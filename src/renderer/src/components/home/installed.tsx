import { getCurrentPort } from "@renderer/utils/getPort";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "../../translations/translationContext";
import Icon from "../icons/icon";
import ScriptCard from "./feed/card";
import Loading from "./loading-skeleton";
import { useScriptsContext } from "../contexts/ScriptsContext";

export default function Installed() {
	const { t } = useTranslation();
	const { installedApps } = useScriptsContext();
	const [apps, setApps] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const CACHE_KEY = "appsCache";

	useEffect(() => {
		const getApps = async () => {
			if (!installedApps || installedApps.length === 0) return;

			console.log("installedApps", installedApps);
			try {
				const port = await getCurrentPort();
				const cachedData = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");

				const appsToFetch = installedApps
					.slice(0, 6)
					.filter((app) => !cachedData[app]);

				if (appsToFetch.length > 0) {
					await Promise.all(
						appsToFetch.map((app) =>
							fetch(
								`http://localhost:${port}/db/search/name/${encodeURIComponent(app)}`,
							)
								.then((res) => (res.ok ? res.json() : []))
								.then((data) => {
									cachedData[app] = data;
									return data;
								}),
						),
					);

					localStorage.setItem(CACHE_KEY, JSON.stringify(cachedData));
				}
				const finalResults = installedApps
					.slice(0, 6)
					.flatMap((app) => cachedData[app] || []);

				setApps(finalResults.slice(0, 6));
			} catch (error) {
				console.error("Error loading apps:", error);
			}
			setLoading(false);
		};

		getApps();
	}, [installedApps]);

	return (
		<>
			<h1 className="text-2xl sm:text-3xl font-semibold mb-4">
				{t("installed.title")}
			</h1>
			{apps.length > 0 ? (
				loading ? (
					<Loading />
				) : (
					<>
						<div className="w-full last:mb-4">
							<div className="grid grid-cols-2 gap-4">
								{apps.map((script) => (
									<ScriptCard key={script.id} script={script} />
								))}
							</div>
						</div>
					</>
				)
			) : (
				<div className="text-center flex flex-col gap-8 justify-center items-center mt-12">
					<Icon
						name="DioDead"
						className="w-24 h-24 opacity-80 hover:opacity-50 transition-opacity duration-1000"
					/>
					<div className="text-center items-center justify-center flex flex-col text-balance">
						<h3 className="text-neutral-400 text-sm">
							{t("installed.empty.title")}
						</h3>
						<Link
							to="/home"
							className="text-sm text-neutral-200 mt-2 hover:underline underline-offset-4"
						>
							{t("installed.empty.action")}
						</Link>
					</div>
				</div>
			)}
		</>
	);
}
