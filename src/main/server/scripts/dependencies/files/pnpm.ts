import type { Server } from "socket.io";
import {
	checkCondaBinary,
	runInstall,
	runRemove,

} from "../utils/base-root";
import { addValue, removeKey, removeValue } from "../environment";
import path from "path";
import fs from "fs";

const depName = "pnpm";

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

	io.to(id).emit("installDep", {
		type: "log",
		content: `Installing ${depName} via npm (in Conda environment)...`,
	});


	const success = await runInstall(depName, ["-c", "conda-forge"], io, id, binFolder);

	if (success) {
		io.to(id).emit("installDep", {
			type: "log",
			content: `${depName} installed successfully via npm`,
		});

		const cacheDir = path.join(binFolder, "cache", depName);
		const depFolder = path.join(binFolder, depName);
		if (!fs.existsSync(cacheDir)) {
			fs.mkdirSync(cacheDir, { recursive: true });
		}
		if (!fs.existsSync(depFolder)) {
			fs.mkdirSync(depFolder, { recursive: true });
		}
		addValue("PATH", path.join(depFolder));
		addValue("NPM_CONFIG_CACHE", path.join(cacheDir));
		addValue("XDG_CACHE_HOME", path.join(binFolder, "cache", depName, "cache"));
		addValue("XDG_STATE_HOME", path.join(binFolder, "cache", depName, "state"));
		addValue("XDG_DATA_HOME", path.join(binFolder, "cache", depName, "data"));
	}
	return { success };
}

export async function uninstall(binFolder: string): Promise<void> {
	await runRemove(depName, null as any);
	const depFolder = path.join(binFolder, depName);
	removeValue(path.join(depFolder), "PATH");
	removeKey("NPM_CONFIG_CACHE");
	removeKey("XDG_CACHE_HOME");
	removeKey("XDG_STATE_HOME");
	removeKey("XDG_DATA_HOME");
}
