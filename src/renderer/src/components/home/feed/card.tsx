import type { Script } from "@/components/home/feed/types";
import GeneratedIcon from "@/components/icons/generated-icon";
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
				bg-linear-to-r transition-colors duration-300 rounded-lg p-4 hover:shadow-lg items-center relative"
				style={{
					background: `linear-gradient(to right, color-mix(in srgb, var(--theme-gradient-from) 5%, transparent), color-mix(in srgb, var(--theme-background) 10%, transparent))`,
				}}
				onMouseEnter={(e) => {
					e.currentTarget.style.background = `linear-gradient(to right, color-mix(in srgb, var(--theme-gradient-from) 10%, transparent), color-mix(in srgb, var(--theme-background) 20%, transparent))`;
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.background = `linear-gradient(to right, color-mix(in srgb, var(--theme-gradient-from) 5%, transparent), color-mix(in srgb, var(--theme-background) 10%, transparent))`;
				}}
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
							<GeneratedIcon
								name={script.name}
								className="h-16 w-16 border border-white/10 group-hover:border-white/20"
							/>
						)}
						<div className="flex flex-col gap-1 flex-1 min-w-0">
							<h2 className="text-xl sm:text-2xl text-white font-medium truncate">
								{script.name}
							</h2>
							<p className="text-xs text-neutral-400 line-clamp-2 wrap-break-word">
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
								<span
									className="text-[10px] font-medium text-white rounded px-2 p-0.5 border flex items-center justify-center my-auto gap-1.5 shadow-sm group-hover:shadow-md backdrop-blur-sm"
									style={{
										background: `linear-gradient(to right, color-mix(in srgb, var(--theme-gradient-from) 20%, transparent), color-mix(in srgb, var(--theme-gradient-to) 20%, transparent))`,
										borderColor:
											"color-mix(in srgb, var(--theme-accent) 30%, transparent)",
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.background = `linear-gradient(to right, color-mix(in srgb, var(--theme-gradient-from) 30%, transparent), color-mix(in srgb, var(--theme-gradient-to) 30%, transparent))`;
										e.currentTarget.style.borderColor =
											"color-mix(in srgb, var(--theme-accent) 50%, transparent)";
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.background = `linear-gradient(to right, color-mix(in srgb, var(--theme-gradient-from) 20%, transparent), color-mix(in srgb, var(--theme-gradient-to) 20%, transparent))`;
										e.currentTarget.style.borderColor =
											"color-mix(in srgb, var(--theme-accent) 30%, transparent)";
									}}
								>
									<BadgeCheck
										className="inline h-3 w-3 drop-shadow-sm"
										style={{ color: "var(--theme-accent)" }}
									/>
									<span
										className="bg-linear-to-r bg-clip-text text-transparent font-semibold"
										style={{
											backgroundImage: `linear-gradient(to right, var(--theme-gradient-from), var(--theme-gradient-to))`,
										}}
									>
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
