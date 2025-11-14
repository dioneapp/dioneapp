import { useTranslation } from "@renderer/translations/translationContext";
import { Copy, ExternalLink, Pencil, RefreshCcw } from "lucide-react";
import type { MouseEvent } from "react";
import { createPortal } from "react-dom";
import type { ContextMenuState } from "./utils/types";

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
			<button
				type="button"
				className="flex w-full items-center gap-2 rounded px-2 py-1 text-left hover:bg-white/5 cursor-pointer"
				onClick={(event) => handleClick(event, onCopyPath)}
			>
				<Copy className="h-4 w-4" />
				<span>{t("contextMenu.copyPath")}</span>
			</button>

			{isDirectory ? (
				<button
					type="button"
					className="flex w-full items-center gap-2 rounded px-2 py-1 text-left hover:bg-white/5 cursor-pointer"
					onClick={(event) => handleClick(event, onOpenFolder)}
				>
					<ExternalLink className="h-4 w-4" />
					<span>{t("contextMenu.open")}</span>
				</button>
			) : (
				<button
					type="button"
					className="flex w-full items-center gap-2 rounded px-2 py-1 text-left hover:bg-white/5 cursor-pointer"
					onClick={(event) => handleClick(event, onReloadFile)}
				>
					<RefreshCcw className="h-4 w-4" />
					<span>{t("contextMenu.reload")}</span>
				</button>
			)}

			<button
				type="button"
				className="flex w-full items-center gap-2 rounded px-2 py-1 text-left hover:bg-white/5 cursor-pointer"
				onClick={(event) => handleClick(event, onRename)}
			>
				<Pencil className="h-4 w-4" />
				<span>{t("contextMenu.rename")}</span>
			</button>

			<button
				type="button"
				className="flex w-full items-center gap-2 rounded px-2 py-1 text-left text-rose-400 hover:bg-white/5 cursor-pointer"
				onClick={(event) => handleClick(event, onDelete)}
			>
				<span>{t("contextMenu.delete")}</span>
			</button>
		</div>
	);

	return createPortal(menu, document.body);
};

export default ContextMenu;
