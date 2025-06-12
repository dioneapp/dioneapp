import Explore from "../components/home/explore";
import Featured from "../components/home/featured";
import { useTranslation } from '../translations/translationContext';

export default function Home() {
	const { t } = useTranslation();

	return (
		<div className="min-h-screen bg-background pt-4">
			<div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
				<main className="flex flex-col gap-6 py-5">
					{/* featured section */}
					<section className="relative">
						<h1 className="text-2xl sm:text-3xl font-semibold mb-4">
							{t("home.featured")}
						</h1>
						<div className="w-full">
							<Featured />
						</div>
					</section>
					<section className="relative mt-2">
						<h1 className="text-2xl sm:text-3xl font-semibold mb-4">{t("home.explore")}</h1>
						<div className="w-full">
							<Explore />
						</div>
					</section>
				</main>
			</div>
		</div>
	);
}
