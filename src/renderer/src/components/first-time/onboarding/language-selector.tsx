import { languages } from "@renderer/translations/translationContext";
import { useTranslation } from "@renderer/translations/translationContext";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

interface LanguageSelectorProps {
	onSelectLanguage: () => void;
}

export default function LanguageSelector({
	onSelectLanguage,
}: LanguageSelectorProps) {
	const { setLanguage, language, t } = useTranslation();
	const [currentPage, setCurrentPage] = useState(0);
	const [direction, setDirection] = useState(0);
	const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
	const perPage = 8;

	const languageEntries = useMemo(() => Object.entries(languages), []);
	const totalPages = Math.ceil(languageEntries.length / perPage);

	const currentLanguages = useMemo(() => {
		const startIndex = currentPage * perPage;
		return languageEntries.slice(startIndex, startIndex + perPage);
	}, [currentPage, languageEntries]);

	const handleImageLoad = (key: string) => {
		setLoadedImages(prev => new Set(prev).add(key));
	};

	const isImageLoaded = (key: string) => loadedImages.has(key);

	const goToNextPage = () => {
		setDirection(1);
		setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
	};

	const goToPrevPage = () => {
		setDirection(-1);
		setCurrentPage((prev) => Math.max(prev - 1, 0));
	};

	return (
		<section className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
			<div className="flex flex-col items-center justify-between h-full w-full max-w-screen-lg gap-8">
				<motion.h1
					className="text-5xl font-semibold mt-30 text-center"
				>
					{t("firstTime.languageSelector.title")}
				</motion.h1>
				<div className="flex flex-col items-center justify-center grow gap-6">
					<div className="flex gap-8 items-center">
						<button
							type="button"
							onClick={goToPrevPage}
							disabled={currentPage === 0}
							className="cursor-pointer enabled:hover:bg-white/10 rounded-full p-1 flex items-center justify-center disabled:opacity-50 transition-colors duration-300"
						>
							<ChevronLeft className="w-6 h-6" />
						</button>
						<AnimatePresence mode="sync" initial={false}>
							<div
								key={currentPage}
								className="grid grid-cols-4 grid-rows-2 w-full h-full place-items-center gap-4 max-w-2xl p-4 rounded-xl bg-white/10"
							>
								{currentLanguages.map(([key, value]) => (
									<motion.button
										whileTap={{ scale: 0.95 }}
										whileHover={{ scale: 1.05 }}
										type="button"
										key={key}
										className={`group cursor-pointer flex flex-col gap-2 items-center justify-center overflow-hidden relative rounded transition-all duration-300 focus:outline-none ${language === key ? "scale-105 shadow-lg" : ""}`}
										onClick={() => {
											setLanguage(key as any);
										}}
									>
										<div className="relative w-full h-full">
											{!isImageLoaded(key) && (
												<div className="absolute inset-0 bg-white/10 border border-white/5 rounded aspect-[5/3] animate-pulse" />
											)}
											<motion.img
												loading="lazy"
												decoding="async"
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												transition={{ duration: 0.5, ease: [0.42, 0, 0.58, 1] }}
												src={
													key === "ar"
														? "https://flagcdn.com/eg.svg"
														: key === "bn"
															? "https://flagcdn.com/bd.svg"
															: key === "en"
																? "https://flagcdn.com/us.svg"
																: key === "hi"
																	? "https://flagcdn.com/in.svg"
																	: key === "zh"
																		? "https://flagcdn.com/cn.svg"
																		: `https://flagcdn.com/${key}.svg`
												}
												alt={value}
												className={`bg-black/10 border border-white/5 w-full h-full object-cover object-center overflow-hidden rounded aspect-[5/3] transition-opacity duration-300 ${isImageLoaded(key) ? 'opacity-100' : 'opacity-0'}`}
												onLoad={() => handleImageLoad(key)}
											/>
										</div>
										<span className="opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 absolute bottom-0 left-0 px-2 bg-gradient-to-t from-[#080808] via-[#080808]/50 to-[#080808]/0 w-full h-10 pointer-events-none">
											<div className="flex items-end pb-2 font-medium justify-start h-full text-sm">
												{value}
											</div>
										</span>
									</motion.button>
								))}
							</div>
						</AnimatePresence>
						<button
							type="button"
							onClick={goToNextPage}
							disabled={currentPage === totalPages - 1}
							className="cursor-pointer hover:bg-white/10 rounded-full p-1 flex items-center justify-center disabled:opacity-50 transition-colors duration-300"
						>
							<ChevronRight className="w-6 h-6" />
						</button>
					</div>
					<div className="mt-2 text-base text-neutral-300 min-h-6">
						{language && (
							<span className="px-3 py-1 rounded-full bg-white/10 text-white/90 font-medium">
								{languages[language]}
							</span>
						)}
					</div>
					<a
						href="https://github.com/dioneapp/dioneapp"
						target="_blank"
						rel="noopener noreferrer"
						className="text-xs text-neutral-400 hover:text-neutral-200 transition-colors duration-200 px-2 py-0.5 rounded-xl bg-white/10 mt-6"
					>
						{t("settings.interface.helpTranslate")}
					</a>
				</div>
				<div className="flex flex-col items-center gap-4 mt-auto mb-10">
					<button
						type="button"
						onClick={onSelectLanguage}
						className="bg-white text-black px-4 py-1 cursor-pointer hover:bg-white/80 transition-all duration-300 rounded-full text-sm font-medium"
					>
						Next
					</button>
				</div>
			</div>
		</section>
	);
}
