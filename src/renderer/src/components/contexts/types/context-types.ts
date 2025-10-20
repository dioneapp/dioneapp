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

export interface ScriptsContextType {
    setInstalledApps: React.Dispatch<React.SetStateAction<any[]>>;
    installedApps: any[];
    socket: any;
    logs: Record<string, string[]>;
    setLogs: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
    statusLog: Record<string, { status: string; content: string }>;
    setStatusLog: React.Dispatch<
        React.SetStateAction<Record<string, { status: string; content: string }>>
    >;
    isServerRunning: Record<string, boolean>;
    setIsServerRunning: React.Dispatch<
        React.SetStateAction<Record<string, boolean>>
    >;
    setData: React.Dispatch<React.SetStateAction<any>>;
    data: any;
    error: boolean;
    setError: React.Dispatch<React.SetStateAction<boolean>>;
    setIframeAvailable: React.Dispatch<React.SetStateAction<boolean>>;
    iframeAvailable: boolean;
    setMissingDependencies: React.Dispatch<React.SetStateAction<any>>;
    missingDependencies: any;
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
    iframeSrc: string;
    setIframeSrc: React.Dispatch<React.SetStateAction<string>>;
    catchPort: number | undefined;
    setCatchPort: React.Dispatch<React.SetStateAction<number | undefined>>;
    exitRef: boolean;
    setExitRef: React.Dispatch<React.SetStateAction<boolean>>;
    apps: any[];
    setApps: React.Dispatch<React.SetStateAction<any[]>>;
    socketRef: any;
    deleteLogs: any[];
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
    addLog: (appId: string, message: string) => void;
    addLogLine: (appId: string, message: string) => void;
    clearLogs: (appId: string) => void;
    getAllAppLogs: () => string[];
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
    progress: Record<string, ProgressState>;
    setProgress: React.Dispatch<React.SetStateAction<Record<string, ProgressState>>>;
    isLocal?: boolean;
}

// Socket types
export interface SetupSocketProps {
    appId: string;
    addLog: (appId: string, log: string) => void;
    port: number;
    setMissingDependencies: React.Dispatch<React.SetStateAction<any>>;
    setIframeAvailable: React.Dispatch<React.SetStateAction<boolean>>;
    setCatchPort: React.Dispatch<React.SetStateAction<number | undefined>>;
    loadIframe: (port: number) => void;
    setIframeSrc: React.Dispatch<React.SetStateAction<string>>;
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
    statusLog: Record<string, { status: string; content: string }>;
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
    setProgress: React.Dispatch<React.SetStateAction<Record<string, ProgressState>>>;
    isLocal?: boolean;
}
