import {
	BadgeCheck,
	Calendar,
	Download,
	GitCompare,
	Tag,
	Trash,
} from "lucide-react";
import { memo } from "react";
import { Link } from "react-router-dom";
import type { Script } from "./types";

interface ScriptCardProps {
	script: Script;
	innerRef?: React.Ref<HTMLDivElement>;
	deleteScript?: (name: string) => void;
}

function ScriptCard({ script, innerRef, deleteScript }: ScriptCardProps) {
	const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
		e.currentTarget.src = "/svgs/Dio.svg";
	};

	return (
		<div ref={innerRef}>
			<Link
				to={{
					pathname: `/install/${script.isLocal ? encodeURIComponent(script.name) : script.id}`,
					search: `?isLocal=${script.isLocal}`,
				}}
				className="group flex flex-col gap-4 h-full border border-white/10 hover:border-white/20 
                bg-gradient-to-r from-[#BCB1E7]/5 to-[#080808]/10 rounded-lg p-4 hover:shadow-lg items-center relative"
			>
				<div className="w-full flex">
					<div className="flex items-center gap-4">
						{script.logo_url?.startsWith("http") ? (
							<img
								src={script.logo_url}
								onError={handleImageError}
								alt={`${script.name} icon`}
								className="h-16 w-16 rounded-xl border border-white/10 object-cover 
						object-center group-hover:border-white/20 bg-neutral-800/50"
							/>
						) : (
							<div
								className="h-16 w-16 rounded-xl border border-white/10 backdrop-blur-3xl bg-cover bg-center 
						group-hover:border-white/20 items-center justify-center flex bg-neutral-900"
							>
								<span className="text-white/70 font-semibold text-xl">
									{script.name?.charAt(0)?.toUpperCase() || "?"}
								</span>
							</div>
						)}
						<div className="flex flex-col gap-1 flex-1 min-w-0">
							<h2 className="text-xl sm:text-2xl text-white font-medium truncate">
								{script.name}
							</h2>
							<p className="text-xs text-neutral-400 line-clamp-2 break-words">
								{script.description}
							</p>
						</div>
					</div>
					{deleteScript && (
						<div className="absolute right-4 top-5">
							<button
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation(); // prevents redirect
									deleteScript(script.name);
								}}
								type="button"
								className="opacity-0 group-hover:opacity-100 cursor-pointer hover:bg-red-500/50 border border-white/20 rounded-full p-2 transition-all duration-200"
								style={{
									zIndex: 9999,
								}}
							>
								<Trash className="h-4 w-4" />
							</button>
						</div>
					)}
				</div>
				{!script.isLocal && (
					<div className="flex items-center w-full">
						<div className="flex items-center gap-2 flex-1">
							{script.official && (
								<span className="text-[10px] font-medium text-white bg-gradient-to-r from-[#BCB1E7]/20 to-[#9A8FD1]/20 rounded px-2 p-0.5 border border-[#BCB1E7]/30 group-hover:border-[#BCB1E7]/50 group-hover:from-[#BCB1E7]/30 group-hover:to-[#9A8FD1]/30 flex items-center justify-center my-auto gap-1.5 shadow-sm group-hover:shadow-md backdrop-blur-sm">
									<BadgeCheck className="inline h-3 w-3 text-[#BCB1E7] drop-shadow-sm" />
									<span className="bg-gradient-to-r from-[#BCB1E7] to-[#9A8FD1] bg-clip-text text-transparent font-semibold">
										Official
									</span>
								</span>
							)}
							{script.created_at && (
								<span className="text-[10px] text-neutral-400 bg-black/20 rounded px-2 p-0.5 border border-white/10 group-hover:border-white/15 flex items-center justify-center my-auto gap-1">
									<Calendar className="inline h-3 w-3" />
									{new Date(script.created_at).toLocaleDateString()}
								</span>
							)}
							{script.downloads !== 0 && script.downloads && (
								<span className="text-[10px] text-neutral-400 bg-black/20 rounded px-2 p-0.5 border border-white/10 group-hover:border-white/15 flex items-center justify-center my-auto gap-1">
									<Download className="inline h-3 w-3" />
									{script.downloads}
								</span>
							)}
							{script.tags && (
								<span className="text-[10px] text-neutral-400 bg-black/20 rounded px-2 p-0.5 border border-white/10 group-hover:border-white/15 flex items-center justify-center my-auto gap-1">
									<Tag className="inline h-3 w-3" />
									<span className="capitalize">{script.tags}</span>
								</span>
							)}
							{script.version && (
								<span className="text-[10px] text-neutral-400 bg-black/20 rounded px-2 p-0.5 border border-white/10 group-hover:border-white/15 flex items-center justify-center my-auto gap-1">
									<GitCompare className="inline h-3 w-3" />v{script.version}
								</span>
							)}
						</div>
					</div>
				)}
			</Link>
		</div>
	);
}

export default memo(ScriptCard);
