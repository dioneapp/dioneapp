import { useEffect, useState } from "react";
import { localStorageKey } from "../layout/quick-launch";
import ScriptCard from "./feed/card";
import Loading from "./loading-skeleton";

export default function Installed() {
	const [apps, setApps] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const savedApps = localStorage.getItem(localStorageKey);
		if (savedApps) {
			try {
				const parsedApps = JSON.parse(savedApps);
				// filter out any null or invalid entries
				const validApps = parsedApps.filter((app) => app && app.id);
				setApps(validApps);
			} catch (error) {
				console.error("Error parsing saved apps:", error);
				setApps([]);
			}
			setLoading(false);
		}
	}, []);

	return (
		<>
			{apps.length > 0 && (
				<>
					{loading ? (
						<Loading />
					) : (
						<>
							<h1 className="text-2xl sm:text-3xl font-semibold mb-4">
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
					)}
				</>
			)}
		</>
	);
}
