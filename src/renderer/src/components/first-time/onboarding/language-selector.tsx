import { languages, useTranslation } from "@/translations/translation-context";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

interface LanguageSelectorProps {
	onSelectLanguage: () => void;
}

export default function LanguageSelector({
	onSelectLanguage,
}: LanguageSelectorProps) {
	const { setLanguage, language, t } = useTranslation();
	const [currentPage, setCurrentPage] = useState(0);
	const [_direction, setDirection] = useState(0);
	const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
	const perPage = 8;

	const languageEntries = useMemo(() => Object.entries(languages), []);
	const totalPages = Math.ceil(languageEntries.length / perPage);

	const currentLanguages = useMemo(() => {
		const startIndex = currentPage * perPage;
		return languageEntries.slice(startIndex, startIndex + perPage);
	}, [currentPage, languageEntries]);

	const handleImageLoad = (key: string) => {
		setLoadedImages((prev) => new Set(prev).add(key));
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
				<motion.h1 className="text-5xl font-semibold mt-30 text-center">
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
							className="grid grid-cols-4 grid-rows-2 w-full h-full place-items-center gap-4 max-w-2xl p-8 rounded-xl border border-white/10 backdrop-blur-sm"
							style={{
								background: 'linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 5%, transparent), color-mix(in srgb, var(--theme-background) 10%, transparent))'
							}}
						>
							{currentLanguages.map(([key, value]) => (
								<motion.button
									type="button"
									key={key}
									className={`group cursor-pointer flex flex-col gap-3 items-center justify-center overflow-visible relative transition-all duration-300 focus:outline-none ${
											language === key
												? "hover:bg-gradient-to-l from-white/20 via-white/10 to-white/[0.01] rounded-b-none"
												: "hover:bg-gradient-to-b from-white/20 via-white/10 to-white/[0.01] rounded-b-none"
										}`}
										onClick={() => {
											setLanguage(key as any);
										}}
									>
									{language === key && (
										<motion.div
											initial={{ opacity: 0, scale: 0 }}
											animate={{ opacity: 1, scale: 1 }}
											className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-lg border border-white/20 z-[9999]"
											style={{
												background: 'linear-gradient(to right, var(--theme-gradient-from), var(--theme-gradient-to))'
											}}
										>
											<Check className="w-4 h-4 text-black" />
										</motion.div>
									)}										<div className="relative w-full h-full">
											{!isImageLoaded(key) && (
												<div className="absolute inset-0 bg-white/10 border border-white/5 rounded-lg aspect-[5/3] animate-pulse" />
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
																	: key === "ja"
																		? "https://flagcdn.com/jp.svg"
																		: key === "zh"
																			? "https://flagcdn.com/cn.svg"
																			: `https://flagcdn.com/${key}.svg`
												}
												alt={value}
												className={`w-full h-full object-center object-cover aspect-[3/2] transition-all duration-300 ${
													isImageLoaded(key) ? "opacity-100" : "opacity-0"
												}`}
												onLoad={() => handleImageLoad(key)}
											/>
										</div>

										<span className="px-3 py-1 rounded-lg font-medium text-sm transition-all duration-300">
											{value}
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
						disabled={!language}
						className={`px-6 py-2 cursor-pointer transition-all duration-300 rounded-full text-sm font-medium ${
							language
								? "bg-white text-black hover:opacity-80 active:scale-[0.97] shadow-lg"
								: "bg-white/10 text-white/50 cursor-not-allowed border border-white/10"
						}`}
					>
						{t("languageSelector.next")}
					</button>
				</div>
			</div>
		</section>
	);
}
