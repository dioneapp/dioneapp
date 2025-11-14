const PORT_TTL_MS = 60_000;

let cachedPort: number | null = null;
let cachedAt = 0;
let isPortListenerRegistered = false;

interface PortOptions {
	forceRefresh?: boolean;
}

const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value);

const readPortFromEnv = (): number | null => {
	const envValue = window?.electron?.process?.env?.DIONE_BACKEND_PORT;
	if (!envValue) {
		return null;
	}
	const parsed = Number(envValue);
	return Number.isFinite(parsed) ? parsed : null;
};

const registerBackendPortListener = () => {
	if (isPortListenerRegistered) {
		return;
	}
	const ipcRenderer = window?.electron?.ipcRenderer;
	if (!ipcRenderer?.on) {
		return;
	}
	isPortListenerRegistered = true;
	ipcRenderer.on("backend-port-changed", (_event, nextPort?: number) => {
		if (typeof nextPort === "number" && Number.isFinite(nextPort)) {
			cachedPort = nextPort;
			cachedAt = Date.now();
			if (window?.electron?.process?.env) {
				window.electron.process.env.DIONE_BACKEND_PORT = String(nextPort);
			}
		} else {
			invalidateBackendPort();
		}
	});
};

const buildUrl = (input: string | URL, port: number) => {
	if (input instanceof URL) {
		return input.toString();
	}

	if (isAbsoluteUrl(input)) {
		return input;
	}

	const normalized = input.startsWith("/") ? input : `/${input}`;
	return `http://localhost:${port}${normalized}`;
};

export const invalidateBackendPort = () => {
	cachedPort = null;
	cachedAt = 0;
};

export const getBackendPort = async (
	options?: PortOptions,
): Promise<number> => {
	registerBackendPortListener();
	const shouldForceRefresh = options?.forceRefresh === true;
	const isCacheValid =
		cachedPort !== null && Date.now() - cachedAt < PORT_TTL_MS;

	if (!shouldForceRefresh && isCacheValid) {
		return cachedPort!;
	}

	const envPort = readPortFromEnv();
	if (envPort !== null) {
		cachedPort = envPort;
		cachedAt = Date.now();
		return envPort;
	}

	throw new Error("Backend port is not available");
};

interface FetchOptions {
	forceRefreshPort?: boolean;
}

export const apiFetch = async (
	path: string | URL,
	init?: RequestInit,
	opts?: FetchOptions,
): Promise<Response> => {
	const port = await getBackendPort({ forceRefresh: opts?.forceRefreshPort });
	return fetch(buildUrl(path, port), init);
};

export const apiJson = async <T>(
	path: string | URL,
	init?: RequestInit,
	opts?: FetchOptions,
): Promise<T> => {
	const response = await apiFetch(path, init, opts);
	if (!response.ok) {
		const error = new Error(`Request failed with status ${response.status}`);
		(error as Error & { response?: Response }).response = response;
		throw error;
	}
	return (await response.json()) as T;
};
