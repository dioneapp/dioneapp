import { useAuthContext } from "@renderer/components/contexts/AuthContext";
import sendEvent from "@renderer/utils/events";
import { getCurrentPort } from "@renderer/utils/getPort";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Script } from "../feed/types";

export default function FeaturedCarousel() {
	const [scripts, setScripts] = useState<Script[]>([]);
	const [loading, setLoading] = useState(true);
	const [_error, setError] = useState<string | null>(null);
	const [gradients, setGradients] = useState<Record<string, string>>({});
	const [activeIndex, setActiveIndex] = useState<string | null>(null);
	const [currentIndex, setCurrentIndex] = useState<number>(0);
	const { user } = useAuthContext();
	const navigate = useNavigate();

	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		const fetchScripts = async () => {
			const port = await getCurrentPort();
			if (!port) return;

			try {
				const response = await fetch(`http://localhost:${port}/db/featured`, {
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
					// prior scripts should be at the top
					const sorted = [
						...data.filter((s) => s.order === "prior"),
						...data.filter((s) => s.order !== "prior"),
					];
					setScripts(sorted);
					generateGradients(sorted);
				} else {
					setError("Fetched data is not an array");
				}
			} catch (err) {
				console.error(err);
				setError("Failed to fetch scripts");
			} finally {
				setLoading(false);
			}
		};

		fetchScripts();
	}, []);

	useEffect(() => {
		if (scripts.length > 0) {
			setActiveIndex(scripts[currentIndex].id);
		}
	}, [scripts, currentIndex]);

	// advance logic
	useEffect(() => {
		const intervalId = setInterval(() => {
			setCurrentIndex((prevIndex) => (prevIndex + 1) % scripts.length);
		}, 10000); // change slide every 10s

		intervalRef.current = intervalId;

		// cleanup
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [scripts]);

	const handleDotClick = (index: number) => {
		setCurrentIndex(index);
	};

	const generateGradients = async (scripts: Script[]) => {
		const newGradients: Record<string, string> = {};

		// app's consistent color palette
		const gradients = [
			"linear-gradient(135deg, #1e1e2f 0%, #2c2c3a 50%, #BCB1E7 100%)",
			"linear-gradient(135deg, #2c2c3a 0%, #3b3b4f 50%, #BCB1E7 100%)",
			"linear-gradient(135deg, #1f2937 0%, #374151 50%, #BCB1E7 100%)",
			"linear-gradient(135deg, #111827 0%, #2d3748 50%, #BCB1E7 100%)",
			"linear-gradient(135deg, #080808 0%, #1e1e2f 50%, #BCB1E7 100%)",
			"linear-gradient(135deg, #2e2d32 0%, #3b3b4f 50%, #BCB1E7 100%)",
		];

		await Promise.all(
			scripts.map(async (script) => {
				if (script.banner_url) {
					return;
				}

				// use consistent gradient based on script id hash
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

	if (loading) {
		return <CarrouselSkeleton />;
	}

	const handlePromoClick = async (id: string) => {
		const result = await sendEvent({
			user: user?.id || "",
			event: "promo_click",
			app_id: id,
			app_name: scripts.find((script) => script.id === id)?.name,
		});
		console.log(result);
		navigate(`/install/${id}`);
	};

	return (
		<section className="flex flex-col gap-0">
			<div className="relative h-70">
				<AnimatePresence initial={false} mode="wait">
					{scripts.length > 0 && activeIndex ? (
						<div key={activeIndex} className="absolute w-full h-full">
							<div
								onClick={(e) => {
									e.preventDefault();
									handlePromoClick(activeIndex);
								}}
								className="w-full h-72 flex transition-all duration-200 cursor-pointer rounded-xl relative overflow-hidden group border border-white/5 "
							>
								<div className="absolute inset-0 w-full h-full bg-black/5 backdrop-blur-lg z-50" />
								{scripts.find((script) => script.id === activeIndex)
									?.banner_url ? (
									<motion.img
										aria-hidden
										alt={
											scripts.find((script) => script.id === activeIndex)?.name
										}
										src={
											scripts.find((script) => script.id === activeIndex)
												?.banner_url
										}
										className={`absolute inset-0 w-full h-full bg-black/5 opacity-50`}
										style={{
											objectFit: "cover",
											width: "100%",
											height: "100%",
										}}
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
								) : (
									<motion.div
										aria-hidden
										className="absolute inset-0 w-full h-full bg-black/5 opacity-20 scale-150"
										style={{
											background:
												gradients[activeIndex] ||
												"linear-gradient(135deg, #1e1e2f 0%, #2c2c3a 50%, #BCB1E7 100%)",
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
								)}
								<motion.div
									initial={{ opacity: 0, filter: "blur(4px)", top: 10 }}
									animate={{ opacity: 1, filter: "blur(0px)", top: 0 }}
									exit={{ opacity: 0, filter: "blur(4px)", top: -10 }}
									transition={{ duration: 0.3 }}
									className="z-50 absolute inset-0 p-10 transition-colors duration-200 group-hover:bg-black/5"
								>
									<div className="flex w-full h-full flex-col justify-start items-center">
										<div className="w-full h-full flex justify-end">
											{scripts.find((script) => script.id === activeIndex)
												?.logo_url && (
												<img
													src={
														scripts.find((script) => script.id === activeIndex)
															?.logo_url
													}
													alt={
														scripts.find((script) => script.id === activeIndex)
															?.name
													}
													className="w-24 h-24 rounded-xl object-cover drop-shadow-xl"
												/>
											)}
										</div>
										<div className="flex flex-col justify-end gap-2 w-full h-full -mt-6">
											<h1 className="font-medium text-4xl tracking-tight">
												{
													scripts.find((script) => script.id === activeIndex)
														?.name
												}
											</h1>
											<h3 className="text-sm mt-2 text-neutral-300 text-balance truncate">
												{
													scripts.find((script) => script.id === activeIndex)
														?.description
												}
											</h3>
										</div>
									</div>
									<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-50">
										{scripts.map((_, index) => (
											<button
												type="button"
												key={index}
												onClick={(e) => {
													e.preventDefault();
													handleDotClick(index);
												}}
												className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-white w-6" : "bg-white/50 hover:bg-white/70"}`}
											/>
										))}
									</div>
								</motion.div>
							</div>
						</div>
					) : (
						<CarrouselSkeleton />
					)}
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
					<div className="w-full h-72 flex rounded-xl relative overflow-hidden border border-white/5">
						<div className="absolute inset-0 w-full h-full bg-black/5 backdrop-blur-lg z-50" />
						<div className="absolute inset-0 w-full h-full bg-gradient-to-br from-neutral-600/20 to-neutral-900/10" />
						<div className="z-50 absolute inset-0 p-10">
							<div className="flex w-full h-full flex-col justify-start items-center">
								<div className="w-full h-full flex justify-end">
									<div className="w-24 h-24 rounded-xl bg-gray-200/20 animate-pulse" />
								</div>
								<div className="flex flex-col justify-end gap-2 w-full h-full -mt-6">
									<div className="h-10 w-3/4 rounded-md bg-gray-200/20 animate-pulse" />
									<div className="space-y-2 mt-2">
										<div className="h-4 w-full rounded-md bg-gray-200/20 animate-pulse" />
										<div className="h-4 w-4/5 rounded-md bg-gray-200/20 animate-pulse" />
									</div>
								</div>
							</div>
							<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-50">
								{[...Array(5)].map((_, index) => (
									<div
										key={index}
										className={`h-2 rounded-full bg-gray-200/30 animate-pulse ${index === 0 ? "w-6" : "w-2"}`}
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
