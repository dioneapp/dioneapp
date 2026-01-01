import type { Server } from "socket.io";
import {
	checkCondaBinary,
	runInstall,
	runRemove,

} from "../utils/base-root";

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
	}
	return { success };
}

export async function uninstall(_binFolder: string): Promise<void> {
	await runRemove(depName, null as any);
}
