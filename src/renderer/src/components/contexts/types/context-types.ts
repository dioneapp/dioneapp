import { Terminal } from "@xterm/xterm";
import type { Dispatch, RefObject, SetStateAction } from "react";
import type { Socket } from "socket.io-client";

// Auth context
export interface AuthContextType {
	user: any;
	setUser: React.Dispatch<React.SetStateAction<any>>;
	refreshSessionToken: string | null;
	setRefreshSessionToken: React.Dispatch<React.SetStateAction<string | null>>;
	logout: () => void;
	loading: boolean;
}

// Scripts context
export interface ProgressStepDef {
	id: string;
	label: string;
	weight: number;
}

export interface ProgressState {
	mode: "determinate" | "indeterminate";
	percent: number; // 0..100
	label?: string;
	status: "running" | "success" | "error";
	runId?: string;
	steps?: ProgressStepDef[];
}

export interface DependencyDiagnostic {
	dependency: string;
	status: "already-installed" | "installed" | "failed" | "uninstalled";
	summary: string;
	exitCode?: number;
	needsReboot?: boolean;
	uacCancelled?: boolean;
	logs?: string;
	sdkVersion?: string;
	installPath?: string;
	vcvarsPath?: string;
	clPath?: string;
	cmakePath?: string;
	msvcVersion?: string;
}

export type DependencyDiagnosticsState = Record<
	string,
	Record<string, DependencyDiagnostic>
>;

export interface ScriptsLogContextType {
	logs: Record<string, string>;
	setLogs: React.Dispatch<React.SetStateAction<Record<string, string>>>;
	addLog: (appId: string, message: string) => void;
	addLogLine: (appId: string, message: string) => void;
	clearLogs: (appId: string) => void;
	getAllAppLogs: () => string[];
	statusLog: Record<string, { status: string; content: string }>;
	setStatusLog: React.Dispatch<
		React.SetStateAction<Record<string, { status: string; content: string }>>
	>;
	progress: Record<string, ProgressState>;
	setProgress: React.Dispatch<
		React.SetStateAction<Record<string, ProgressState>>
	>;
	deleteLogs: any[];
	setDeleteLogs: React.Dispatch<React.SetStateAction<any[]>>;
}

export interface ScriptsContextType {
	setInstalledApps: React.Dispatch<React.SetStateAction<any[]>>;
	installedApps: any[];
	socket: any;
	// log related properties moved to ScriptsLogContextType

	isServerRunning: Record<string, boolean>;
	setIsServerRunning: React.Dispatch<
		React.SetStateAction<Record<string, boolean>>
	>;
	setData: React.Dispatch<React.SetStateAction<any>>;
	data: any;
	error: boolean;
	setError: React.Dispatch<React.SetStateAction<boolean>>;
	setIframeAvailable: React.Dispatch<
		React.SetStateAction<Record<string, boolean>>
	>;
	iframeAvailable: Record<string, boolean>;
	setMissingDependencies: React.Dispatch<React.SetStateAction<any>>;
	missingDependencies: any;
	dependencyDiagnostics: DependencyDiagnosticsState;
	setDependencyDiagnostics: React.Dispatch<
		React.SetStateAction<DependencyDiagnosticsState>
	>;
	show: Record<string, string>;
	setShow: React.Dispatch<React.SetStateAction<Record<string, string>>>;
	showToast: (
		variant: "default" | "success" | "error" | "warning",
		message: string,
		fixed?: "true" | "false",
		button?: boolean,
		buttonText?: string,
		buttonAction?: () => void,
		removeAfter?: number,
	) => void;
	stopCheckingRef: React.MutableRefObject<boolean>;
	iframeSrc: Record<string, string>;
	setIframeSrc: React.Dispatch<React.SetStateAction<Record<string, string>>>;
	catchPort: Record<string, number>;
	setCatchPort: React.Dispatch<React.SetStateAction<Record<string, number>>>;
	exitRef: boolean;
	setExitRef: React.Dispatch<React.SetStateAction<boolean>>;
	apps: any[];
	setApps: React.Dispatch<React.SetStateAction<any[]>>;
	socketRef: any;

	handleReloadQuickLaunch: () => Promise<void>;
	removedApps: any[];
	setRemovedApps: React.Dispatch<React.SetStateAction<any[]>>;
	availableApps: any[];
	setAvailableApps: React.Dispatch<React.SetStateAction<any[]>>;
	connectApp: (appId: string, isLocal?: boolean) => void;
	disconnectApp: (appId: string) => void;
	sockets: Record<string, { socket: Socket; isLocal?: boolean }>;
	activeApps: any[];
	handleStopApp: (appId: string, appName: string) => void;
	appFinished: Record<string, boolean>;
	setAppFinished: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
	loadIframe: (port: number) => void;
	setLocalApps: React.Dispatch<React.SetStateAction<any[]>>;
	localApps: any[];
	setNotSupported: React.Dispatch<
		React.SetStateAction<Record<string, { reasons: string[] }>>
	>;
	notSupported: Record<string, { reasons: string[] }>;
	wasJustInstalled: boolean;
	setWasJustInstalled: React.Dispatch<React.SetStateAction<boolean>>;

	shouldCatch: Record<string, boolean>;
	setShouldCatch: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
	isLocal?: boolean;
	canStop: Record<string, boolean>;
	setCanStop: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
	terminalStatesRef: RefObject<Record<string, Terminal>>;
}

// Socket types
export interface SetupSocketProps {
	appId: string;
	addLog: (appId: string, log: string) => void;
	port: number;
	setMissingDependencies: React.Dispatch<React.SetStateAction<any>>;
	setDependencyDiagnostics: React.Dispatch<
		React.SetStateAction<DependencyDiagnosticsState>
	>;
	setIframeAvailable: React.Dispatch<
		React.SetStateAction<Record<string, boolean>>
	>;
	setCatchPort: React.Dispatch<React.SetStateAction<Record<string, number>>>;
	loadIframe: (port: number) => void;
	setIframeSrc: React.Dispatch<React.SetStateAction<Record<string, string>>>;
	errorRef: React.MutableRefObject<boolean>;
	showToast: (
		variant: "default" | "success" | "error" | "warning",
		message: string,
		fixed?: "true" | "false",
		button?: boolean,
		buttonText?: string,
		buttonAction?: () => void,
	) => void;
	stopCheckingRef: React.MutableRefObject<boolean>;
	setStatusLog: React.Dispatch<
		React.SetStateAction<Record<string, { status: string; content: string }>>
	>;
	setDeleteLogs: React.Dispatch<React.SetStateAction<string[]>>;
	data: any;
	socketsRef: React.MutableRefObject<
		Record<string, { socket: Socket; isLocal?: boolean }>
	>;
	setAppFinished: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
	setNotSupported: React.Dispatch<
		React.SetStateAction<Record<string, { reasons: string[] }>>
	>;
	setWasJustInstalled: React.Dispatch<React.SetStateAction<boolean>>;
	setProgress: React.Dispatch<
		React.SetStateAction<Record<string, ProgressState>>
	>;
	setShouldCatch: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
	shouldCatch: Record<string, boolean>;
	isLocal?: boolean;
	setCanStop: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
	canStop: Record<string, boolean>;
}

export interface AIContextType {
	messages: { role: string; content: string }[];
	setMessages: (messages: { role: string; content: string }[]) => void;
	messageLoading: boolean;
	setMessageLoading: (loading: boolean) => void;
	redirecting: boolean;
	setRedirecting: (redirecting: boolean) => void;
	usingTool: { name: string; message: string };
	setUsingTool: (tool: { name: string; message: string }) => void;
	ollamaStatus: string;
	setOllamaStatus: (status: string) => void;
	ollamaInstalled: boolean;
	setOllamaInstalled: (installed: boolean) => void;
	ollamaRunning: boolean;
	setOllamaRunning: (running: boolean) => void;
	ollamaModel: string;
	setOllamaModel: (model: string) => void;
	ollamaSupport: string[];
	setOllamaSupport: (support: string[]) => void;
	showInstallModal: boolean | string;
	setShowInstallModal: (modal: boolean | string) => void;
	showModelHub: boolean;
	setShowModelHub: (hub: boolean) => void;
	installStep: number;
	setInstallStep: Dispatch<SetStateAction<number>>;
	chat: (
		prompt: string,
		quickAI?: boolean,
		code?: {
			context: string;
			name: string;
			path: string;
			workspaceName: string;
			workspaceFiles: any;
			workspacePath: string;
		},
	) => Promise<void>;
	downloadOllama: () => void;
	handleStopOllama: () => void;
	handleStartOllama: () => void;
	checkOllama: () => void;
}
