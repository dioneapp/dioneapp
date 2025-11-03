import {
	ArrowLeft,
	ExternalLink,
	Loader2,
	Pencil,
	RefreshCcw,
	Save,
} from "lucide-react";
import type { FileNode } from "./types";

interface HeaderBarProps {
	workspaceName: string;
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
	"inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-neutral-200 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50 disabled:cursor-not-allowed disabled:opacity-40";
const primaryButtonClass =
	"inline-flex items-center gap-1.5 rounded-md border border-indigo-400/40 bg-indigo-500/20 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-500/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-50";

const HeaderBar = ({
	workspaceName,
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
		<div className="flex flex-wrap items-center gap-3 rounded-lg border border-white/10 bg-neutral-950/75 px-4 py-3 text-xs text-neutral-300 shadow-lg backdrop-blur">
			<button type="button" onClick={onBack} className={baseButtonClass}>
				<ArrowLeft className="h-3.5 w-3.5" />
				<span>Back</span>
			</button>
			<div className="flex min-w-0 flex-1 items-center gap-2 text-[11px]">
				<span className="truncate font-semibold text-neutral-100">
					{workspaceName}
				</span>
				<span className="hidden text-neutral-500 sm:inline">•</span>
				<span
					className="hidden min-w-0 truncate text-neutral-400 sm:inline"
					title={rootPath}
				>
					{rootPath || "Resolving workspace..."}
				</span>
				{activeNode && (
					<>
						<span className="hidden text-neutral-500 sm:inline">•</span>
						<span
							className="hidden min-w-0 truncate text-neutral-400 sm:inline"
							title={activeNode.absolutePath}
						>
							Selected: {activeNode.relativePath || "(root)"}
						</span>
					</>
				)}
				{selectedFileNode && selectedFileNode.type === "file" && (
					<>
						<span className="text-neutral-500">•</span>
						<span
							className="min-w-0 truncate text-neutral-200"
							title={selectedFileNode.absolutePath}
						>
							Editing: {selectedFileNode.relativePath}
						</span>
					</>
				)}
			</div>
			{isDirty && (
				<span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-1 text-[11px] font-medium text-amber-300">
					<Save className="h-3 w-3" />
					<span>Unsaved</span>
				</span>
			)}
			<div className="flex flex-wrap items-center gap-2">
				<button
					type="button"
					onClick={onOpenInExplorer}
					disabled={!rootPath}
					className={baseButtonClass}
				>
					<ExternalLink className="h-3.5 w-3.5" />
					<span>Open</span>
				</button>
				<button
					type="button"
					onClick={onRefreshWorkspace}
					disabled={isLoadingTree}
					className={baseButtonClass}
				>
					{isLoadingTree ? (
						<Loader2 className="h-3.5 w-3.5 animate-spin" />
					) : (
						<RefreshCcw className="h-3.5 w-3.5" />
					)}
					<span>Refresh</span>
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
					onClick={onReloadFile}
					disabled={!selectedFileNode || selectedFileNode.type !== "file"}
					className={baseButtonClass}
				>
					<RefreshCcw className="h-3.5 w-3.5" />
					<span>Reload file</span>
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
					className={primaryButtonClass}
				>
					{isSaving ? (
						<Loader2 className="h-3.5 w-3.5 animate-spin" />
					) : (
						<Save className="h-3.5 w-3.5" />
					)}
					<span>Save</span>
				</button>
			</div>
		</div>
	);
};

export default HeaderBar;
