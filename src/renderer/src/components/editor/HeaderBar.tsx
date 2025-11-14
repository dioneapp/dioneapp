import {
    ArrowLeft,
    ExternalLink,
    Loader2,
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
	"inline-flex h-7 px-2 gap-1.5 items-center justify-center rounded-lg border border-white/10 bg-white/2 text-neutral-300 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50";
const saveButtonClass =
	"inline-flex h-7 px-2 gap-1.5 items-center justify-center rounded-lg bg-white hover:bg-white/80 cursor-pointer text-black font-semibold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-50";

const HeaderBar = ({
	rootPath,
	activeNode: _activeNode,
	selectedFileNode,
	isDirty,
	isSaving,
	isLoadingTree: _isLoadingTree,
	onBack,
	onOpenInExplorer,
	onRefreshWorkspace: _onRefreshWorkspace,
	onRename: _onRename,
	onReloadFile,
	onSaveFile,
}: HeaderBarProps) => {
	return (
		<div className="flex w-full items-center gap-2 border-b border-white/10 bg-neutral-950/75 pt-12 pb-3 px-4 text-xs text-neutral-300 shadow-lg backdrop-blur">
			<button type="button" onClick={onBack} className={baseButtonClass}>
				<ArrowLeft className="h-3.5 w-3.5" />
				<span>Back</span>
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
			<button
				type="button"
				onClick={onReloadFile}
				disabled={!selectedFileNode || selectedFileNode.type !== "file"}
				className={baseButtonClass}
			>
				<RefreshCcw className="h-3.5 w-3.5" />
			</button>
			<button
				type="button"
				onClick={onSaveFile}
				disabled={
					!isDirty ||
					isSaving ||
					!selectedFileNode ||
					selectedFileNode.type !== "file"
				}
				className={saveButtonClass}
			>
				{isSaving ? (
					<Loader2 className="h-3.5 w-3.5 animate-spin" />
				) : (
					<Save className="h-3.5 w-3.5" />
				)}
				<span>Save</span>
			</button>
		</div>
	);
};

export default HeaderBar;
