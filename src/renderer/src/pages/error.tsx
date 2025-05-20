import Icon from "@renderer/components/icons/icon";

export default function ErrorPage() {
	const restart = () => {
		window.electron.ipcRenderer.send("restart");
	};

	return (
		<div className="min-h-screen pt-4 overflow-hidden">
			<div className="max-w-[2000px] h-screen overflow-hidden mx-auto px-4 sm:px-6 lg:px-8">
				<main className="flex flex-col h-full justify-center items-center pb-24">
					<Icon name="DioDead" className="h-44 w-44 mb-12" />
					<h1 className="text-2xl sm:text-3xl font-semibold mb-4">
						Unexpected error occurred
					</h1>
					<p className="text-neutral-400 text-xs max-w-sm text-center text-pretty">
						We have detected an unexpected error in the application, we are
						sorry for the inconvenience. You can restart the application by
						clicking on the button below.
					</p>
					<button
						onClick={restart}
						type="button"
						className="mt-6 px-4 bg-white hover:bg-white/80 transition-colors duration-400 rounded-full text-black font-semibold py-1 text-center cursor-pointer"
					>
						Restart
					</button>
				</main>
			</div>
		</div>
	);
}
