import type { Script } from "@/components/home/feed/types";
import GeneratedIcon from "@/components/icons/generated-icon";
import { useOnlineStatus } from "@/utils/use-online-status";
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
import logo from "../../../assets/logo.png";

interface ScriptCardProps {
	script: Script;
	innerRef?: React.Ref<HTMLDivElement>;
	deleteScript?: (name: string) => void;
	disabled?: boolean;
}

function ScriptCard({
	script,
	innerRef,
	deleteScript,
	disabled = false,
}: ScriptCardProps) {
	const isOnline = useOnlineStatus();

	const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
		e.currentTarget.src = logo;
	};

	const handleClick = (e: React.MouseEvent) => {
		if (disabled) {
			e.preventDefault();
		}
	};

	return (
		<div ref={innerRef}>
			<Link
				to={{
					pathname: `/install/${script.isLocal ? encodeURIComponent(script.name) : script.id}`,
					search: `?isLocal=${script.isLocal}`,
				}}
				onClick={handleClick}
				className={`group flex flex-col justify-between gap-4 h-full border border-white/10 hover:border-white/20 transition-all duration-300 rounded-xl p-4 hover:shadow-xl relative overflow-hidden ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
				style={{
					background:
						"linear-gradient(135deg, color-mix(in srgb, var(--theme-gradient-from) 8%, transparent), color-mix(in srgb, var(--theme-background) 50%, transparent), color-mix(in srgb, var(--theme-background) 80%, transparent))",
				}}
			>
				<div
					className="absolute -top-12 -right-12 w-32 h-32 rounded-xl blur-3xl pointer-events-none transition-opacity duration-150 opacity-0 group-hover:opacity-100"
					style={{
						backgroundColor:
							"color-mix(in srgb, var(--theme-accent) 15%, transparent)",
					}}
				/>
				<div
					className="absolute -bottom-8 -left-8 w-24 h-24 rounded-xl blur-2xl pointer-events-none"
					style={{
						backgroundColor:
							"color-mix(in srgb, var(--theme-accent) 8%, transparent)",
					}}
				/>

				<div className="w-full flex relative z-10">
					<div className="flex items-center gap-4">
						{script.logo_url?.startsWith("http") && isOnline ? (
							<img
								src={script.logo_url}
								onError={handleImageError}
								alt={`${script.name} icon`}
								className="h-16 w-16 rounded-xl border border-white/10 object-cover object-center group-hover:border-white/20 bg-neutral-800/50 shadow-lg transition-all duration-300 group-hover:shadow-xl"
							/>
						) : (
							<GeneratedIcon
								name={script.name}
								className="h-16 w-16 border border-white/10 group-hover:border-white/20 shadow-lg transition-all duration-300 group-hover:shadow-xl"
							/>
						)}
						<div className="flex flex-col gap-1.5 flex-1 min-w-0">
							<div className="flex items-center gap-1.5">
								<h2 className="text-xl sm:text-2xl text-white font-semibold tracking-tight truncate">
									{script.name}
								</h2>
								{script.official && (
									<BadgeCheck
										className="h-5 w-5 shrink-0"
										style={{ color: "var(--theme-accent)" }}
									/>
								)}
							</div>
							<p className="text-xs text-neutral-300 line-clamp-2 wrap-break-word leading-relaxed">
								{script.description}
							</p>
						</div>
					</div>
					{deleteScript && (
						<div className="absolute right-4 top-4 z-20">
							<button
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation(); // prevents redirect
									deleteScript(script.name);
								}}
								type="button"
								className="opacity-0 group-hover:opacity-100 cursor-pointer hover:bg-red-500/20 bg-white/5 border border-white/10 hover:border-red-500/30 rounded-xl p-2 transition-all duration-300 text-neutral-400 hover:text-red-400"
							>
								<Trash className="h-3.5 w-3.5" />
							</button>
						</div>
					)}
				</div>
				{!script.isLocal && (
					<div className="flex items-center w-full relative z-10">
						<div className="flex items-center gap-2 flex-1 flex-wrap">
							{script.created_at && (
								<span className="text-[10px] text-neutral-400 bg-white/5 rounded-xl px-2.5 py-1 border border-white/10 flex items-center justify-center my-auto gap-1 transition-all duration-300">
									<Calendar className="inline h-3 w-3" />
									{new Date(script.created_at).toLocaleDateString()}
								</span>
							)}
							{script.downloads !== 0 && script.downloads && (
								<span className="text-[10px] text-neutral-400 bg-white/5 rounded-xl px-2.5 py-1 border border-white/10 flex items-center justify-center my-auto gap-1 transition-all duration-300">
									<Download className="inline h-3 w-3" />
									{script.downloads.toLocaleString()}
								</span>
							)}
							{script.tags && (
								<span className="text-[10px] text-neutral-400 bg-white/5 rounded-xl px-2.5 py-1 border border-white/10 flex items-center justify-center my-auto gap-1 transition-all duration-300">
									<Tag className="inline h-3 w-3" />
									<span className="capitalize">{script.tags}</span>
								</span>
							)}
							{script.version && (
								<span className="text-[10px] text-neutral-400 bg-white/5 rounded-xl px-2.5 py-1 border border-white/10 flex items-center justify-center my-auto gap-1 transition-all duration-300">
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
