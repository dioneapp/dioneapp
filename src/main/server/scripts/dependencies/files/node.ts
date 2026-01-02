import type { Server } from "socket.io";
import {
	checkCondaBinary,
	runInstall,
	runRemove,
} from "../utils/base-root";
import { addValue, removeKey, removeValue } from "../environment";
import path from "path";
import fs from "fs";

const depName = "node";
const condaPackageName = "nodejs";

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
	const success = await runInstall(condaPackageName, [], io, id, binFolder);
	if (success) {
		const cacheDir = path.join(binFolder, "cache", depName);
		const depFolder = path.join(binFolder, depName);
		if (!fs.existsSync(cacheDir)) {
			fs.mkdirSync(cacheDir, { recursive: true });
		}
		if (!fs.existsSync(depFolder)) {
			fs.mkdirSync(depFolder, { recursive: true });
		}
		addValue("PATH", path.join(depFolder));
		addValue("PATH", path.join(depFolder, "node_modules"));
		addValue("NPM_CONFIG_CACHE", path.join(cacheDir));
		addValue("NPM_CONFIG_STORE_DIR", path.join(binFolder, "cache", depName));
	}
	return { success };
}

export async function uninstall(binFolder: string): Promise<void> {
	await runRemove(condaPackageName, null as any);
	const depFolder = path.join(binFolder, depName);
	removeValue(path.join(depFolder), "PATH");
	removeValue(path.join(depFolder, "node_modules"), "PATH");
	removeKey("NPM_CONFIG_CACHE");
	removeKey("NPM_CONFIG_STORE_DIR");
}
