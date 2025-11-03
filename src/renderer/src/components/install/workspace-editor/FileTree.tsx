import {
	ChevronDown,
	ChevronRight,
	FileText,
	Folder,
	Loader2,
} from "lucide-react";
import type { KeyboardEvent, MouseEvent, ReactNode } from "react";
import type { FileNode } from "./types";
import { getFileIconColor } from "./utils";

interface FileTreeProps {
	nodes: FileNode[];
	selectedFile: string | null;
	activePath: string | null;
	isContextMenuVisible: boolean;
	isDirty: boolean;
	onRowClick: (node: FileNode) => void;
	onKeyDown: (event: KeyboardEvent<HTMLDivElement>, node: FileNode) => void;
	onContextMenu: (event: MouseEvent<HTMLDivElement>, node: FileNode) => void;
}

const FileTree = ({
	nodes,
	selectedFile,
	activePath,
	isContextMenuVisible,
	isDirty,
	onRowClick,
	onKeyDown,
	onContextMenu,
}: FileTreeProps) => {
	const renderNodes = (list: FileNode[], depth = 0): ReactNode => {
		if (!list || list.length === 0) {
			if (depth === 0) {
				return (
					<div className="px-3 py-2 text-xs text-neutral-400">
						No files found in this workspace.
					</div>
				);
			}
			return null;
		}

		return list.map((node) => {
			const isSelectedFile = selectedFile === node.relativePath;
			const isActive = activePath === node.relativePath;
			const isDisabled = node.type === "file" && node.isUnsupported;
			const indent = node.isRoot ? 8 : 12 + depth * 16;
			const fileIconColor =
				node.type === "file" ? getFileIconColor(node.name) : undefined;
			const rowClass = `group flex w-full items-center justify-between gap-2 rounded-md px-2 py-1 transition-colors ${
				isDisabled
					? isActive
						? "bg-white/5 text-neutral-400 cursor-not-allowed"
						: "cursor-not-allowed text-neutral-500"
					: isSelectedFile
						? "bg-white/10 text-white cursor-pointer"
						: isActive
							? "bg-white/5 text-neutral-100 hover:bg-white/10 cursor-pointer"
							: "text-neutral-200 hover:bg-white/10 cursor-pointer"
			}`;
			const nameClass = `truncate font-medium ${
				isDisabled
					? "text-neutral-500"
					: isSelectedFile
						? "text-white"
						: "text-neutral-200"
			}`;

			return (
				<div
					key={node.relativePath || node.name}
					className="text-xs text-neutral-200"
				>
					<div
						role="button"
						tabIndex={0}
						onClick={() => onRowClick(node)}
						onContextMenu={(event) => {
							if (isContextMenuVisible) event.stopPropagation();
							onContextMenu(event, node);
						}}
						onKeyDown={(event) => onKeyDown(event, node)}
						className={rowClass}
						style={{ paddingLeft: `${indent}px` }}
					>
						<span className="flex min-w-0 items-center gap-2">
							{node.type === "directory" ? (
								<span className="flex items-center justify-center text-neutral-400">
									{node.isLoading ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : node.expanded ? (
										<ChevronDown className="h-4 w-4" />
									) : (
										<ChevronRight className="h-4 w-4" />
									)}
								</span>
							) : (
								<span className="flex h-4 w-4 items-center justify-center" />
							)}
							{node.type === "directory" ? (
								<Folder
									className={`h-4 w-4 ${
										node.isRoot ? "text-sky-200" : "text-sky-300/80"
									}`}
								/>
							) : (
								<FileText
									className={`h-4 w-4 ${
										isDisabled
											? "text-neutral-600"
											: (fileIconColor ?? "text-neutral-300")
									}`}
								/>
							)}
							<span className={nameClass} title={node.absolutePath}>
								{node.name}
								{node.relativePath === selectedFile && isDirty && (
									<span
										className="ml-2 inline-block h-2 w-2 rounded-full bg-amber-400"
										aria-hidden
									/>
								)}
							</span>
							{node.type === "file" && node.isUnsupported && (
								<span className="ml-2 rounded bg-neutral-800 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-neutral-500">
									{node.isPreviewable ? "Media" : "Binary"}
								</span>
							)}
						</span>
					</div>
					{node.expanded && node.children && node.children.length > 0 && (
						<div>{renderNodes(node.children, depth + 1)}</div>
					)}
				</div>
			);
		});
	};

	return <>{renderNodes(nodes)}</>;
};

export default FileTree;
