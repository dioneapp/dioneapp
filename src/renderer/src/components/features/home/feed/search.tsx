import ScriptList from "@/components/features/home/feed/feed";
import { Button, InputWithIcon } from "@/components/ui";
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
				<InputWithIcon
					type="text"
					onChange={(e) => setSearch(e.target.value)}
					placeholder={t("search.placeholder")}
					icon={<Search className="w-5 h-5" />}
					iconPosition="right"
					className="h-10 text-sm bg-black/30"
				/>
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
