import {
	fileIconColorMap,
	invalidNamePattern,
	languageByExtension,
} from "./constants";
import type { FileNode } from "./types";

export const normalizeRelativePath = (value: string) =>
	value
		.split("/")
		.map((segment) => segment.trim())
		.filter((segment) => segment.length > 0)
		.join("/");

export const getParentPath = (relativePath: string) => {
	const normalized = normalizeRelativePath(relativePath);
	if (!normalized) return "";
	const lastSlash = normalized.lastIndexOf("/");
	return lastSlash === -1 ? "" : normalized.slice(0, lastSlash);
};

export const getExtensionKey = (name: string) => {
	const lower = name.toLowerCase();
	if (lower === "dockerfile") return "docker";
	if (lower.endsWith(".d.ts")) return "ts";
	const parts = lower.split(".");
	return parts.length > 1 ? (parts.pop() ?? "") : "";
};

export const getFileIconColor = (name: string) => {
	const key = getExtensionKey(name);
	return (key ? fileIconColorMap[key] : undefined) ?? fileIconColorMap.default;
};

export const isValidEntryNameClient = (value: string) =>
	typeof value === "string" &&
	value.trim().length > 0 &&
	!invalidNamePattern.test(value);

export const getLanguageFromPath = (filePath: string | null) => {
	if (!filePath) return "plaintext";
	const parts = filePath.split("/");
	const fileName = parts[parts.length - 1] ?? "";
	const lower = fileName.toLowerCase();
	if (lower === "dockerfile") return "dockerfile";
	if (lower === "makefile") return "makefile";
	if (lower.endsWith(".d.ts")) return "typescript";
	const key = getExtensionKey(fileName);
	return key ? (languageByExtension[key] ?? "plaintext") : "plaintext";
};

export const updateTreeNode = (
	nodes: FileNode[],
	targetPath: string,
	update: (node: FileNode) => FileNode,
): FileNode[] => {
	return nodes.map((node) => {
		if (node.relativePath === targetPath) {
			return update(node);
		}
		if (node.type === "directory" && node.children) {
			return {
				...node,
				children: updateTreeNode(node.children, targetPath, update),
			};
		}
		return node;
	});
};

export const findNodeByPath = (
	nodes: FileNode[],
	targetPath: string | null,
): FileNode | undefined => {
	if (targetPath === null || typeof targetPath === "undefined")
		return undefined;
	for (const node of nodes) {
		if (node.relativePath === targetPath) {
			return node;
		}
		if (node.type === "directory" && node.children) {
			const result = findNodeByPath(node.children, targetPath);
			if (result) return result;
		}
	}
	return undefined;
};

export const parseErrorResponse = async (response: Response) => {
	const raw = await response.text();
	let message = response.statusText || "Unexpected error";
	if (raw) {
		try {
			const data = JSON.parse(raw);
			if (typeof data?.error === "string") {
				message = data.error;
			} else if (typeof data?.message === "string") {
				message = data.message;
			} else {
				message = raw;
			}
		} catch (error) {
			message = raw;
		}
	}
	return { message, status: response.status };
};
