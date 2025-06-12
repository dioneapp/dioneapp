import { getCurrentPort } from "@renderer/utils/getPort";
import { useEffect, useState } from "react";
import ScriptCard from "./feed/card";
import type { Script } from "./feed/types";
import Loading from "./loading-skeleton";
import { useTranslation } from "../../translations/translationContext";

interface ScriptListProps {
	endpoint: string;
	type?: string;
	className?: string;
}

export default function List({
	endpoint,
	type,
	className = "",
}: ScriptListProps) {
	const { t } = useTranslation();
	const [scripts, setScripts] = useState<Script[]>([]);
	const [loading, setLoading] = useState(true);
	const [_error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchScripts = async () => {
			const port = await getCurrentPort();
			if (!port) return;

			try {
				const response = await fetch(`http://localhost:${port}${endpoint}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const data = await response.json();
				if (Array.isArray(data)) {
					setScripts(data);
				} else {
					setError(t("feed.errors.notArray"));
				}
			} catch (err) {
				console.error(err);
				setError(t("feed.errors.fetchFailed"));
			} finally {
				setLoading(false);
			}
		};

		fetchScripts();
	}, [endpoint, t]);

	if (loading) {
		return <Loading />;
	}

	return (
		<div className={`w-full ${className} last:mb-4`}>
			<div className="grid grid-cols-2 gap-4">
				{scripts.map((script) => (
					<ScriptCard key={script.id} script={script} />
				))}
			</div>

			{scripts.length === 0 && type !== "featured" && (
				<div className="text-center text-neutral-500 text-sm mt-4">
					{t("feed.noScripts")}
				</div>
			)}
		</div>
	);
}
