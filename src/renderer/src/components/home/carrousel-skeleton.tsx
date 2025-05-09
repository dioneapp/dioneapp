export default function CarrouselSkeleton() {
	return (
		<section className="flex flex-col gap-0">
			<div className="relative h-70">
				<div className="absolute w-full h-full">
					<div className="w-full h-72 flex rounded-xl relative overflow-hidden border border-white/5">
						{/* background skeleton */}
						<div className="absolute inset-0 w-full h-full bg-black/5 backdrop-blur-lg z-50" />
						<div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-600/20 to-gray-900/10" />

						{/* content skeleton */}
						<div className="z-50 absolute inset-0 p-10">
							<div className="flex w-full h-full flex-col justify-start items-center">
								{/* logo skeleton */}
								<div className="w-full h-full flex justify-end">
									<div className="w-24 h-24 rounded-xl bg-gray-200/20 animate-pulse" />
								</div>

								<div className="flex flex-col justify-end gap-2 w-full h-full -mt-6">
									{/* title skeleton */}
									<div className="h-10 w-3/4 rounded-md bg-gray-200/20 animate-pulse" />

									{/* description skeleton */}
									<div className="space-y-2 mt-2">
										<div className="h-4 w-full rounded-md bg-gray-200/20 animate-pulse" />
										<div className="h-4 w-4/5 rounded-md bg-gray-200/20 animate-pulse" />
									</div>
								</div>
							</div>

							{/* progress indicators skeleton */}
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
