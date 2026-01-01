import type { Server } from "socket.io";
import {
	checkCondaBinary,
	runInstall,
	runRemove,
} from "../utils/base-root";

const depName = "git";

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
	const success = await runInstall(depName, [], io, id, binFolder);
	return { success };
}

export async function uninstall(_binFolder: string): Promise<void> {
	await runRemove(depName, null as any);
}
