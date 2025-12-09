import { useEffect, useState } from "react";

export function useOnlineStatus(): boolean {
	const [isOnline, setIsOnline] = useState(() => {
		if (typeof navigator !== "undefined" && typeof navigator.onLine === "boolean") {
			return navigator.onLine;
		}
		return true;
	});

	useEffect(() => {
		if (typeof navigator !== "undefined" && typeof navigator.onLine === "boolean") {
			setIsOnline(navigator.onLine);
		}

		const handleOnline = () => setIsOnline(true);
		const handleOffline = () => setIsOnline(false);

		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	}, []);

	return isOnline;
}
