import sound from "@/components/first-time/sounds/intro.mp3";
import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const ExecuteSound = ({ firstLaunch }: { firstLaunch: string }) => {
	const [isMuted, setIsMuted] = useState(() => {
		const savedMute = localStorage.getItem("isSoundMuted");
		return savedMute ? JSON.parse(savedMute) : false;
	});

	const audioRef = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		if (!audioRef.current) {
			audioRef.current = new Audio(sound);
			audioRef.current.loop = true;
			audioRef.current.currentTime = 7;
		}

		const audio = audioRef.current;

		if (firstLaunch === "true") {
			audio!.muted = isMuted;
			audio!.volume = isMuted ? 0 : 0.2;
			audio!.play().catch((e) => console.warn("Audio play failed:", e));
		}

		return () => {
			if (!audio) return;

			// fade out on unmount
			let volume = audio.volume;
			const fadeInterval = setInterval(() => {
				volume = Math.max(0, volume - 0.05);
				audio.volume = volume;

				if (volume === 0) {
					clearInterval(fadeInterval);
					audio.pause();
					audio.currentTime = 0;
				}
			}, 350);
		};
	}, [firstLaunch]);

	const toggleMute = () => {
		const newMutedState = !isMuted;
		setIsMuted(newMutedState);
		localStorage.setItem("isSoundMuted", JSON.stringify(newMutedState));

		if (audioRef.current) {
			audioRef.current.muted = newMutedState;
			audioRef.current.volume = newMutedState ? 0 : 0.2;
		}
	};

	return (
		<>
			{firstLaunch === "true" && (
				<button
					onClick={toggleMute}
					className="absolute bottom-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors duration-200"
					style={{ zIndex: 9999 }}
					aria-label={isMuted ? "Unmute sound" : "Mute sound"}
				>
					{isMuted ? (
						<VolumeX className="w-4 h-4 text-white/80" />
					) : (
						<Volume2 className="w-4 h-4 text-white/80" />
					)}
				</button>
			)}
		</>
	);
};

export default ExecuteSound;
