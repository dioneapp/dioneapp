import { openLink } from "@renderer/utils/openLink";
import { Gpu, Monitor } from "lucide-react";

export default function NotSupported({ reasons, data, onClose }: { reasons: string[]; data: any; onClose: () => void }) {
	return (
		<div className="absolute h-screen w-full bg-black/40 backdrop-blur-xl" style={{ zIndex: 999 }}>
			<div className="w-full h-full flex justify-center items-center">
				<div className="max-w-2xl max-h-96 rounded-xl w-full h-full bg-black/80 border border-white/10 overflow-hidden relative flex flex-col">
					<div className="flex items-start p-6">
						<div className="absolute">
							{reasons[0].includes("gpu") ? (
								<Gpu className="w-64 h-64 -ml-12 mt-36 opacity-80"/>
							) : (
								<Monitor className="w-64 h-64 -ml-24 mt-38 opacity-80"/>
							)}
						</div>
						<div className="flex flex-col justify-end ml-auto max-w-xl gap-2 text-right">
							<h1 className="text-3xl font-semibold">Your device is not supported</h1>
							<h2 className="text-sm text-neutral-400 ">Unfortunately <span className="text-neutral-200 hover:underline">{data.name || "this app"}</span> does not support your <span className="text-neutral-200 hover:underline">{reasons.includes("gpu") ? "GPU" : "operating system"}</span>. </h2>
						</div>
					</div>
					<div className="flex flex-col w-full ml-auto mt-auto justify-end items-end px-6 py-4">
						<button onClick={onClose} className="bg-neutral-200 hover:bg-neutral-300 transition-all duration-300 cursor-pointer text-black text-sm font-semibold py-1 w-24 rounded-full">Close</button>
						<p onClick={() => openLink(data.author_url || "https://github.com/dioneapp/official-scripts")} className="text-xs text-neutral-400 mt-2 hover:text-neutral-200 transition-all duration-300 cursor-pointer">Help us make this script compatible with all devices</p>
					</div>
				</div>
			</div>
		</div>
	);
}