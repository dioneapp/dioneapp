import ScriptCard from "@/components/features/home/feed/card";
import Icon from "@/components/icons/icon";
import Loading from "@/components/features/install/loading-skeleton";
import { useTranslation } from "@/translations/translation-context";
import { apiJson } from "@/utils/api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useScriptsContext } from "@/components/contexts/scripts-context";

export default function Installed() {
	const { t } = useTranslation();
	const { installedApps, localApps } = useScriptsContext();
	const [apps, setApps] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const CACHE_KEY = "appsCache";
	const CACHE_TIMESTAMP_KEY = "appsCacheTimestamp";
	const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24h

	useEffect(() => {
		const getApps = async () => {
			if (!installedApps || installedApps.length === 0) {
				setLoading(false);
				return;
			}

			const normalizeName = (name: string) =>
				name.toLowerCase().replace(/[\s\-]/g, "");

			const appsToFetch = installedApps.filter((app) => {
				return !localApps.some(
					(localApp) =>
						normalizeName(localApp.name) === normalizeName(app.name),
				);
			});

			if (appsToFetch.length === 0) {
				setApps([]);
				setLoading(false);
				return;
			}

			try {
				const cachedData = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
				const cacheTimestamp = Number.parseInt(
					localStorage.getItem(CACHE_TIMESTAMP_KEY) || "0",
				);
				const isCacheValid = Date.now() - cacheTimestamp < CACHE_EXPIRY;

				const cachedApps: any[] = [];
				const appsNeedingFetch: any[] = [];

				for (const app of appsToFetch) {
					if (cachedData[app.name] && isCacheValid) {
						cachedApps.push(...cachedData[app.name]);
					} else {
						appsNeedingFetch.push(app);
					}
				}

				if (cachedApps.length > 0) {
					setApps(cachedApps);
					setLoading(false);
				} else if (appsNeedingFetch.length === 0) {
					setLoading(false);
				}

				if (appsNeedingFetch.length > 0) {
					const freshAppsData: any[] = [];
					const newCachedData = { ...cachedData };

					await Promise.all(
						appsNeedingFetch.map((app) =>
							apiJson<any[]>(`/db/search/name/${encodeURIComponent(app.name)}`)
								.then((data) => {
									newCachedData[app.name] = data;
									freshAppsData.push(...data);
								})
								.catch((error) => {
									console.error(`Error fetching ${app.name}:`, error);
								}),
						),
					);

					const allApps = [...cachedApps, ...freshAppsData];
					setApps(allApps);
					setLoading(false);
					localStorage.setItem(CACHE_KEY, JSON.stringify(newCachedData));
					localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
				}
			} catch (error) {
				console.error("Error loading apps:", error);
				setLoading(false);
			}
		};

		getApps();
	}, [installedApps, localApps]);

	return (
		<>
			<h1 className="text-2xl sm:text-3xl font-semibold mb-4">
				{t("installed.title")}
			</h1>
			{loading ? (
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
			)}
			{apps.length === 0 && !loading && (
				<div className="text-center flex flex-col gap-8 justify-center items-center my-12">
					<Icon
						name="DioDead"
						className="w-24 h-24 opacity-80 hover:opacity-60 transition-opacity duration-1000"
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
