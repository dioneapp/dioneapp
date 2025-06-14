import { getCurrentPort } from "@renderer/utils/getPort";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import CarrouselSkeleton from "./carrousel-skeleton";
import type { Script } from "./feed/types";

export default function FeaturedCarousel() {
	const [scripts, setScripts] = useState<Script[]>([]);
	const [loading, setLoading] = useState(true);
	const [_error, setError] = useState<string | null>(null);
	const [gradients, setGradients] = useState<Record<string, string>>({});
	const [activeIndex, setActiveIndex] = useState<string | null>(null);
	const [currentIndex, setCurrentIndex] = useState<number>(0);

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
					setScripts(data);
					generateGradients(data);
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

		await Promise.all(
			scripts.map(async (script) => {
				if (script.banner_url) {				
					return;
				}
				if (script.logo_url) {
					try {
						const githubRawUrl = script.logo_url
							.replace("github.com", "raw.githubusercontent.com")
							.replace("/blob/", "/");

						const colors = await getColorPaletteFromImage(githubRawUrl);
						if (colors.vibrant && colors.lightVibrant) {
							newGradients[script.id] =
								`linear-gradient(${Math.floor(Math.random() * 360)}deg, ${colors.vibrant}, ${colors.lightVibrant})`;
						}
					} catch (error) {
						console.error("Error extracting colors:", error);
					}
				} else {
					newGradients[script.id] = "linear-gradient(to top, #000000, #434343)";
				}
			}),
		);

		setGradients(newGradients);
	};

	// get color palette from image
	const getColorPaletteFromImage = (
		imageUrl: string,
	): Promise<{ vibrant: string; lightVibrant: string }> => {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.crossOrigin = "anonymous";
			img.onload = () => {
				const canvas = document.createElement("canvas");
				canvas.width = img.width;
				canvas.height = img.height;
				const ctx = canvas.getContext("2d");
				if (!ctx) return reject(new Error("Could not get canvas context"));
				ctx.drawImage(img, 0, 0);
				const imageData = ctx.getImageData(0, 0, img.width, img.height).data;
				const colorCounts: { [key: string]: number } = {};

				for (let i = 0; i < imageData.length; i += 4) {
					if (imageData[i + 3] < 200) continue;
					const hex = rgbToHex(
						imageData[i],
						imageData[i + 1],
						imageData[i + 2],
					);
					colorCounts[hex] = (colorCounts[hex] || 0) + 1;
				}

				const sortedColors = Object.entries(colorCounts).sort(
					(a, b) => b[1] - a[1],
				);
				const vibrant = sortedColors[0]?.[0] || "#000000E6";
				let lightVibrant = sortedColors[2]?.[0] || vibrant;

				if (areColorsSimilar(vibrant, lightVibrant))
					lightVibrant = sortedColors[2]?.[0] || vibrant;

				resolve({ vibrant, lightVibrant });
			};
			img.onerror = reject;
			img.src = imageUrl;
		});
	};

	const rgbToHex = (r: number, g: number, b: number): string =>
		`#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
	const areColorsSimilar = (color1: string, color2: string): boolean => {
		const [r1, g1, b1] = hexToRgb(color1);
		const [r2, g2, b2] = hexToRgb(color2);
		return Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2) < 50;
	};
	const hexToRgb = (hex: string): [number, number, number] => [
		Number.parseInt(hex.slice(1, 3), 16),
		Number.parseInt(hex.slice(3, 5), 16),
		Number.parseInt(hex.slice(5, 7), 16),
	];

	if (loading) {
		return <CarrouselSkeleton />;
	}

	return (
		<section className="flex flex-col gap-0">
			<div className="relative h-70">
				<AnimatePresence initial={false} mode="wait">
					{scripts.length > 0 && activeIndex ? (
						<div key={activeIndex} className="absolute w-full h-full">
							<Link
								to={`/install/${activeIndex}`}
								className="w-full h-72 flex transition-all duration-200 cursor-pointer rounded-xl relative overflow-hidden group border border-white/5 "
							>
								{/* background */}
								<div className="absolute inset-0 w-full h-full bg-black/5 backdrop-blur-lg z-50" />
								<img
									alt={scripts.find((script) => script.id === activeIndex)?.name}
									src={scripts.find((script) => script.id === activeIndex)?.banner_url || ""}
									style={{ background: gradients[activeIndex] || "#000000E6" }}
									className={`absolute inset-0 w-full h-full bg-black/5 ${scripts.find((script) => script.id === activeIndex)?.banner_url ? "opacity-50" : "opacity-20 scale-150"}`}
								/>
								{/* content */}
								<div className="z-50 absolute inset-0 p-10 transition-all duration-500 group-hover:bg-black/20">
									<div className="flex w-full h-full flex-col justify-start items-center">
										{/* logo */}
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

									{/* progress Indicators */}
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
								</div>
							</Link>
						</div>
					) : (
						<CarrouselSkeleton />
					)}
				</AnimatePresence>
			</div>
		</section>
	);
}
