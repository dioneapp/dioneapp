import { languages } from "@renderer/translations/translationContext";
import { useTranslation } from "@renderer/translations/translationContext";
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
	const perPage = 8;

	const languageEntries = useMemo(() => Object.entries(languages), []);
	const totalPages = Math.ceil(languageEntries.length / perPage);

	const currentLanguages = useMemo(() => {
		const startIndex = currentPage * perPage;
		return languageEntries.slice(startIndex, startIndex + perPage);
	}, [currentPage, languageEntries]);

	const goToNextPage = () => {
		setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
	};

	const goToPrevPage = () => {
		setCurrentPage((prev) => Math.max(prev - 1, 0));
	};

	return (
		<section className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
			<div className="flex flex-col items-center justify-between h-full w-full max-w-screen-lg gap-8">
				<h1 className="text-6xl font-semibold mt-10">
					{t("firstTime.languageSelector.title")}
				</h1>
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
						<div className="grid grid-cols-4 grid-rows-2 w-full h-full place-items-center gap-4 max-w-2xl">
							{currentLanguages.map(([key, value]) => (
								<button
									type="button"
									key={key}
									className={`cursor-pointer flex flex-col gap-2 items-center justify-center overflow-hidden hover:[&_span]:opacity-100 hover:[&_span]:bottom-0 hover:[&_span_div]:blur-none hover:[&_span_div]:mt-0 relative rounded ${language === key ? "[&_img]:opacity-50" : ""}`}
									onClick={() => {
										setLanguage(key as any);
									}}
								>
									<img
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
										className="w-full h-full object-cover object-center overflow-hidden rounded aspect-[5/3] transition-opacity duration-300"
									/>
									<span className="opacity-0 transition-all duration-300 absolute -bottom-4 left-0 px-2 bg-gradient-to-t from-[#080808] via-[#080808]/50 to-[#080808]/0 w-full h-10">
										<div className="flex items-end mt-6 pb-2 font-medium justify-start h-full blur transition-all duration-400 text-sm">
											{value}
										</div>
									</span>
								</button>
							))}
						</div>
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
						className="bg-white text-black px-4 py-1 cursor-pointer hover:bg-white/80 transition-all duration-300 rounded-full text-sm font-medium"
					>
						Next
					</button>
				</div>
			</div>
		</section>
	);
}
