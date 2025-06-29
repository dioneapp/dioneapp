import Explore from "../components/home/explore/explore";
import Featured from "../components/home/featured/featured";
import { useTranslation } from "../translations/translationContext";

export default function Home() {
	const { t } = useTranslation();

	return (
		<div className="min-h-screen bg-background dark:bg-background light:bg-background-light pt-4">
			<div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
				<main className="flex flex-col gap-6 py-5">
					{/* featured section */}
					<section className="relative">
						<h1 className="text-2xl sm:text-3xl font-semibold mb-4 text-text-primary dark:text-text-primary light:text-text-primary-light">
							{t("home.featured")}
						</h1>
						<div className="w-full">
							<Featured />
						</div>
					</section>
					{/* explore section */}
					<section className="relative mt-2">
						<h1 className="text-2xl sm:text-3xl font-semibold mb-4 text-text-primary dark:text-text-primary light:text-text-primary-light">
							{t("home.explore")}
						</h1>
						<div className="w-full">
							<Explore />
						</div>
					</section>
				</main>
			</div>
		</div>
	);
}
