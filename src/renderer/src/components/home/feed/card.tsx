import { Trash } from "lucide-react";
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
		e.currentTarget.src = "/svgs/Profile.svg";
	};

	return (
		<div ref={innerRef}>
			<Link
				to={{
					pathname: `/install/${script.isLocal ? encodeURIComponent(script.name) : script.id}`,
					search: `?isLocal=${script.isLocal}`,
				}}
				className="group flex gap-4 h-auto min-h-[120px] border border-white/10 hover:border-white/20 
                bg-gradient-to-r from-[#BCB1E7]/5 to-[#080808]/10 rounded-lg p-4 transition-all duration-200 hover:shadow-lg items-center relative"
			>
				{script.logo_url?.startsWith("http") ? (
					<img
						src={script.logo_url}
						onError={handleImageError}
						alt={`${script.name} icon`}
						className="h-16 w-16 rounded-xl border border-white/10 object-cover 
                 object-center group-hover:border-white/20 transition-all duration-200 bg-neutral-800/50"
					/>
				) : (
					<>
						{!script.isLocal && (
							<div
								style={{
									backgroundImage:
										script?.logo_url ||
										"linear-gradient(to right, #BCB1E7, #9A8FD1)",
									backgroundSize: "100%",
									backgroundRepeat: "no-repeat",
									backgroundPosition: "center",
								}}
								className="h-16 w-16 rounded-xl border border-white/10 backdrop-blur-3xl bg-cover bg-center 
                 group-hover:border-white/20 transition-all duration-200"
							/>
						)}
					</>
				)}
				{!script.logo_url && script.isLocal && (
					<div
						className="h-16 w-16 rounded-xl border border-white/10 backdrop-blur-3xl bg-cover bg-center 
                 group-hover:border-white/20 transition-all duration-200 items-center justify-center flex bg-neutral-900"
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
			</Link>
		</div>
	);
}

export default memo(ScriptCard);
