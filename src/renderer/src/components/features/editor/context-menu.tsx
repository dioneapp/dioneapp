import type { ContextMenuState } from "@/components/features/editor/utils/types";
import { Button } from "@/components/ui";
import { useTranslation } from "@/translations/translation-context";
import { Copy, ExternalLink, Pencil, RefreshCcw } from "lucide-react";
import type { MouseEvent } from "react";
import { createPortal } from "react-dom";

interface ContextMenuProps {
	state: ContextMenuState;
	onCopyPath: () => void;
	onOpenFolder: () => void;
	onReloadFile: () => void;
	onRename: () => void;
	onDelete: () => void;
	onClose: () => void;
}

const ContextMenu = ({
	state,
	onCopyPath,
	onOpenFolder,
	onReloadFile,
	onRename,
	onDelete,
	onClose,
}: ContextMenuProps) => {
	const { t } = useTranslation();

	if (!state.visible || !state.node) return null;

	const handleClick = (
		event: MouseEvent<HTMLButtonElement>,
		action: () => void,
	) => {
		event.stopPropagation();
		action();
		onClose();
	};

	const isDirectory = state.node.type === "directory";

	const menu = (
		<div
			className="fixed z-50 rounded-xl border border-white/10 bg-neutral-900/95 p-2 text-sm text-neutral-200 shadow-lg"
			onClick={(event) => event.stopPropagation()}
			style={{
				top: state.y,
				left: state.x,
				minWidth: 160,
			}}
		>
			<Button
				variant="ghost"
				size="sm"
				className="w-full justify-start gap-2"
				onClick={(event) => handleClick(event, onCopyPath)}
			>
				<Copy className="h-4 w-4" />
				<span>{t("contextMenu.copyPath")}</span>
			</Button>

			{isDirectory ? (
				<Button
					variant="ghost"
					size="sm"
					className="w-full justify-start gap-2"
					onClick={(event) => handleClick(event, onOpenFolder)}
				>
					<ExternalLink className="h-4 w-4" />
					<span>{t("contextMenu.open")}</span>
				</Button>
			) : (
				<Button
					variant="ghost"
					size="sm"
					className="w-full justify-start gap-2"
					onClick={(event) => handleClick(event, onReloadFile)}
				>
					<RefreshCcw className="h-4 w-4" />
					<span>{t("contextMenu.reload")}</span>
				</Button>
			)}

			<Button
				variant="ghost"
				size="sm"
				className="w-full justify-start gap-2"
				onClick={(event) => handleClick(event, onRename)}
			>
				<Pencil className="h-4 w-4" />
				<span>{t("contextMenu.rename")}</span>
			</Button>

			<Button
				variant="ghost"
				size="sm"
				className="w-full justify-start gap-2 text-rose-400"
				onClick={(event) => handleClick(event, onDelete)}
			>
				<span>{t("contextMenu.delete")}</span>
			</Button>
		</div>
	);

	return createPortal(menu, document.body);
};

export default ContextMenu;
