import { Button } from "@/components/ui";
import ScriptCard from "@/components/features/home/feed/card";
import type { Script } from "@/components/features/home/feed/types";
import UploadModal from "@/components/features/modals/upload-script";
import { useTranslation } from "@/translations/translation-context";
import { apiFetch, apiJson } from "@/utils/api";
import { useToast } from "@/utils/use-toast";
import { useEffect, useState } from "react";
import { useScriptsContext } from "@/components/contexts/scripts-context";

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
				<Button
					variant="secondary"
					size="md"
					onClick={() => setOpenModal(true)}
					className="whitespace-nowrap"
				>
					{t("local.upload")}
				</Button>
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
