import { useState } from "react";
import ScriptList from "../feed";
import Icon from "@renderer/components/icons/icon";

export default function SearchBar() {
	const [search, setSearch] = useState("");

	return (
		<>
			<div className="w-full space-y-4 mb-4">
				<div className="relative">
					<input
						type="text"
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search scripts..."
						className="w-full h-10 text-sm text-white 
                        bg-gradient-to-r from-[#BCB1E7]/5 to-[#080808]/10
                        border border-white/10 hover:border-white/20 rounded-lg pl-4 pr-4 transition-colors duration-200 hover:shadow-lg
                        placeholder:text-neutral-400 
                        focus:outline-none focus:border-white/20
                        active:border-white/20 active:outline-none"
					/>
					<Icon
						name="Search"
						className="absolute right-1.5 bottom-1.5 w-5 h-5 pointer-events-none"
					/>
				</div>
			</div>
			{search.length === 0 ? (
				<ScriptList endpoint="/explore" type="explore" />
			) : (
				<ScriptList endpoint={`/searchbar/${search}`} type="search" />
			)}
		</>
	);
}
