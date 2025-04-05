import { useEffect, useState } from "react";
import ScriptCard from "./feed/card";
import Loading from "./loading-skeleton";
import { useAppContext } from "../layout/global-context";
import { getCurrentPort } from "@renderer/utils/getPort";

export default function Installed() {
	const { installedApps } = useAppContext();
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
							fetch(`http://localhost:${port}/db/search/name/${app}`)
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
			{apps.length > 0 &&
				(loading ? (
					<Loading />
				) : (
					<>
						<h1 className="text-2xl sm:text-3xl font-semibold mb-4 mt-2">
							Installed
						</h1>
						<div className="w-full last:mb-4">
							<div className="grid grid-cols-2 gap-4">
								{apps.map((script) => (
									<ScriptCard key={script.id} script={script} />
								))}
							</div>
						</div>
					</>
				))}
		</>
	);
}
