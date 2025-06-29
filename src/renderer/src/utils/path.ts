export const joinPath = (...paths: string[]): string => {
	// use platform-specific path separators for display
	const platform =
		(navigator as any).userAgentData?.platform || navigator.platform || "";
	const isWindows = platform.toLowerCase().includes("win");
	const separator = isWindows ? "\\" : "/";
	const escapedSeparator = separator === "\\" ? "\\\\" : separator;
	return paths
		.join(separator)
		.replace(new RegExp(`[${escapedSeparator}]+`, "g"), separator);
};

export const normalizePath = (path: string): string => {
	// normalize path separators
	return path.replace(/[\\\/]+/g, "/");
};
