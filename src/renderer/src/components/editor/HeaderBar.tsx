import {
	ArrowLeft,
	ExternalLink,
	Loader2,
	Pencil,
	RefreshCcw,
	Save,
} from "lucide-react";
import type { FileNode } from "./utils/types";

interface HeaderBarProps {
	rootPath: string;
	activeNode: FileNode | undefined;
	selectedFileNode: FileNode | undefined;
	isDirty: boolean;
	isSaving: boolean;
	isLoadingTree: boolean;
	onBack: () => void;
	onOpenInExplorer: () => void;
	onRefreshWorkspace: () => void;
	onRename: () => void;
	onReloadFile: () => void;
	onSaveFile: () => void;
}

const baseButtonClass =
	"inline-flex h-7 px-2 gap-1.5 items-center justify-center rounded-lg border border-white/10 bg-white/2 text-neutral-300 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50 cursor-pointer";
const primaryButtonClass =
	"flex items-center h-7 gap-1.5 px-4 py-2 bg-white hover:bg-white/80 cursor-pointer text-black font-semibold rounded-lg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-50";

const HeaderBar = ({
	rootPath,
	activeNode,
	selectedFileNode,
	isDirty,
	isSaving,
	isLoadingTree,
	onBack,
	onOpenInExplorer,
	onRefreshWorkspace,
	onRename,
	onReloadFile,
	onSaveFile,
}: HeaderBarProps) => {
	return (
		<div
			className="mt-12 flex w-full items-center gap-3 border-y border-white/10 bg-neutral-950/75 py-3 px-4 text-xs text-neutral-300 shadow-lg backdrop-blur"
		>
			<button type="button" onClick={onBack} className={baseButtonClass}>
				<ArrowLeft className="h-3.5 w-3.5" />
				<span>Back</span>
			</button>
			<div className="flex w-full items-center justify-end gap-2">
				<button
					type="button"
					onClick={onSaveFile}
					disabled={
						!isDirty ||
						isSaving ||
						!selectedFileNode ||
						selectedFileNode.type !== "file"
					}
					className={primaryButtonClass}
				>
					{isSaving ? (
						<Loader2 className="h-3.5 w-3.5 animate-spin" />
					) : (
						<Save className="h-3.5 w-3.5" />
					)}
					<span>Save</span>
				</button>
				<button
					type="button"
					onClick={onReloadFile}
					disabled={!selectedFileNode || selectedFileNode.type !== "file"}
					className={baseButtonClass}
				>
					<RefreshCcw className="h-3.5 w-3.5" />
					<span>Reload file</span>
				</button>
				<button
					type="button"
					onClick={onRename}
					disabled={!activeNode || activeNode.relativePath === ""}
					className={baseButtonClass}
				>
					<Pencil className="h-3.5 w-3.5" />
					<span>Rename</span>
				</button>
				<button
					type="button"
					onClick={onRefreshWorkspace}
					disabled={isLoadingTree}
					className={baseButtonClass}
					title="Refresh workspace"
				>
					{isLoadingTree ? (
						<Loader2 className="h-3.5 w-3.5 animate-spin" />
					) : (
						<RefreshCcw className="h-3.5 w-3.5" />
					)}
				</button>
				<button
					type="button"
					onClick={onOpenInExplorer}
					disabled={!rootPath}
					className={baseButtonClass}
					title="Open in explorer"
				>
					<ExternalLink className="h-3.5 w-3.5" />
				</button>
			</div>
		</div>
	);
};

export default HeaderBar;
