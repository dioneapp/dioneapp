import fs from "node:fs";

// patch all snyc methods to avoid blocking the main thread
interface UninstallResult {
	success: boolean;
	error?: any;
}
function syncToAsync() {
	const original: any = {
		rmSync: fs.rmSync,
		unlinkSync: fs.unlinkSync,
		rmdirSync: fs.rmdirSync,
		writeFileSync: fs.writeFileSync,
		mkdirSync: fs.mkdirSync,
		renameSync: fs.renameSync,
		statSync: fs.statSync,
		readFileSync: fs.readFileSync,
		copyFileSync: fs.copyFileSync,
	};
	const asyncify = (fn: (...args: any[]) => Promise<any>) => {
		return (...args: any[]) => {
			// return the same calll but async
			fn(...args).catch(() => {});
			return undefined;
		};
	};
	fs.rmSync = asyncify(async (path) =>
		fs.promises.rm(path, { recursive: true, force: true }),
	);
	fs.unlinkSync = asyncify(async (path) =>
		fs.promises.unlink(path).catch(() => {}),
	);
	fs.rmdirSync = asyncify(async (path) =>
		fs.promises.rmdir(path).catch(() => {}),
	);
	fs.writeFileSync = asyncify(async (file, data) =>
		fs.promises.writeFile(String(file), data).catch(() => {}),
	);
	fs.mkdirSync = asyncify(async (path) =>
		fs.promises.mkdir(path, { recursive: true }).catch(() => {}),
	);
	fs.renameSync = asyncify(async (oldPath, newPath) =>
		fs.promises.rename(oldPath, newPath).catch(() => {}),
	);
	fs.copyFileSync = asyncify(async (src, dest) =>
		fs.promises.copyFile(src, dest).catch(() => {}),
	);
	return () => Object.assign(fs, original);
}

export async function safeUninstall(
	entry: any,
	binFolder: string,
): Promise<UninstallResult> {
	return asyncSandbox(async () => {
		const restore = syncToAsync(); // sync methods to async
		try {
			await entry.uninstall(binFolder);
			return { success: true };
		} catch (err) {
			return { success: false, error: err };
		} finally {
			restore();
		}
	});
}
function asyncSandbox<T>(fn: () => Promise<T> | T): Promise<T> {
	return new Promise((resolve) => {
		setImmediate(async () => {
			resolve(await fn());
		});
	});
}
