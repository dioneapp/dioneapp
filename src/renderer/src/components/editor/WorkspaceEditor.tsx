import { getCurrentPort } from "@renderer/utils/getPort";
import { FilePlus, FolderPlus, Loader2 } from "lucide-react";
import {
	type KeyboardEvent,
	type MouseEvent,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useScriptsContext } from "../contexts/ScriptsContext";
import ContextMenu from "./ContextMenu";
import EntryNameDialog from "./EntryNameDialog";
import FileTree from "./FileTree";
import HeaderBar from "./HeaderBar";
import PreviewPane from "./PreviewPane";
import {
	mediaMimeMap,
	previewableMediaExtensions,
	unsupportedExtensions,
} from "./utils/constants";
import type {
	ContextMenuState,
	EditorViewProps,
	FileContentResponse,
	FileEncoding,
	FileEntryResponse,
	FileNode,
} from "./utils/types";
import {
	findNodeByPath,
	getExtensionKey,
	getLanguageFromPath,
	getParentPath,
	isValidEntryNameClient,
	normalizeRelativePath,
	parseErrorResponse,
	updateTreeNode,
} from "./utils/utils";

const initialContextMenuState: ContextMenuState = {
	visible: false,
	x: 0,
	y: 0,
	node: null,
};

type EntryDialogState =
	| {
			mode: "create";
			entryType: "file" | "directory";
			parentPath: string;
			initialName: string;
	  }
	| {
			mode: "rename";
			targetPath: string;
			targetType: "file" | "directory";
			parentPath: string;
			initialName: string;
	  };

export default function WorkspaceEditor({ data, setShow }: EditorViewProps) {
	const { showToast } = useScriptsContext();
	const [rootPath, setRootPath] = useState<string>("");
	const [tree, setTree] = useState<FileNode[]>([]);
	const [selectedFile, setSelectedFile] = useState<string | null>(null);
	const [activePath, setActivePath] = useState<string | null>(null);
	const [expandedPaths, setExpandedPaths] = useState<string[]>([]);
	const expandedPathsRef = useRef<string[]>([]);
	const [contextMenu, setContextMenu] = useState<ContextMenuState>(
		initialContextMenuState,
	);
	const [fileContent, setFileContent] = useState<string>("");
	const [initialContent, setInitialContent] = useState<string>("");
	const [fileEncoding, setFileEncoding] = useState<FileEncoding>(null);
	const [fileMimeType, setFileMimeType] = useState<string | null>(null);
	const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
	const [isSaving, setIsSaving] = useState(false);
	const [isLoadingTree, setIsLoadingTree] = useState(false);
	const [isLoadingFile, setIsLoadingFile] = useState(false);
	const [fileError, setFileError] = useState<string | null>(null);
	const [workspaceError, setWorkspaceError] = useState<string | null>(null);
	const [entryDialog, setEntryDialog] = useState<EntryDialogState | null>(null);
	const [entryDialogValue, setEntryDialogValue] = useState("");
	const [entryDialogError, setEntryDialogError] = useState<string | null>(null);
	const [isEntryDialogSubmitting, setIsEntryDialogSubmitting] = useState(false);

	useEffect(() => {
		expandedPathsRef.current = expandedPaths;
	}, [expandedPaths]);

	const isTextFile = selectedFile !== null && fileEncoding === "utf8";
	const isDirty = isTextFile && fileContent !== initialContent;

	const selectedFileNode = useMemo(
		() => findNodeByPath(tree, selectedFile),
		[tree, selectedFile],
	);

	const activeNode = useMemo(
		() => findNodeByPath(tree, activePath),
		[tree, activePath],
	);

	const resetState = useCallback(() => {
		setTree([]);
		setSelectedFile(null);
		setActivePath(null);
		setExpandedPaths([]);
		setFileContent("");
		setInitialContent("");
		setFileEncoding(null);
		setFileMimeType(null);
		setFilePreviewUrl(null);
		setFileError(null);
		setWorkspaceError(null);
	}, []);

	const loadDirectory = useCallback(
		async (relativePath: string) => {
			if (!data?.name) return;

			const normalizedPath = normalizeRelativePath(relativePath);
			const targetPath = normalizedPath;
			const isRootPath = targetPath === "";

			if (isRootPath) {
				setIsLoadingTree(true);
				setTree((prev) =>
					prev.map((node) =>
						node.relativePath === "" ? { ...node, isLoading: true } : node,
					),
				);
			} else {
				setTree((prev) =>
					updateTreeNode(prev, targetPath, (node) => ({
						...node,
						isLoading: true,
					})),
				);
			}

			try {
				const port = await getCurrentPort();
				const params = new URLSearchParams();
				if (targetPath) {
					params.set("dir", targetPath);
				}
				if (data?.id) {
					params.set("appId", data.id);
				}
				const response = await fetch(
					`http://localhost:${port}/files/list/${encodeURIComponent(data.name)}${params.toString() ? `?${params.toString()}` : ""}`,
				);
				if (!response.ok) {
					const info = await parseErrorResponse(response);
					const error = new Error(info.message);
					(error as any).status = info.status;
					throw error;
				}

				const payload = (await response.json()) as {
					entries: FileEntryResponse[];
				};
				setWorkspaceError(null);
				const expandedSet = new Set(expandedPathsRef.current);

				setTree((prev) =>
					updateTreeNode(prev, targetPath, (node) => {
						const existingChildrenMap = new Map(
							(node.children ?? []).map((child) => [child.relativePath, child]),
						);

						const nextChildren: FileNode[] = payload.entries.map((entry) => {
							const existing = existingChildrenMap.get(entry.relativePath);
							if (entry.type === "directory") {
								const shouldBeExpanded =
									existing?.expanded ?? expandedSet.has(entry.relativePath);
								return {
									...entry,
									children: shouldBeExpanded
										? (existing?.children ?? [])
										: (existing?.children ?? []),
									expanded: shouldBeExpanded,
									loaded: shouldBeExpanded
										? (existing?.loaded ?? false)
										: false,
									isLoading: false,
									isUnsupported: false,
									isPreviewable: false,
									isRoot: false,
								};
							}

							const extensionKey = getExtensionKey(entry.name);
							const isPreviewable = extensionKey
								? previewableMediaExtensions.has(extensionKey)
								: false;
							const isBinary = unsupportedExtensions.has(extensionKey ?? "");
							// Mark both media files and binary files as unsupported (disabled)
							const isUnsupported = isPreviewable || isBinary;

							return {
								...entry,
								isUnsupported,
								isPreviewable,
								isLoading: false,
							};
						});

						return {
							...node,
							children: nextChildren,
							expanded: true,
							loaded: true,
							isLoading: false,
						};
					}),
				);

				setExpandedPaths((prev) => {
					if (prev.includes(targetPath)) {
						return prev;
					}
					return [...prev, targetPath];
				});
			} catch (error: any) {
				const status = error?.status ?? 0;
				if (isRootPath) {
					if (status === 404) {
						setWorkspaceError(error?.message || "Workspace not found");
					} else {
						showToast("error", error?.message || "Failed to load workspace");
					}
					setTree([]);
				} else {
					showToast("error", error?.message || "Failed to load directory");
					setTree((prev) =>
						updateTreeNode(prev, targetPath, (node) => ({
							...node,
							isLoading: false,
						})),
					);
				}
			} finally {
				if (isRootPath) {
					setIsLoadingTree(false);
					setTree((prev) =>
						updateTreeNode(prev, "", (node) => ({
							...node,
							isLoading: false,
						})),
					);
				} else {
					setTree((prev) =>
						updateTreeNode(prev, targetPath, (node) => ({
							...node,
							isLoading: false,
						})),
					);
				}
			}
		},
		[data?.id, data?.name, showToast],
	);

	const fetchRootPath = useCallback(async () => {
		if (!data?.name) return;
		setIsLoadingTree(true);
		resetState();

		try {
			const port = await getCurrentPort();
			const params = new URLSearchParams();
			if (data?.id) {
				params.set("appId", data.id);
			}
			const response = await fetch(
				`http://localhost:${port}/files/root/${encodeURIComponent(data.name)}${params.toString() ? `?${params.toString()}` : ""}`,
			);
			if (!response.ok) {
				const info = await parseErrorResponse(response);
				const error = new Error(info.message);
				(error as any).status = info.status;
				throw error;
			}
			const payload = (await response.json()) as { rootPath: string };
			setRootPath(payload.rootPath);
			setTree([
				{
					name: data?.name ?? "Workspace",
					type: "directory",
					relativePath: "",
					absolutePath: payload.rootPath,
					size: null,
					modified: Date.now(),
					children: [],
					expanded: true,
					loaded: false,
					isLoading: false,
					isUnsupported: false,
					isPreviewable: false,
					isRoot: true,
				},
			]);
			setActivePath("");
			setExpandedPaths([""]);
			await new Promise((resolve) => setTimeout(resolve, 0));
			await loadDirectory("");
		} catch (error: any) {
			const status = error?.status ?? 0;
			setRootPath("");
			if (status === 404) {
				setWorkspaceError(error?.message || "Workspace not found");
			} else {
				showToast("error", error?.message || "Unable to open workspace");
			}
		} finally {
			setIsLoadingTree(false);
		}
	}, [data?.id, data?.name, loadDirectory, resetState, showToast]);

	useEffect(() => {
		fetchRootPath();
	}, [fetchRootPath]);

	const handleRefreshWorkspace = useCallback(() => {
		void fetchRootPath();
	}, [fetchRootPath]);

	const handleToggleDirectory = useCallback(
		(node: FileNode) => {
			if (node.type !== "directory") return;
			const targetPath = node.relativePath;
			if (!node.loaded) {
				setExpandedPaths((prev) =>
					prev.includes(targetPath) ? prev : [...prev, targetPath],
				);
				void loadDirectory(targetPath);
				return;
			}
			const nextExpanded = !node.expanded;
			setExpandedPaths((prev) => {
				const next = new Set(prev);
				if (nextExpanded) {
					next.add(targetPath);
				} else {
					next.delete(targetPath);
				}
				return Array.from(next);
			});
			setTree((prev) =>
				updateTreeNode(prev, targetPath, (current) => ({
					...current,
					expanded: nextExpanded,
				})),
			);
		},
		[loadDirectory],
	);

	const handleSelectFile = useCallback(
		async (node: FileNode) => {
			if (node.type !== "file") return;
			setActivePath(node.relativePath);
			if (node.isUnsupported) {
				const extensionKey = getExtensionKey(node.name);
				const isMediaFile = extensionKey
					? previewableMediaExtensions.has(extensionKey)
					: false;
				if (isMediaFile) {
					showToast("warning", "Media files cannot be opened in the editor.");
				} else {
					showToast(
						"warning",
						"This file type can't be opened in the editor yet.",
					);
				}
				return;
			}
			if (isDirty && node.relativePath !== selectedFile) {
				const confirmLeave = window.confirm(
					"You have unsaved changes. Continue without saving?",
				);
				if (!confirmLeave) {
					return;
				}
			}

			const previousState = {
				file: selectedFile,
				content: fileContent,
				initial: initialContent,
				encoding: fileEncoding,
				mime: fileMimeType,
				preview: filePreviewUrl,
				active: activePath,
			};

			setSelectedFile(node.relativePath);
			setIsLoadingFile(true);
			setFileError(null);
			setFileEncoding(null);
			setFileMimeType(null);
			setFilePreviewUrl(null);

			try {
				const port = await getCurrentPort();
				const params = new URLSearchParams({ file: node.relativePath });
				if (data?.id) {
					params.set("appId", data.id);
				}
				const response = await fetch(
					`http://localhost:${port}/files/content/${encodeURIComponent(data.name)}?${params.toString()}`,
				);
				if (!response.ok) {
					const info = await parseErrorResponse(response);
					const error = new Error(info.message);
					(error as any).status = info.status;
					throw error;
				}
				const payload = (await response.json()) as FileContentResponse;
				if (payload.encoding === "base64") {
					const extensionKey = getExtensionKey(node.name);
					const fallbackMime = extensionKey
						? mediaMimeMap[extensionKey]
						: undefined;
					const mimeType =
						payload.mimeType || fallbackMime || "application/octet-stream";
					const encodedContent =
						typeof payload.content === "string" ? payload.content : "";
					const previewData = encodedContent
						? `data:${mimeType};base64,${encodedContent}`
						: null;
					setFileEncoding("base64");
					setFileMimeType(mimeType);
					setFilePreviewUrl(previewData);
					setFileContent("");
					setInitialContent("");
					// Don't update the tree - keep media files marked as unsupported/disabled
				} else {
					setFileEncoding("utf8");
					setFileMimeType(null);
					setFilePreviewUrl(null);
					setFileContent(payload.content ?? "");
					setInitialContent(payload.content ?? "");
					setTree((prev) =>
						updateTreeNode(prev, node.relativePath, (current) => ({
							...current,
							isUnsupported: false,
						})),
					);
				}
			} catch (error: any) {
				setFileContent(previousState.content ?? "");
				setInitialContent(previousState.initial ?? "");
				setFileEncoding(previousState.encoding ?? null);
				setFileMimeType(previousState.mime ?? null);
				setFilePreviewUrl(previousState.preview ?? null);
				setSelectedFile(previousState.file ?? null);
				setActivePath(previousState.active ?? previousState.file ?? null);
				const status = error?.status ?? 0;
				const message = error?.message || "Failed to load file";
				if (status === 415) {
					const extensionKey = getExtensionKey(node.name);
					const isMediaFile = extensionKey
						? previewableMediaExtensions.has(extensionKey)
						: false;
					setTree((prev) =>
						updateTreeNode(prev, node.relativePath, (current) => ({
							...current,
							isUnsupported: true,
							isPreviewable: isMediaFile,
						})),
					);
					if (isMediaFile) {
						showToast("warning", "Media files cannot be opened in the editor.");
					} else {
						showToast(
							"warning",
							message || "This file type can't be opened in the editor yet.",
						);
					}
				} else {
					if (previousState.file === node.relativePath || !previousState.file) {
						setFileError(message);
					}
					showToast("error", message);
				}
			} finally {
				setIsLoadingFile(false);
			}
		},
		[
			activePath,
			data?.id,
			data?.name,
			fileContent,
			fileEncoding,
			fileMimeType,
			filePreviewUrl,
			initialContent,
			isDirty,
			selectedFile,
			showToast,
		],
	);

	const handleSaveFile = useCallback(async () => {
		if (!selectedFile || fileEncoding !== "utf8") {
			showToast("warning", "This file type cannot be edited yet.");
			return;
		}
		setIsSaving(true);
		try {
			const port = await getCurrentPort();
			const params = new URLSearchParams();
			if (data?.id) {
				params.set("appId", data.id);
			}
			const response = await fetch(
				`http://localhost:${port}/files/save/${encodeURIComponent(data.name)}${params.toString() ? `?${params.toString()}` : ""}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ file: selectedFile, content: fileContent }),
				},
			);
			if (!response.ok) {
				const info = await parseErrorResponse(response);
				const error = new Error(info.message);
				(error as any).status = info.status;
				throw error;
			}
			setInitialContent(fileContent);
			showToast("success", "File saved successfully");
		} catch (error: any) {
			showToast("error", error?.message || "Failed to save file");
		} finally {
			setIsSaving(false);
		}
	}, [
		data?.id,
		data?.name,
		fileContent,
		fileEncoding,
		selectedFile,
		showToast,
	]);

	const handleReloadFile = useCallback(() => {
		if (!selectedFileNode || selectedFileNode.type !== "file") return;
		void handleSelectFile(selectedFileNode);
	}, [handleSelectFile, selectedFileNode]);

	const handleReloadNode = useCallback(() => {
		const node = contextMenu.node;
		if (!node || node.type !== "file") return;
		void handleSelectFile(node);
	}, [contextMenu.node, handleSelectFile]);

	const handleTreeItemActivate = useCallback(
		(node: FileNode) => {
			setActivePath(node.relativePath);
			if (node.type === "directory") {
				handleToggleDirectory(node);
				return;
			}
			if (node.isUnsupported) {
				const extensionKey = getExtensionKey(node.name);
				const isMediaFile = extensionKey
					? previewableMediaExtensions.has(extensionKey)
					: false;
				if (isMediaFile) {
					showToast("warning", "Media files cannot be opened in the editor.");
				} else {
					showToast(
						"warning",
						"This file type can't be opened in the editor yet.",
					);
				}
				return;
			}
			void handleSelectFile(node);
		},
		[handleSelectFile, handleToggleDirectory, showToast],
	);

	const handleTreeItemKeyDown = useCallback(
		(event: KeyboardEvent<HTMLDivElement>, node: FileNode) => {
			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				handleTreeItemActivate(node);
			}
		},
		[handleTreeItemActivate],
	);

	const handleCopyNodePath = useCallback(
		async (node: FileNode) => {
			try {
				await navigator.clipboard.writeText(node.absolutePath);
				showToast("success", "Path copied to clipboard");
			} catch (error) {
				showToast("error", "Failed to copy path");
			}
		},
		[showToast],
	);

	const handleOpenNodeFolder = useCallback(
		(node: FileNode) => {
			if (!node.absolutePath) return;
			window.electron.ipcRenderer
				.invoke("open-dir", node.absolutePath)
				.catch(() => {
					showToast("error", "Unable to open location");
				});
		},
		[showToast],
	);

	const handleDeleteEntry = useCallback(
		async (node: FileNode) => {
			if (!data?.name || !node) return;
			if (node.relativePath === "") {
				showToast("warning", "Cannot delete workspace root");
				return;
			}
			const confirmDelete = window.confirm(
				`Delete "${node.name}"? This cannot be undone.`,
			);
			if (!confirmDelete) return;
			try {
				const port = await getCurrentPort();
				const params = new URLSearchParams();
				if (data?.id) params.set("appId", data.id);
				const response = await fetch(
					`http://localhost:${port}/files/delete/${encodeURIComponent(data.name)}${params.toString() ? `?${params.toString()}` : ""}`,
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ path: node.relativePath }),
					},
				);
				if (!response.ok) {
					const info = await parseErrorResponse(response);
					throw new Error(info.message);
				}
				const parentPath = getParentPath(node.relativePath);
				await loadDirectory(parentPath);
				setExpandedPaths((prev) => {
					const next = new Set(prev);
					next.delete(node.relativePath);
					return Array.from(next);
				});
				if (selectedFile === node.relativePath) {
					setSelectedFile(null);
					setFileContent("");
					setInitialContent("");
					setFileEncoding(null);
					setFileMimeType(null);
					setFilePreviewUrl(null);
					setFileError(null);
				}
				showToast("success", "Deleted");
			} catch (error: any) {
				showToast("error", error?.message || "Failed to delete entry");
			}
		},
		[data?.id, data?.name, loadDirectory, selectedFile, showToast],
	);

	const getTargetDirectoryPath = useCallback(() => {
		if (activeNode) {
			return activeNode.type === "directory"
				? activeNode.relativePath
				: getParentPath(activeNode.relativePath);
		}
		if (selectedFileNode) {
			return getParentPath(selectedFileNode.relativePath);
		}
		return "";
	}, [activeNode, selectedFileNode]);

	const closeEntryDialog = useCallback(() => {
		setEntryDialog(null);
		setEntryDialogValue("");
		setEntryDialogError(null);
		setIsEntryDialogSubmitting(false);
	}, []);

	const handleEntryDialogCancel = useCallback(() => {
		if (isEntryDialogSubmitting) return;
		closeEntryDialog();
	}, [closeEntryDialog, isEntryDialogSubmitting]);

	const openCreateEntryDialog = useCallback(
		(entryType: "file" | "directory") => {
			if (!data?.name) {
				showToast("error", "Workspace is not available");
				return;
			}
			const parentPath = getTargetDirectoryPath();
			const suggestedName =
				entryType === "file" ? "untitled.txt" : "New Folder";
			setEntryDialog({
				mode: "create",
				entryType,
				parentPath,
				initialName: suggestedName,
			});
			setEntryDialogValue(suggestedName);
			setEntryDialogError(null);
			setIsEntryDialogSubmitting(false);
		},
		[data?.name, getTargetDirectoryPath, showToast],
	);

	const openRenameEntryDialog = useCallback(
		(targetNode?: FileNode) => {
			if (!data?.name) {
				showToast("error", "Workspace is not available");
				return;
			}
			const target = targetNode ?? activeNode ?? selectedFileNode;
			if (!target) {
				showToast("warning", "Select a file or folder to rename");
				return;
			}
			if (target.relativePath === "") {
				showToast("warning", "Cannot rename the workspace root");
				return;
			}
			setEntryDialog({
				mode: "rename",
				targetPath: target.relativePath,
				targetType: target.type,
				parentPath: getParentPath(target.relativePath),
				initialName: target.name,
			});
			setEntryDialogValue(target.name);
			setEntryDialogError(null);
			setIsEntryDialogSubmitting(false);
		},
		[activeNode, data?.name, selectedFileNode, showToast],
	);

	const handleEntryDialogConfirm = useCallback(async () => {
		if (isEntryDialogSubmitting) return;
		if (!entryDialog) return;
		const trimmed = entryDialogValue.trim();
		if (!trimmed) {
			setEntryDialogError("Name cannot be empty");
			return;
		}
		if (!isValidEntryNameClient(trimmed)) {
			setEntryDialogError("Name contains invalid characters");
			return;
		}
		if (entryDialog.mode === "rename" && trimmed === entryDialog.initialName) {
			closeEntryDialog();
			return;
		}

		setEntryDialogError(null);
		setIsEntryDialogSubmitting(true);

		if (!data?.name) {
			setEntryDialogError("Workspace is not available");
			setIsEntryDialogSubmitting(false);
			return;
		}

		const workspaceName = data.name;
		const appId = data.id;

		try {
			const port = await getCurrentPort();
			const params = new URLSearchParams();
			if (appId) {
				params.set("appId", appId);
			}

			if (entryDialog.mode === "create") {
				const response = await fetch(
					`http://localhost:${port}/files/create/${encodeURIComponent(workspaceName)}${params.toString() ? `?${params.toString()}` : ""}`,
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							parent: entryDialog.parentPath,
							name: trimmed,
							type: entryDialog.entryType,
						}),
					},
				);
				if (!response.ok) {
					const info = await parseErrorResponse(response);
					const error = new Error(info.message);
					(error as any).status = info.status;
					throw error;
				}
				const payload = (await response.json()) as { entry: FileEntryResponse };
				await loadDirectory(entryDialog.parentPath);
				const createdPath = payload.entry.relativePath;
				setExpandedPaths((prev) => {
					const next = new Set(prev);
					next.add(entryDialog.parentPath);
					if (entryDialog.entryType === "directory") {
						next.add(createdPath);
					}
					return Array.from(next);
				});
				setActivePath(createdPath);
				if (entryDialog.entryType === "file") {
					setSelectedFile(createdPath);
					setFileContent("");
					setInitialContent("");
					setFileEncoding("utf8");
					setFileMimeType(null);
					setFilePreviewUrl(null);
					setFileError(null);
				}
				showToast(
					"success",
					entryDialog.entryType === "file" ? "File created" : "Folder created",
				);
				closeEntryDialog();
				return;
			}

			const response = await fetch(
				`http://localhost:${port}/files/rename/${encodeURIComponent(workspaceName)}${params.toString() ? `?${params.toString()}` : ""}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ path: entryDialog.targetPath, name: trimmed }),
				},
			);
			if (!response.ok) {
				const info = await parseErrorResponse(response);
				const error = new Error(info.message);
				(error as any).status = info.status;
				throw error;
			}
			const payload = (await response.json()) as {
				entry: FileEntryResponse;
				previousPath: string;
			};
			const newPath = payload.entry.relativePath;
			const parentPath = getParentPath(newPath);
			await loadDirectory(parentPath);
			if (entryDialog.targetType === "directory") {
				setExpandedPaths((prev) => {
					const next = new Set(prev);
					const prefix = `${payload.previousPath}/`;
					for (const path of next) {
						if (path === payload.previousPath || path.startsWith(prefix)) {
							next.delete(path);
						}
					}
					next.add(parentPath);
					next.add(newPath);
					return Array.from(next);
				});
			} else {
				setExpandedPaths((prev) => {
					const next = new Set(prev);
					next.add(parentPath);
					return Array.from(next);
				});
			}
			if (selectedFile === payload.previousPath) {
				setSelectedFile(newPath);
			}
			setActivePath(newPath);
			showToast("success", "Entry renamed");
			closeEntryDialog();
		} catch (error: any) {
			const status = error?.status ?? 0;
			const fallbackMessage =
				entryDialog.mode === "create"
					? "Failed to create entry"
					: "Failed to rename entry";
			const message = error?.message || fallbackMessage;
			if (status === 409 || status === 400) {
				setEntryDialogError(message);
				return;
			}
			showToast("error", message);
			closeEntryDialog();
		} finally {
			setIsEntryDialogSubmitting(false);
		}
	}, [
		closeEntryDialog,
		data?.id,
		data?.name,
		entryDialog,
		entryDialogValue,
		isEntryDialogSubmitting,
		loadDirectory,
		selectedFile,
		showToast,
	]);

	const handleBackToPreview = useCallback(() => {
		if (!data?.id) return;
		if (isDirty) {
			const confirmLeave = window.confirm(
				"You have unsaved changes. Leave the editor?",
			);
			if (!confirmLeave) {
				return;
			}
		}
		setShow({ [data.id]: "iframe" });
	}, [data?.id, isDirty, setShow]);

	const handleOpenInExplorer = useCallback(() => {
		if (!rootPath) return;
		window.electron.ipcRenderer.invoke("open-dir", rootPath);
	}, [rootPath]);

	const language = useMemo(
		() =>
			fileEncoding === "utf8" ? getLanguageFromPath(selectedFile) : "plaintext",
		[fileEncoding, selectedFile],
	);

	const handleContextMenuOpen = useCallback(
		(event: MouseEvent<HTMLDivElement>, node: FileNode) => {
			event.preventDefault();
			event.stopPropagation();
			setContextMenu({
				visible: true,
				x: event.clientX,
				y: event.clientY,
				node,
			});
		},
		[],
	);

	const handleContextMenuClose = useCallback(() => {
		setContextMenu(initialContextMenuState);
	}, []);

	const handleRowClick = useCallback(
		(node: FileNode) => {
			if (contextMenu.visible) {
				handleContextMenuClose();
			}
			handleTreeItemActivate(node);
		},
		[contextMenu.visible, handleContextMenuClose, handleTreeItemActivate],
	);

	const workspaceName = data?.name || "Workspace";
	const entryDialogTitle = entryDialog
		? entryDialog.mode === "create"
			? entryDialog.entryType === "file"
				? "Create file"
				: "Create folder"
			: entryDialog.targetType === "directory"
				? "Rename folder"
				: "Rename file"
		: "";
	const entryDialogDescription = entryDialog
		? entryDialog.mode === "create"
			? entryDialog.parentPath
				? `This will be created inside ${entryDialog.parentPath}.`
				: "This will be created in the workspace root."
			: entryDialog.parentPath
				? `Current location: ${entryDialog.parentPath}.`
				: "Current location: workspace root."
		: undefined;
	const entryDialogConfirmLabel = entryDialog
		? entryDialog.mode === "create"
			? entryDialog.entryType === "file"
				? "Create file"
				: "Create folder"
			: "Rename"
		: "Confirm";
	const entryDialogPlaceholder =
		entryDialog?.mode === "create"
			? entryDialog.entryType === "file"
				? "example.ts"
				: "New Folder"
			: undefined;

	return (
		<div
			className="flex h-full w-full flex-col"
			onClick={() => {
				if (contextMenu.visible) handleContextMenuClose();
			}}
		>
			<HeaderBar
				rootPath={rootPath}
				activeNode={activeNode}
				selectedFileNode={selectedFileNode}
				isDirty={isDirty}
				isSaving={isSaving}
				isLoadingTree={isLoadingTree}
				onBack={handleBackToPreview}
				onOpenInExplorer={handleOpenInExplorer}
				onRefreshWorkspace={handleRefreshWorkspace}
				onRename={() => {
					openRenameEntryDialog();
				}}
				onReloadFile={handleReloadFile}
				onSaveFile={handleSaveFile}
			/>

			<div className="flex h-full flex-1 overflow-hidden bg-neutral-950/65">
				<div className="w-64 shrink-0 border-r border-white/10 bg-neutral-950/80">
					<div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
						<div className="flex min-w-0 flex-col">
							<span className="truncate text-[11px] font-semibold uppercase tracking-wide text-neutral-200">
								{workspaceName}
							</span>
							<span
								className="truncate text-[10px] font-normal uppercase tracking-normal text-neutral-500"
								title={rootPath}
							>
								{rootPath || "Resolving path..."}
							</span>
						</div>
						<div className="flex items-center gap-1">
							<button
								type="button"
								onClick={() => {
									openCreateEntryDialog("file");
								}}
								className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/2 text-neutral-300 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50 cursor-pointer"
								title="New file"
							>
								<FilePlus className="h-3.5 w-3.5" />
							</button>
							<button
								type="button"
								onClick={() => {
									openCreateEntryDialog("directory");
								}}
								className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/2 text-neutral-300 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50 cursor-pointer"
								title="New folder"
							>
								<FolderPlus className="h-3.5 w-3.5" />
							</button>
							{isLoadingTree && (
								<Loader2 className="h-3 w-3 animate-spin text-neutral-300" />
							)}
						</div>
					</div>
					<div className="h-full overflow-y-auto pb-24">
						{workspaceError ? (
							<div className="flex h-full flex-col gap-3 px-3 py-4 text-xs text-neutral-400">
								<span>{workspaceError}</span>
								<button
									type="button"
									onClick={handleRefreshWorkspace}
									className="self-start rounded-md border border-white/10 px-3 py-1 text-neutral-200 transition-colors hover:bg-white/10"
								>
									Retry
								</button>
							</div>
						) : (
							<FileTree
								nodes={tree}
								selectedFile={selectedFile}
								activePath={activePath}
								isContextMenuVisible={contextMenu.visible}
								isDirty={isDirty}
								onRowClick={handleRowClick}
								onKeyDown={handleTreeItemKeyDown}
								onContextMenu={handleContextMenuOpen}
							/>
						)}
					</div>
				</div>
				<div className="relative flex flex-1 flex-col bg-[#0a0a0a]">
					{selectedFileNode && selectedFileNode.type === "file" ? (
						<PreviewPane
							selectedFileNode={selectedFileNode}
							fileEncoding={fileEncoding}
							fileContent={fileContent}
							fileMimeType={fileMimeType}
							filePreviewUrl={filePreviewUrl}
							fileError={fileError}
							isLoadingFile={isLoadingFile}
							isDirty={isDirty}
							language={language}
							onReloadFile={handleReloadFile}
							onContentChange={setFileContent}
						/>
					) : workspaceError ? (
						<div className="flex h-full flex-col items-center justify-center gap-3 text-center text-sm text-neutral-300">
							<FolderPlus className="h-8 w-8 text-neutral-500" />
							<span>{workspaceError}</span>
							<button
								type="button"
								onClick={handleRefreshWorkspace}
								className="rounded-md border border-white/10 px-3 py-1 text-xs text-neutral-200 transition-colors hover:bg-white/10"
							>
								Retry
							</button>
						</div>
					) : (
						<PreviewPane
							fileEncoding={fileEncoding}
							fileContent={fileContent}
							fileMimeType={fileMimeType}
							filePreviewUrl={filePreviewUrl}
							fileError={fileError}
							isLoadingFile={isLoadingFile}
							isDirty={isDirty}
							language={language}
							onReloadFile={handleReloadFile}
							onContentChange={setFileContent}
						/>
					)}
				</div>
			</div>

			<ContextMenu
				state={contextMenu}
				onCopyPath={() => {
					if (contextMenu.node) void handleCopyNodePath(contextMenu.node);
				}}
				onOpenFolder={() => {
					if (contextMenu.node) handleOpenNodeFolder(contextMenu.node);
				}}
				onReloadFile={handleReloadNode}
				onRename={() => {
					if (contextMenu.node) openRenameEntryDialog(contextMenu.node);
				}}
				onDelete={() => {
					if (contextMenu.node) void handleDeleteEntry(contextMenu.node);
				}}
				onClose={handleContextMenuClose}
			/>
			<EntryNameDialog
				open={!!entryDialog}
				title={entryDialogTitle}
				description={entryDialogDescription}
				value={entryDialogValue}
				placeholder={entryDialogPlaceholder}
				error={entryDialogError}
				isSubmitting={isEntryDialogSubmitting}
				confirmLabel={entryDialogConfirmLabel}
				onChange={(value) => setEntryDialogValue(value)}
				onCancel={handleEntryDialogCancel}
				onConfirm={() => {
					void handleEntryDialogConfirm();
				}}
			/>
		</div>
	);
}
