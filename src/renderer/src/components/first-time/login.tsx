export default function SureNotLogin({
	onSkip,
	onLogin,
}: { onSkip: () => void; onLogin: () => void }) {
	return (
		<section className="min-h-screen min-w-screen flex flex-col items-center justify-center px-4">
			<div className="flex justify-start items-center gap-4 w-screen h-full pl-12">
				<div className="flex flex-col items-start gap-4 max-w-2xl">
					<h1 className="font-semibold text-5xl">You are missing features</h1>
					<p className="text-neutral-400 text-wrap text-sm">
						Log in to Dione so you don't miss out on these features.
					</p>
					<div className="flex gap-2 w-full mt-6 max-w-sm">
						<button
							onClick={onLogin}
							type="button"
							className="bg-white w-full hover:opacity-80 transition-opacity duration-300 rounded-full px-12 py-1.5 text-sm font-semibold text-black cursor-pointer"
						>
							Log in
						</button>
						<button
							onClick={onSkip}
							type="button"
							className="border w-full border-white/10 hover:bg-white/10 transition-colors duration-300 rounded-full px-6 py-1.5 text-sm font-medium text-neutral-400 cursor-pointer"
						>
							Skip
						</button>
					</div>
				</div>
				<div className="w-full flex justify-end items-center -mr-44 z-50">
					<div className="grid grid-cols-2 grid-rows-2 gap-2 w-full">
						<div className="flex flex-col gap-2 bg-black/50 hover:border-white/20 transition-colors duration-300 border border-white/10 rounded-lg w-full h-62 xl:h-72 relative overflow-hidden">
							<div className="absolute right-24 -top-24 w-34 h-44 bg-pink-800/20 rounded-full blur-3xl" />
							<div className="p-4 flex flex-col gap-2 h-full">
								<h2 className="font-semibold text-3xl">Send custom reports</h2>
								<p className="text-neutral-400 text-wrap text-sm mt-auto">
									Send custom reports from within the application, making
									support faster in case of errors.
								</p>
							</div>
						</div>
						<div className="flex flex-col gap-2 bg-black/50 hover:border-white/20 transition-colors duration-300 border border-white/10 rounded-lg w-full h-62 xl:h-72 relative overflow-hidden">
							<div className="absolute right-24  w-34 h-44 bg-zinc-600/20 rounded-full blur-3xl" />
							<div className="p-4 flex flex-col gap-2 h-full">
								<h2 className="font-semibold text-3xl">Create a profile</h2>
								<p className="text-neutral-400 text-wrap text-sm mt-auto">
									Create a profile for the Dione community to get to know you.
								</p>
							</div>
						</div>
						<div className="flex flex-col gap-2 bg-black/50 hover:border-white/20 transition-colors duration-300 border border-white/10 rounded-lg w-full h-62 xl:h-72 relative overflow-hidden">
							<div className="absolute left-12 w-34 h-44 bg-[#BCB1E7]/20 rounded-full blur-3xl" />
							<div className="p-4 flex flex-col gap-2 h-full">
								<h2 className="font-semibold text-3xl">Sync your data</h2>
								<p className="text-neutral-400 text-wrap text-sm mt-auto">
									Sync your data across all your devices.
								</p>
							</div>
						</div>
						<div className="flex flex-col gap-2 bg-black/50 hover:border-white/20 transition-colors duration-300 border border-white/10 rounded-lg w-full h-62 xl:h-72 relative overflow-hidden">
							<div className="absolute right-0 top-24 w-44 h-44 bg-yellow-300/20 rounded-full blur-3xl" />
							<div className="p-4 flex flex-col gap-2 h-full">
								<h2 className="font-semibold text-3xl">
									Get early birds updates
								</h2>
								<p className="text-neutral-400 text-wrap text-sm mt-auto">
									Get early birds updates and new features before anyone else.
								</p>
							</div>
						</div>
						<div className="flex flex-col gap-2 bg-black/50 hover:border-white/20 transition-colors duration-300 border border-white/10 rounded-lg w-full h-62 xl:h-72 relative overflow-hidden">
							<div className="absolute right-0 top-0 w-24 h-44 bg-red-300/20 rounded-full blur-3xl" />
							<div className="p-4 flex flex-col gap-2 h-full">
								<h2 className="font-semibold text-3xl">Give out likes</h2>
								<p className="text-neutral-400 text-wrap text-sm mt-auto">
									Leave likes to the apps you like the most, so more people will
									use them!
								</p>
							</div>
						</div>
						<div className="flex flex-col gap-2 bg-black/50 hover:border-white/20 transition-colors duration-300 border border-white/10 rounded-lg w-full h-62 xl:h-72 relative overflow-hidden">
							<div className="absolute left-0 -bottom-20 w-24 h-44 bg-white/20 rounded-full blur-3xl" />
							<div className="p-4 flex flex-col gap-2 h-full">
								<h2 className="font-semibold text-3xl">Publish scripts</h2>
								<p className="text-neutral-400 text-wrap text-sm mt-auto">
									Publish your scripts and share them with the world.
								</p>
							</div>
						</div>
						<div className="flex flex-col gap-2 bg-black/50 hover:border-white/20 transition-colors duration-300 border border-white/10 rounded-lg w-full h-62 xl:h-72 relative overflow-hidden">
							<div className="absolute left-0 -bottom-20 w-24 h-44 bg-blue-300/20 rounded-full blur-3xl" />
							<div className="p-4 flex flex-col gap-2 h-full">
								<h2 className="font-semibold text-3xl">Achieve goals</h2>
								<p className="text-neutral-400 text-wrap text-sm mt-auto">
									Achieve goals like using Dione for 7 days to get free gifts
								</p>
							</div>
						</div>
						<div className="flex flex-col gap-2 bg-black/50 hover:border-white/20 transition-colors duration-300 border border-white/10 rounded-lg w-full h-62 xl:h-72 relative overflow-hidden">
							<div className="absolute right-0 -top-20 w-44 h-44 bg-green-300/20 rounded-full blur-3xl" />
							<div className="p-4 flex flex-col gap-2 h-full">
								<h2 className="font-semibold text-3xl">Get newswire</h2>
								<p className="text-neutral-400 text-wrap text-sm mt-auto">
									Receive updates via email so you don't miss out on new
									features.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
