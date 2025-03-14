import Installed from "@renderer/components/home/installed";
import Explore from "../components/home/explore";
import Featured from "../components/home/featured";

export default function Home() {
	return (
		<div className="min-h-screen bg-background">
			<div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
				<main className="flex flex-col gap-6 py-6">
					{/* featured section */}
					<section className="relative">
						<h1 className="text-2xl sm:text-3xl font-semibold mb-4">
							Featured
						</h1>
						<div className="w-full">
							<Featured />
						</div>
					</section>
					{/* installed section */}
					<section className="relative">
						<div className="w-full">
							<Installed />
						</div>
					</section>
					{/* explore section */}
					<section className="relative">
						<h1 className="text-2xl sm:text-3xl font-semibold mb-4">Explore</h1>
						<div className="w-full">
							<Explore />
						</div>
					</section>
				</main>
			</div>
		</div>
	);
}
