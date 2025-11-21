import { apiFetch, apiJson } from "@renderer/utils/api";
import { useEffect, useState } from "react";
import { useTranslation } from "../../translations/translation-context";
import { useToast } from "../../utils/use-toast";
import { useScriptsContext } from "../contexts/ScriptsContext";
import ScriptCard from "../home/feed/card";
import type { Script } from "../home/feed/types";
import UploadModal from "../modals/upload-script";

export default function LocalScripts() {
	const { t } = useTranslation();
	const { addToast } = useToast();
	const { handleReloadQuickLaunch } = useScriptsContext();
	const [openModal, setOpenModal] = useState(false);
	const [scripts, setScripts] = useState<
		{
			id: string;
			name: string;
			description: string;
		}[]
	>([]);

	const fetchScripts = async () => {
		const data = (await apiJson<Script[]>("/local/")).map((script) => ({
			...script,
			isLocal: true,
		}));
		setScripts(data);
	};

	useEffect(() => {
		fetchScripts();
	}, []);

	const onCloseModal = () => {
		fetchScripts();
		setOpenModal(false);
	};

	const deleteScript = async (name: string) => {
		addToast({
			variant: "default",
			children: t("local.deleting"),
			fixed: "true",
		});

		await apiFetch(`/local/delete/${encodeURIComponent(name)}`, {
			method: "DELETE",
		});
		fetchScripts();
		handleReloadQuickLaunch();
	};

	return (
		<div className="mt-4">
			{openModal && <UploadModal onClose={onCloseModal} />}
			<div className="w-full justify-between flex mb-8">
				<h1 className="text-2xl sm:text-3xl font-semibold">
					{t("local.title")}
				</h1>
				<button
					onClick={() => setOpenModal(true)}
					type="button"
					className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 text-sm font-medium whitespace-nowrap cursor-pointer"
				>
					{t("local.upload")}
				</button>
			</div>
			<div className="flex flex-col gap-4">
				{scripts.length === 0 ||
				scripts.length === undefined ||
				!scripts ||
				scripts === undefined ? (
					<p className="text-center text-neutral-400 text-sm">
						{t("local.noScripts")}
					</p>
				) : (
					scripts.map((script) => (
						<ScriptCard
							key={script.id}
							script={script as Script}
							deleteScript={deleteScript}
						/>
					))
				)}
			</div>
		</div>
	);
}
