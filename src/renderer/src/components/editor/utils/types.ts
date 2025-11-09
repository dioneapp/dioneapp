import type { Dispatch, SetStateAction } from "react";

export interface EditorViewProps {
	data: any;
	setShow: Dispatch<SetStateAction<Record<string, string>>>;
}

export type FileNode = {
	name: string;
	type: "file" | "directory";
	relativePath: string;
	absolutePath: string;
	size: number | null;
	modified: number;
	children?: FileNode[];
	expanded?: boolean;
	loaded?: boolean;
	isLoading?: boolean;
	isUnsupported?: boolean;
	isPreviewable?: boolean;
	isRoot?: boolean;
};

export type FileEntryResponse = {
	name: string;
	type: "file" | "directory";
	relativePath: string;
	absolutePath: string;
	size: number | null;
	modified: number;
};

export type FileEncoding = "utf8" | "base64" | null;

export type ContextMenuState = {
	visible: boolean;
	x: number;
	y: number;
	node: FileNode | null;
};

export type FileContentResponse = {
	content: string;
	encoding: string;
	mimeType?: string;
};
