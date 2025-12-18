import type { FileNode } from "@/components/editor/utils/types";
import { useTranslation } from "@/translations/translation-context";
import {
	ArrowCounterClockwiseIcon,
	ArrowLeftIcon,
	ArrowSquareOutIcon,
	CircleNotchIcon,
	FloppyDiskIcon,
} from "@phosphor-icons/react";

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
	const { t } = useTranslation();

	return (
		<div className="flex w-full items-center gap-2 border-b border-white/10 bg-neutral-950/75 pt-12 pb-3 px-4 text-xs text-neutral-300 shadow-lg backdrop-blur">
			<div className="flex items-center gap-1">
				<button
					type="button"
					onClick={onBack}
					className="flex items-center justify-center p-1.5 h-full hover:bg-white/10 border border-white/10 transition-colors rounded-md relative group cursor-pointer"
					title={t("headerBar.back")}
				>
					<ArrowLeftIcon weight="bold" className="w-4 h-4" />
					<div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-1 py-0.5 text-[10px] text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
						{t("headerBar.back")}
					</div>
				</button>
				<button
					type="button"
					onClick={onOpenInExplorer}
					disabled={!rootPath}
					className="flex items-center justify-center p-1.5 h-full hover:bg-white/10 border border-white/10 transition-colors rounded-md relative group cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
					title={t("headerBar.openInExplorer")}
				>
					<ArrowSquareOutIcon weight="bold" className="w-4 h-4" />
					<div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-1 py-0.5 text-[10px] text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
						{t("headerBar.openInExplorer")}
					</div>
				</button>
				<button
					type="button"
					onClick={onReloadFile}
					disabled={!selectedFileNode || selectedFileNode.type !== "file"}
					className="flex items-center justify-center p-1.5 h-full hover:bg-white/10 border border-white/10 transition-colors rounded-md relative group cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
					title={t("headerBar.reload")}
				>
					<ArrowCounterClockwiseIcon weight="bold" className="w-4 h-4" />
					<div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-1 py-0.5 text-[10px] text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
						{t("headerBar.reload")}
					</div>
				</button>
			</div>

			<div className="flex gap-1">
				<button
					type="button"
					onClick={onSaveFile}
					disabled={
						!isDirty ||
						isSaving ||
						!selectedFileNode ||
						selectedFileNode.type !== "file"
					}
					className="flex items-center justify-center p-1.5 h-full hover:bg-white/80 bg-white transition-colors rounded-md relative group cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
					title={t("headerBar.save")}
				>
					<div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-1 py-0.5 text-[10px] text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
						{t("headerBar.save")}
					</div>
					{isSaving ? (
						<CircleNotchIcon
							weight="bold"
							className="w-4 h-4 animate-spin text-black"
						/>
					) : (
						<FloppyDiskIcon weight="bold" className="w-4 h-4 text-black" />
					)}
				</button>
			</div>
		</div>
	);
};

export default HeaderBar;
