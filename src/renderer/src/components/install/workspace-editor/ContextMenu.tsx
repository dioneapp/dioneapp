import { Copy, ExternalLink, Pencil, RefreshCcw } from "lucide-react";
import type { MouseEvent } from "react";
import type { ContextMenuState } from "./types";

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

	return (
		<div
			className="fixed z-50 rounded-md border border-white/10 bg-neutral-900/95 p-2 text-sm text-neutral-200 shadow-lg"
			style={{ left: state.x, top: state.y, minWidth: 160 }}
			onClick={(event) => event.stopPropagation()}
		>
			<button
				type="button"
				className="flex w-full items-center gap-2 rounded px-2 py-1 text-left hover:bg-white/5"
				onClick={(event) => handleClick(event, onCopyPath)}
			>
				<Copy className="h-4 w-4" />
				<span>Copy path</span>
			</button>
			{isDirectory ? (
				<button
					type="button"
					className="flex w-full items-center gap-2 rounded px-2 py-1 text-left hover:bg-white/5"
					onClick={(event) => handleClick(event, onOpenFolder)}
				>
					<ExternalLink className="h-4 w-4" />
					<span>Open</span>
				</button>
			) : (
				<button
					type="button"
					className="flex w-full items-center gap-2 rounded px-2 py-1 text-left hover:bg-white/5"
					onClick={(event) => handleClick(event, onReloadFile)}
				>
					<RefreshCcw className="h-4 w-4" />
					<span>Reload</span>
				</button>
			)}
			<button
				type="button"
				className="flex w-full items-center gap-2 rounded px-2 py-1 text-left hover:bg-white/5"
				onClick={(event) => handleClick(event, onRename)}
			>
				<Pencil className="h-4 w-4" />
				<span>Rename</span>
			</button>
			<button
				type="button"
				className="flex w-full items-center gap-2 rounded px-2 py-1 text-left text-rose-400 hover:bg-white/5"
				onClick={(event) => handleClick(event, onDelete)}
			>
				<span className="h-4 w-4" />
				<span>Delete</span>
			</button>
		</div>
	);
};

export default ContextMenu;
