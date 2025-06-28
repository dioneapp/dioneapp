import { useEffect } from "react";
import sound from "./intro.mp3";

const ExecuteSound = ({ firstLaunch }: { firstLaunch: string }) => {
	useEffect(() => {
		const audio = new Audio(sound);
		if (firstLaunch === "true") {
			audio.play().catch((e) => {
				console.warn("Cant play sound:", e);
			});
		}
	}, [firstLaunch]);

	return null;
};

export default ExecuteSound;
