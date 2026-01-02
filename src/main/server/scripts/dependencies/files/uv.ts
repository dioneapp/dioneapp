import type { Server } from "socket.io";
import {
	checkCondaBinary,
	runInstall,
	runRemove,
} from "../utils/base-root";
import { addValue, removeKey, removeValue } from "../environment";
import path from "path";
import fs from "fs";

const depName = "uv";

export async function isInstalled(
	_binFolder: string,
): Promise<{ installed: boolean; reason: string }> {
	if (checkCondaBinary(depName)) {
		return { installed: true, reason: "installed" };
	}
	return { installed: false, reason: "not-installed" };
}

export async function install(
	binFolder: string,
	id: string,
	io: Server,
): Promise<{ success: boolean }> {
	const success = await runInstall(depName, ["-c", "conda-forge"], io, id, binFolder);
	if (success) {
		const cacheDir = path.join(binFolder, "cache", depName);
		const depFolder = path.join(binFolder, depName);
		if (!fs.existsSync(cacheDir)) {
			fs.mkdirSync(cacheDir, { recursive: true });
		}
		if (!fs.existsSync(depFolder)) {
			fs.mkdirSync(depFolder, { recursive: true });
		}
		addValue("UV_PYTHON_INSTALL_DIR", path.join(cacheDir));
		addValue("UV_CACHE_DIR", cacheDir);
		addValue("PIP_CACHE_DIR", path.join(binFolder, "cache", "pip"));
	}
	return { success };
}

export async function uninstall(binFolder: string): Promise<void> {
	await runRemove(depName, null as any);
	removeKey("UV_PYTHON_INSTALL_DIR");
	removeKey("UV_CACHE_DIR");
	removeKey("PIP_CACHE_DIR");
}
