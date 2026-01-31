import ScriptList from "@/components/features/home/feed/feed";
import { Button, InputWithIcon, Select } from "@/components/ui";
import { useTranslation } from "@/translations/translation-context";
import { Image, MessageCircle, Search, Video, Volume2 } from "lucide-react";
import { useState } from "react";

export default function SearchBar() {
	const { t } = useTranslation();
	const [search, setSearch] = useState("");
	const [type, setType] = useState("");
	const [sort, setSort] = useState("created_at");

	function handleType(name: string) {
		if (type === name) {
			setType("");
			return;
		}
		setType(name);
	}

	const orderType = sort === "name" ? "asc" : "desc";

	return (
		<div className="h-full min-h-screen">
			<div className="w-full h-full space-y-4 mb-4">
				<div className="flex gap-3">
					<InputWithIcon
						type="text"
						onChange={(e) => setSearch(e.target.value)}
						placeholder={t("search.placeholder")}
						icon={<Search className="w-5 h-5" />}
						iconPosition="right"
						className="h-10 text-sm bg-black/30 flex-1"
					/>
					<Select
						value={sort}
						onChange={setSort}
						options={[
							{ value: "created_at", label: t("search.sort.latest") },
							{ value: "downloads", label: t("search.sort.downloads") },
							{ value: "version", label: t("search.sort.last_updated") },
							{ value: "name", label: t("search.sort.atoz") },
						]}
						width="w-40"
						showCheckmark={false}
					/>
				</div>
				<div className="flex gap-3">
					<Button
						onClick={() => handleType("audio")}
						variant="outline"
						size="sm"
						accentColor={type === "audio"}
						className="flex-1"
					>
						<Volume2 className="w-4 h-4" />
						{t("search.filters.audio")}
					</Button>
					<Button
						onClick={() => handleType("image")}
						variant="outline"
						size="sm"
						accentColor={type === "image"}
						className="flex-1"
					>
						<Image className="w-4 h-4" />
						{t("search.filters.image")}
					</Button>
					<Button
						onClick={() => handleType("video")}
						variant="outline"
						size="sm"
						accentColor={type === "video"}
						className="flex-1"
					>
						<Video className="w-4 h-4" />
						{t("search.filters.video")}
					</Button>
					<Button
						onClick={() => handleType("chat")}
						variant="outline"
						size="sm"
						accentColor={type === "chat"}
						className="flex-1"
					>
						<MessageCircle className="w-4 h-4" />
						{t("search.filters.chat")}
					</Button>
				</div>
			</div>
			{search.length === 0 && !type && (
				<ScriptList
					key={`explore-${sort}`}
					endpoint={`/db/explore?order_by=${sort}&order_type=${orderType}`}
					type="explore"
				/>
			)}
			{search.length > 0 && !type && (
				<ScriptList
					key={`search-${search}-${sort}`}
					endpoint={`/searchbar/name/${search}?order_by=${sort}&order_type=${orderType}`}
					type="search_name"
				/>
			)}
			{search.length === 0 && type && (
				<ScriptList
					key={`type-${type}-${sort}`}
					endpoint={`/db/search/type/${type}?order_by=${sort}&order_type=${orderType}`}
					type="search_type"
				/>
			)}
			{search.length > 0 && type && (
				<ScriptList
					key={`search-type-${search}-${type}-${sort}`}
					endpoint={`/searchbar/type/${search}/${type}?order_by=${sort}&order_type=${orderType}`}
					type="search_name_type"
				/>
			)}
		</div>
	);
}
