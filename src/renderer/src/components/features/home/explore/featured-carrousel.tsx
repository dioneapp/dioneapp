import { useAuthContext } from "@/components/contexts/auth-context";
import type { Script } from "@/components/features/home/feed/types";
import { apiJson } from "@/utils/api";
import { FeedCache } from "@/utils/cache";
import sendEvent from "@/utils/events";
import { useOnlineStatus } from "@/utils/use-online-status";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FeaturedCarousel() {
	const [scripts, setScripts] = useState<Script[]>([]);
	const [loading, setLoading] = useState(true);
	const [_error, setError] = useState<string | null>(null);
	const [gradients, setGradients] = useState<Record<string, string>>({});
	const [currentIndex, setCurrentIndex] = useState<number>(0);
	const [isUsingCache, setIsUsingCache] = useState(false);
	const { user } = useAuthContext();
	const navigate = useNavigate();
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const isOnline = useOnlineStatus();
	const [config, setConfig] = useState<any>(null);

	const interval = 12000;

	useEffect(() => {
		const fetchConfig = async () => {
			const data = await apiJson("/config");
			setConfig(data);
		};
		fetchConfig();
	}, []);

	useEffect(() => {
		const fetchScripts = async () => {
			if (!isOnline) {
				const cached = FeedCache.get("/db/featured");
				if (cached) {
					const sorted = [
						...cached.filter((s) => s.order === "prior"),
						...cached.filter((s) => s.order !== "prior"),
					];
					setScripts(sorted);
					generateGradients(sorted);
					setIsUsingCache(true);
					setLoading(false);
					return;
				}
			}

			try {
				const data = await apiJson<Script[]>("/db/featured");
				if (Array.isArray(data)) {
					const sorted = [
						...data.filter((s) => s.order === "prior"),
						...data.filter((s) => s.order !== "prior"),
					];
					setScripts(sorted);
					generateGradients(sorted);

					if (isOnline) {
						FeedCache.set("/db/featured", sorted);
					}
					setIsUsingCache(false);
				} else {
					setError("Fetched data is not an array");
				}
			} catch (err) {
				console.error(err);

				const cached = FeedCache.get("/db/featured");
				if (cached) {
					const sorted = [
						...cached.filter((s) => s.order === "prior"),
						...cached.filter((s) => s.order !== "prior"),
					];
					setScripts(sorted);
					generateGradients(sorted);
					setIsUsingCache(true);
				} else {
					setError("Failed to fetch scripts");
				}
			} finally {
				setLoading(false);
			}
		};

		fetchScripts();
	}, [isOnline]);

	const slides = [...scripts.map((s) => ({ ...s, type: "script" as const }))];

	useEffect(() => {
		if (slides.length === 0) return;

		const intervalId = setInterval(() => {
			setCurrentIndex((prev) => (prev + 1) % slides.length);
		}, interval);

		intervalRef.current = intervalId;

		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [slides.length]);

	const handleDotClick = (index: number) => setCurrentIndex(index);

	const generateGradients = async (scripts: Script[]) => {
		const newGradients: Record<string, string> = {};

		const gradients = [
			"linear-gradient(135deg, #1e1e2f 0%, #2c2c3a 50%, var(--theme-accent) 100%)",
			"linear-gradient(135deg, #2c2c3a 0%, #3b3b4f 50%, var(--theme-accent) 100%)",
			"linear-gradient(135deg, #1f2937 0%, #374151 50%, var(--theme-accent) 100%)",
			"linear-gradient(135deg, #111827 0%, #2d3748 50%, var(--theme-accent) 100%)",
			"linear-gradient(135deg, #080808 0%, #1e1e2f 50%, var(--theme-accent) 100%)",
			"linear-gradient(135deg, #2e2d32 0%, #3b3b4f 50%, var(--theme-accent) 100%)",
		];
		await Promise.all(
			scripts.map(async (script) => {
				if (script.banner_url) return;

				let hash = 0;
				for (let i = 0; i < script.id.length; i++) {
					hash = script.id.charCodeAt(i) + ((hash << 5) - hash);
				}
				hash = Math.abs(hash);
				const gradientIndex = hash % gradients.length;

				newGradients[script.id] = gradients[gradientIndex];
			}),
		);

		setGradients(newGradients);
	};

	if (loading) return <CarrouselSkeleton />;

	const activeItem = slides[currentIndex] as any;

	const handlePromoClick = async (id: string) => {
		if (!isOnline) {
			return;
		}

		const result = await sendEvent({
			user: user?.id || "",
			event: "promo_click",
			app_id: id,
			app_name: scripts.find((s) => s.id === id)?.name,
		});
		console.log(result);
		navigate(`/install/${id}`);
	};

	return (
		<section className="flex flex-col gap-0">
			{isUsingCache && (
				<div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-200 text-sm">
					Viewing cached featured content. Install features are disabled while
					offline.
				</div>
			)}
			<div className="relative h-70">
				<AnimatePresence initial={false} mode="wait">
					<div key={activeItem.id} className="absolute w-full h-full">
						<div
							className={`w-full h-72 flex transition-all duration-200 rounded-xl relative overflow-hidden group border border-white/10 hover:border-white/20 shadow-lg hover:shadow-xl ${!isOnline ? "cursor-not-allowed opacity-75" : "cursor-pointer"}`}
						>
							<div
								onClick={(e) => {
									e.preventDefault();
									handlePromoClick(activeItem.id);
								}}
								className="w-full h-full relative"
							>
								<div className="absolute inset-0 w-full h-full bg-black/5 backdrop-blur-lg z-50" />

								{(() => {
									if (!activeItem.banner_url) {
										return (
											<motion.div
												aria-hidden
												className="absolute inset-0 w-full h-full opacity-20 scale-150"
												style={{
													background:
														gradients[activeItem.id] ||
														"linear-gradient(135deg, #1e1e2f 0%, #2c2c3a 50%, var(--theme-accent) 100%)",
													backgroundSize: "200% 200%",
												}}
												initial={{ backgroundPosition: "0% 50%" }}
												animate={{
													backgroundPosition: [
														"0% 50%",
														"100% 30%",
														"60% 100%",
														"20% 80%",
														"80% 10%",
														"0% 50%",
													],
												}}
												transition={{
													duration: 48,
													repeat: Number.POSITIVE_INFINITY,
													ease: "linear",
												}}
											/>
										);
									}

									const disableFeaturedVideos =
										config?.disableFeaturedVideos || false;
									const urlLower = activeItem.banner_url.toLowerCase();
									const isVideo =
										urlLower.endsWith(".gif") ||
										urlLower.endsWith(".mp4") ||
										urlLower.endsWith(".webm") ||
										urlLower.endsWith(".mov") ||
										urlLower.endsWith(".avi");

									if (isVideo && isOnline && !disableFeaturedVideos) {
										return (
											<motion.video
												aria-hidden
												src={activeItem.banner_url}
												className="absolute inset-0 w-full h-full object-cover opacity-50"
												autoPlay
												loop
												muted
												playsInline
												initial={{ scale: 1, filter: "blur(0px)" }}
												animate={{
													scale: [1, 1.05, 1],
													filter: ["blur(0px)", "blur(2px)", "blur(0px)"],
												}}
												transition={{
													duration: 16,
													repeat: Number.POSITIVE_INFINITY,
													ease: "linear",
												}}
											/>
										);
									}

									// fallback img
									return (
										<motion.div
											aria-hidden
											className="absolute inset-0 w-full h-full opacity-20 scale-150"
											style={{
												background:
													gradients[activeItem.id] ||
													"linear-gradient(135deg, #1e1e2f 0%, #2c2c3a 50%, var(--theme-accent) 100%)",
												backgroundSize: "200% 200%",
											}}
											initial={{ backgroundPosition: "0% 50%" }}
											animate={{
												backgroundPosition: [
													"0% 50%",
													"100% 30%",
													"60% 100%",
													"20% 80%",
													"80% 10%",
													"0% 50%",
												],
											}}
											transition={{
												duration: 48,
												repeat: Number.POSITIVE_INFINITY,
												ease: "linear",
											}}
										/>
									);
								})()}

								<motion.div
									initial={{ opacity: 0, filter: "blur(4px)", top: 10 }}
									animate={{ opacity: 1, filter: "blur(0px)", top: 0 }}
									exit={{ opacity: 0, filter: "blur(4px)", top: -10 }}
									transition={{ duration: 0.3 }}
									className="z-50 absolute inset-0 p-10"
								>
									<div className="flex w-full h-full flex-col justify-start items-center">
										<div className="w-full h-full flex justify-end">
											{activeItem.logo_url && isOnline && (
												<img
													src={activeItem.logo_url}
													alt={activeItem.name}
													className="w-24 h-24 rounded-xl object-cover drop-shadow-xl"
												/>
											)}
										</div>
										<div className="flex flex-col justify-end gap-2 w-full h-full -mt-6">
											<h1 className="font-medium text-4xl tracking-tight">
												{activeItem.name}
											</h1>
											<h3 className="text-sm mt-2 text-neutral-300 text-balance truncate">
												{activeItem.description}
											</h3>
										</div>
									</div>
								</motion.div>
							</div>
							<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-50">
								{slides.map((_, index) => (
									<button
										type="button"
										key={index}
										onClick={(e) => {
											e.preventDefault();
											handleDotClick(index);
										}}
										className={`w-2 h-2 rounded-xl transition-all duration-300 ${index === currentIndex
												? "bg-white w-6"
												: "bg-white/50 hover:bg-white/70"
											}`}
									/>
								))}
							</div>
						</div>
					</div>
				</AnimatePresence>
			</div>
		</section>
	);
}

export function CarrouselSkeleton() {
	return (
		<section className="flex flex-col gap-0">
			<div className="relative h-70">
				<div className="absolute w-full h-full">
					<div className="w-full h-72 flex rounded-xl relative overflow-hidden border border-white/10 shadow-lg">
						<div className="absolute inset-0 w-full h-full bg-black/5 backdrop-blur-lg z-50" />
						<div className="absolute inset-0 w-full h-full bg-linear-to-br from-neutral-600/20 to-neutral-900/10" />
						<div className="z-50 absolute inset-0 p-10">
							<div className="flex w-full h-full flex-col justify-start items-center">
								<div className="w-full h-full flex justify-end">
									<div className="w-24 h-24 rounded-xl bg-gray-200/20 animate-pulse" />
								</div>
								<div className="flex flex-col justify-end gap-2 w-full h-full -mt-6">
									<div className="h-10 w-3/4 rounded-xl bg-gray-200/20 animate-pulse" />
									<div className="space-y-2 mt-2">
										<div className="h-4 w-full rounded-xl bg-gray-200/20 animate-pulse" />
										<div className="h-4 w-4/5 rounded-xl bg-gray-200/20 animate-pulse" />
									</div>
								</div>
							</div>
							<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-50">
								{[...Array(5)].map((_, index) => (
									<div
										key={index}
										className={`h-2 rounded-xl bg-gray-200/30 animate-pulse ${index === 0 ? "w-6" : "w-2"
											}`}
									/>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
