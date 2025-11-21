import { readConfig } from "@/config";
import { app } from "electron";
import fs from "node:fs";
import path from "node:path";

export interface ScriptPathInfo {
	sanitizedName: string;
	installRoot: string;
	appsDir: string;
	workingDir: string;
	dioneFile: string;
}

const sanitizeWhitespace = (name: string) => name.trim().replace(/\s+/g, "-");

const getRootDirectory = () =>
	app.isPackaged
		? path.join(path.dirname(app.getPath("exe")))
		: path.join(process.cwd());

export const sanitizeScriptName = (name: string) => sanitizeWhitespace(name);

export const getInstallRoot = () => {
	const config = readConfig();
	return config?.defaultInstallFolder || getRootDirectory();
};

export const getAppsRoot = () => path.join(getInstallRoot(), "apps");

export const ensureDirectory = async (directory: string) => {
	await fs.promises.mkdir(directory, { recursive: true });
	return directory;
};

export const ensureAppsRootExists = async () => ensureDirectory(getAppsRoot());

export const resolveScriptPaths = (name: string): ScriptPathInfo => {
	const sanitizedName = sanitizeWhitespace(name);
	const installRoot = getInstallRoot();
	const appsDir = path.join(installRoot, "apps");
	const workingDir = path.join(appsDir, sanitizedName);

	return {
		sanitizedName,
		installRoot,
		appsDir,
		workingDir,
		dioneFile: path.join(workingDir, "dione.json"),
	};
};
