import Installed from "@/components/library/installed";
import LocalScripts from "@/components/library/local-scripts";

export default function Library() {
	return (
		<div className="min-h-screen bg-background pt-4">
			<div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
				<main className="flex flex-col gap-6 py-5">
					<Installed />
					<LocalScripts />
				</main>
			</div>
		</div>
	);
}
