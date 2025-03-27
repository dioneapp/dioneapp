import Installed from "@renderer/components/home/installed";

export default function Library() {
	return (
		<div className="min-h-screen bg-background">
			<div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
				<main className="flex flex-col gap-6 py-5">
					{/* installed section */}
					<section className="relative">
						<div className="w-full">
							<Installed />
						</div>
					</section>
				</main>
			</div>
		</div>
	);
}
