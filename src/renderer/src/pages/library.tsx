import Installed from "@/components/features/library/installed";
import LocalScripts from "@/components/features/library/local-scripts";

export default function Library() {
	return (
		<div className="h-full bg-background pt-4">
			<div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
				<main className="flex flex-col gap-6 py-5">
					<Installed />
					<LocalScripts />
				</main>
			</div>
		</div>
	);
}
