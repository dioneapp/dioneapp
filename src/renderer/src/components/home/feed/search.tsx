import Icon from "@renderer/components/icons/icon";
import { useState } from "react";
import ScriptList from "../feed";
import { useTranslation } from "../../../translations/translationContext";

export default function SearchBar() {
	const { t } = useTranslation();
	const [search, setSearch] = useState("");
	const [type, setType] = useState("");

	function handleType(name: string) {
		if (type === name) {
			setType("");
			return;
		}
		setType(name);
		console.log("setting type to", name);
	}

	return (
		<div className="h-full min-h-screen">
			<div className="w-full h-full space-y-4 mb-4">
				<div className="relative">
					<input
						type="text"
						onChange={(e) => setSearch(e.target.value)}
						placeholder={t("search.placeholder")}
						className="w-full h-10 text-sm text-white 
                        bg-gradient-to-r from-[#BCB1E7]/5 to-[#080808]/10
                        border border-white/5 hover:border-white/20 rounded-lg pl-4 pr-4 transition-colors duration-200 hover:shadow-lg
                        placeholder:text-neutral-400 
                        focus:outline-none focus:border-white/20
                        active:border-white/20 active:outline-none"
					/>
					<Icon
						name="Search"
						className="absolute right-1.5 bottom-1.5 w-5 h-5 pointer-events-none"
					/>
				</div>
				<div className="flex gap-4 h-8">
					<button
						onClick={() => handleType("audio")}
						type="button"
						className={`w-full h-full rounded-full border border-white/5 text-xs text-neutral-300 flex gap-1 items-center justify-center hover:border-white/20 hover:shadow-lg cursor-pointer transition-all duration-300 ${type === "audio" ? "bg-white/5" : ""}`}
					>
						<Icon name="Audio" className="w-4 h-4" />
						{t("search.filters.audio")}
					</button>
					<button
						onClick={() => handleType("image")}
						type="button"
						className={`w-full h-full rounded-full border border-white/5 text-xs text-neutral-300 flex gap-1 items-center justify-center hover:border-white/20 hover:shadow-lg cursor-pointer transition-all duration-300 ${type === "image" ? "bg-white/5" : ""}`}
					>
						<Icon name="Image" className="w-4 h-4" />
						{t("search.filters.image")}
					</button>
					<button
						onClick={() => handleType("video")}
						type="button"
						className={`w-full h-full rounded-full border border-white/5 text-xs text-neutral-300 flex gap-1 items-center justify-center hover:border-white/20 hover:shadow-lg cursor-pointer transition-all duration-300 ${type === "video" ? "bg-white/5" : ""}`}
					>
						<Icon name="Video" className="w-4 h-4" />
						{t("search.filters.video")}
					</button>
					<button
						onClick={() => handleType("chat")}
						type="button"
						className={`w-full h-full rounded-full border border-white/5 text-xs text-neutral-300 flex gap-1 items-center justify-center hover:border-white/20 hover:shadow-lg cursor-pointer transition-all duration-300 ${type === "chat" ? "bg-white/5" : ""}`}
					>
						<Icon name="Chat" className="w-4 h-4" />
						{t("search.filters.chat")}
					</button>
				</div>
			</div>
			{search.length === 0 && !type && (
				<ScriptList endpoint="/db/explore" type="explore" />
			)}
			{search.length > 0 && !type && (
				<ScriptList endpoint={`/searchbar/name/${search}`} type="search_name" />
			)}
			{search.length === 0 && type && (
				<ScriptList endpoint={`/db/search/type/${type}`} type="search_type" />
			)}
			{search.length > 0 && type && (
				<ScriptList
					endpoint={`/searchbar/type/${search}/${type}`}
					type="search_name_type"
				/>
			)}
		</div>
	);
}
