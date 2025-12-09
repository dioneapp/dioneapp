import { useOnlineStatus } from "@/utils/use-online-status";
import { WifiOff } from "lucide-react";
import { useEffect, useState } from "react";

export default function OfflineIndicator() {
	const isOnline = useOnlineStatus();
	const [show, setShow] = useState(false);

	useEffect(() => {
		if (!isOnline) {
			setShow(true);
			return;
		}
		
		const timer = setTimeout(() => setShow(false), 500);
		return () => clearTimeout(timer);
	}, [isOnline]);

	if (!show) return null;

	return (
		<div className="fixed top-16 right-4 z-9999 animate-in slide-in-from-top-2 duration-300">
			<div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg backdrop-blur-sm shadow-lg">
				<WifiOff className="w-4 h-4 text-red-400" />
				<span className="text-sm text-red-200">You're offline</span>
			</div>
		</div>
	);
}
