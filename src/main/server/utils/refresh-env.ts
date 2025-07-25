import { execSync } from "child_process";
import os from "node:os";
import logger from "./logger";

function queryRegistry(path: string, value: string): string | null {
	try {
		const output = execSync(`reg query "${path}" /v ${value}`, {
			encoding: "utf8",
		});
		const match = output.match(new RegExp(`${value}\\s+REG_\\w+\\s+(.+)`));
		if (match && match[1]) return match[1].trim();
	} catch (e) {
		return null;
	}
	return null;
}

export function refreshPathFromSystem() {
	if (os.platform() !== "win32") return;

	const systemPath =
		queryRegistry(
			"HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Environment",
			"PATH",
		) || "";

	const userPath = queryRegistry("HKCU\\Environment", "PATH") || "";

	const combinedPath = systemPath + (userPath ? ";" + userPath : "");

	if (combinedPath) {
		process.env.PATH = combinedPath;
		logger.info(`PATH updated:\n${combinedPath}`);
	} else {
		logger.warn("No PATH found in HKLM or HKCU.");
	}
}
