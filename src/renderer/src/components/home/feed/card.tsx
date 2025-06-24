import { memo } from "react";
import { Link } from "react-router-dom";
import type { Script } from "./types";

interface ScriptCardProps {
	script: Script;
	innerRef?: React.Ref<HTMLDivElement>;
}

function ScriptCard({ script, innerRef }: ScriptCardProps) {
	const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
		e.currentTarget.src = "/svgs/Profile.svg";
	};

	return (
		<div ref={innerRef}>
		<Link
			to={`/install/${script.id}`}
			className="group flex gap-4 h-auto min-h-[120px] border border-white/10 hover:border-white/20 
                bg-gradient-to-r from-[#BCB1E7]/5 to-[#080808]/10 rounded-lg p-4 transition-all duration-200 hover:shadow-lg items-center"
		>
			{script.logo_url?.startsWith("http") ? (
				<img
					src={script.logo_url}
					onError={handleImageError}
					alt={`${script.name} icon`}
					className="h-16 w-16 rounded-xl border border-white/10 object-cover 
                 object-center group-hover:border-white/20 transition-all duration-200"
				/>
			) : (
				<div
					style={{
						backgroundImage: script.logo_url,
						backgroundSize: "100%",
						backgroundRepeat: "no-repeat",
						backgroundPosition: "center",
					}}
					className="h-16 w-16 rounded-xl border border-white/10 backdrop-blur-3xl bg-cover bg-center 
                 group-hover:border-white/20 transition-all duration-200"
				/>
			)}
			<div className="flex flex-col gap-1 flex-1 min-w-0">
				<h2 className="text-xl sm:text-2xl text-white font-medium truncate">
					{script.name}
				</h2>
				<p className="text-xs text-neutral-400 line-clamp-2 break-words">
					{script.description}
				</p>
			</div>
		</Link>
		</div>
	);
}

export default memo(ScriptCard);
