import ScriptList from "@/components/home/feed/feed";
import { useTranslation } from "@/translations/translation-context";
import { Image, MessageCircle, Search, Video, Volume2 } from "lucide-react";
import { useState } from "react";

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
                        border border-white/5 hover:border-white/20 rounded-lg px-4 pr-10 hover:shadow-lg
                        placeholder:text-neutral-400 
                        focus:outline-none focus:border-white/20
                        active:border-white/20 active:outline-none"
						style={{
							background:
								"linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 5%, transparent), color-mix(in srgb, var(--theme-background) 10%, transparent))",
						}}
					/>
					<Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none text-neutral-400" />
				</div>
				<div className="flex gap-3">
					<button
						onClick={() => handleType("audio")}
						type="button"
						className={`flex-1 px-6 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
							type === "audio"
								? "border shadow-lg"
								: "border border-white/10 text-neutral-400"
						}`}
						style={
							type === "audio"
								? {
										background:
											"linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 20%, transparent), color-mix(in srgb, var(--theme-accent) 10%, transparent))",
										borderColor:
											"color-mix(in srgb, var(--theme-accent) 30%, transparent)",
										color: "var(--theme-accent)",
									}
								: {}
						}
						onMouseEnter={(e) => {
							if (type !== "audio") {
								e.currentTarget.style.background =
									"linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 10%, transparent), color-mix(in srgb, var(--theme-accent) 5%, transparent))";
								e.currentTarget.style.borderColor =
									"color-mix(in srgb, var(--theme-accent) 20%, transparent)";
								e.currentTarget.style.color = "var(--theme-accent)";
							}
						}}
						onMouseLeave={(e) => {
							if (type !== "audio") {
								e.currentTarget.style.background = "";
								e.currentTarget.style.borderColor = "";
								e.currentTarget.style.color = "";
							}
						}}
					>
						<div className="flex items-center gap-2 justify-center">
							<Volume2 className="w-4 h-4" />
							{t("search.filters.audio")}
						</div>
					</button>
					<button
						onClick={() => handleType("image")}
						type="button"
						className={`flex-1 px-6 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
							type === "image"
								? "border shadow-lg"
								: "border border-white/10 text-neutral-400"
						}`}
						style={
							type === "image"
								? {
										background:
											"linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 20%, transparent), color-mix(in srgb, var(--theme-accent) 10%, transparent))",
										borderColor:
											"color-mix(in srgb, var(--theme-accent) 30%, transparent)",
										color: "var(--theme-accent)",
									}
								: {}
						}
						onMouseEnter={(e) => {
							if (type !== "image") {
								e.currentTarget.style.background =
									"linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 10%, transparent), color-mix(in srgb, var(--theme-accent) 5%, transparent))";
								e.currentTarget.style.borderColor =
									"color-mix(in srgb, var(--theme-accent) 20%, transparent)";
								e.currentTarget.style.color = "var(--theme-accent)";
							}
						}}
						onMouseLeave={(e) => {
							if (type !== "image") {
								e.currentTarget.style.background = "";
								e.currentTarget.style.borderColor = "";
								e.currentTarget.style.color = "";
							}
						}}
					>
						<div className="flex items-center gap-2 justify-center">
							<Image className="w-4 h-4" />
							{t("search.filters.image")}
						</div>
					</button>
					<button
						onClick={() => handleType("video")}
						type="button"
						className={`flex-1 px-6 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
							type === "video"
								? "border shadow-lg"
								: "border border-white/10 text-neutral-400"
						}`}
						style={
							type === "video"
								? {
										background:
											"linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 20%, transparent), color-mix(in srgb, var(--theme-accent) 10%, transparent))",
										borderColor:
											"color-mix(in srgb, var(--theme-accent) 30%, transparent)",
										color: "var(--theme-accent)",
									}
								: {}
						}
						onMouseEnter={(e) => {
							if (type !== "video") {
								e.currentTarget.style.background =
									"linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 10%, transparent), color-mix(in srgb, var(--theme-accent) 5%, transparent))";
								e.currentTarget.style.borderColor =
									"color-mix(in srgb, var(--theme-accent) 20%, transparent)";
								e.currentTarget.style.color = "var(--theme-accent)";
							}
						}}
						onMouseLeave={(e) => {
							if (type !== "video") {
								e.currentTarget.style.background = "";
								e.currentTarget.style.borderColor = "";
								e.currentTarget.style.color = "";
							}
						}}
					>
						<div className="flex items-center gap-2 justify-center">
							<Video className="w-4 h-4" />
							{t("search.filters.video")}
						</div>
					</button>
					<button
						onClick={() => handleType("chat")}
						type="button"
						className={`flex-1 px-6 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
							type === "chat"
								? "border shadow-lg"
								: "border border-white/10 text-neutral-400"
						}`}
						style={
							type === "chat"
								? {
										background:
											"linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 20%, transparent), color-mix(in srgb, var(--theme-accent) 10%, transparent))",
										borderColor:
											"color-mix(in srgb, var(--theme-accent) 30%, transparent)",
										color: "var(--theme-accent)",
									}
								: {}
						}
						onMouseEnter={(e) => {
							if (type !== "chat") {
								e.currentTarget.style.background =
									"linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 10%, transparent), color-mix(in srgb, var(--theme-accent) 5%, transparent))";
								e.currentTarget.style.borderColor =
									"color-mix(in srgb, var(--theme-accent) 20%, transparent)";
								e.currentTarget.style.color = "var(--theme-accent)";
							}
						}}
						onMouseLeave={(e) => {
							if (type !== "chat") {
								e.currentTarget.style.background = "";
								e.currentTarget.style.borderColor = "";
								e.currentTarget.style.color = "";
							}
						}}
					>
						<div className="flex items-center gap-2 justify-center">
							<MessageCircle className="w-4 h-4" />
							{t("search.filters.chat")}
						</div>
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
