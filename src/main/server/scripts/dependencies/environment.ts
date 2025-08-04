import fs from "fs";
import path from "path";
import { app } from "electron";
import { getOS } from "./utils/system";

const root = process.cwd();
const binFolder = path.join(root, "bin");
const ENVIRONMENT = path.join(binFolder, "VARIABLES");
const separator = getOS() === "windows" ? ";" : ":";

function splitKeyValue(line: string): [string, string] | null {
	const index = line.indexOf("=");
	if (index === -1) return null;
	const key = line.slice(0, index).trim();
	const value = line.slice(index + 1).trim();
	return [key, value];
}

export function addValue(key: string, value: string) {
	if (!fs.existsSync(ENVIRONMENT)) {
		initDefaultEnv();
	}

	const content = fs.readFileSync(ENVIRONMENT, "utf8");
	const lines = content.split("\n").filter((line) => line.trim() !== "");

	let found = false;
	const newLines = lines.map((line) => {
		const kv = splitKeyValue(line);
		if (!kv) return line;
		const [k, currentValue] = kv;
		if (k === key) {
			found = true;
			if (currentValue.split(separator).includes(value)) {
				return line;
			}
			return `${key}=${currentValue}${separator}${value}`;
		}
		return line;
	});

	if (!found) {
		newLines.push(`${key}=${value}`);
	}

	fs.writeFileSync(ENVIRONMENT, newLines.join("\n") + "\n", "utf8");
}

export function removeKey(key: string) {
	if (!fs.existsSync(ENVIRONMENT)) return;

	const content = fs.readFileSync(ENVIRONMENT, "utf8");
	const lines = content.split("\n").filter((line) => {
		const kv = splitKeyValue(line);
		if (!kv) return true;
		return kv[0] !== key;
	});

	fs.writeFileSync(ENVIRONMENT, lines.join("\n"), { encoding: "utf8" });
}

export function removeValue(valueToRemove: string, key: string) {
	if (!fs.existsSync(ENVIRONMENT)) return;

	const content = fs.readFileSync(ENVIRONMENT, "utf8");
	const lines = content.split("\n").filter((line) => line.trim() !== "");

	let updated = false;

	const normalizedToRemove = path.normalize(valueToRemove).toLowerCase();

	const newLines = lines.map((line) => {
		const kv = splitKeyValue(line);
		if (!kv) return line;

		const [k, v] = kv;

		if (k === key) {
			const parts = v.split(separator).filter((part) => {
				const normalizedPart = path.normalize(part.trim()).toLowerCase();
				return normalizedPart !== normalizedToRemove;
			});
			updated = true;
			return `${key}=${parts.join(separator)}`;
		}

		return line;
	});

	if (updated) {
		fs.writeFileSync(ENVIRONMENT, newLines.join("\n") + "\n", "utf8");
	}
}

export function getValue(key: string): string | null {
	if (!fs.existsSync(ENVIRONMENT)) return null;

	const content = fs.readFileSync(ENVIRONMENT, "utf8");
	const lines = content.split("\n");

	for (const line of lines) {
		const kv = splitKeyValue(line);
		if (!kv) continue;
		const [k, v] = kv;
		if (k === key) return v || null;
	}

	return null;
}

export function getAllValues(): Record<string, string> {
	if (!fs.existsSync(ENVIRONMENT)) return {};

	const content = fs.readFileSync(ENVIRONMENT, "utf8");
	const lines = content.split("\n").filter((line) => line.trim() !== "");

	const values: Record<string, string> = {};
	for (const line of lines) {
		const kv = splitKeyValue(line);
		if (!kv) continue;
		const [key, value] = kv;
		values[key] = value;
	}

	return values;
}

export function initDefaultEnv() {
	if (!fs.existsSync(ENVIRONMENT)) {
		fs.writeFileSync(ENVIRONMENT, "");
	}

	const currentEnv = getAllValues();
	const cacheFolder = path.join(binFolder, "cache");

	if (getOS() === "windows") {
		// windows
		const appData = app.getPath("appData");
		const basicEnv = [
			"C:\\Windows\\System32",
			"C:\\Windows",
			"C:\\Windows\\System32\\Wbem",
			"C:\\Windows\\System32\\WindowsPowerShell\\v1.0",
			`${path.join(appData, "Local", "Microsoft", "WindowsApps")}`,
		];

		// check if have basics paths
		basicEnv.forEach((basicPath) => {
			const currentPath = currentEnv.PATH || "";
			const pathParts = currentPath.split(separator).map((p) => p.trim());

			const pathExists = pathParts.some(
				(part) =>
					path.normalize(part).toLowerCase() ===
					path.normalize(basicPath).toLowerCase(),
			);

			if (!pathExists) {
				addValue("PATH", basicPath);
			}
		});

		if (!currentEnv.ComSpec) {
			addValue("ComSpec", "C:\\Windows\\System32\\cmd.exe");
		}

		if (!currentEnv.SystemRoot) {
			addValue("SystemRoot", "C:\\Windows");
		}

		if (!currentEnv.PATHEXT) {
			addValue(
				"PATHEXT",
				".COM;.EXE;.BAT;.CMD;.VBS;.VBE;.JS;.JSE;.WSF;.WSH;.MSC",
			);
		}

		if (!currentEnv.HF_HUB_CACHE) {
			addValue("HF_HUB_CACHE", path.join(cacheFolder));
		}

		if (!currentEnv.HF_HOME) {
			addValue("HF_HOME", path.join(cacheFolder));
		}

		if (!currentEnv.TRANSFORMERS_CACHE) {
			addValue("TRANSFORMERS_CACHE", path.join(cacheFolder));
		}

		if (!currentEnv.TEMP) {
			addValue("TEMP", path.join(cacheFolder));
		}
	} else {
		// linux/macos
		const basicPath =
			"/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin";
		const basicPaths = basicPath.split(":");

		// check if have basics paths
		basicPaths.forEach((basicPathPart) => {
			const currentPath = currentEnv.PATH || "";
			const pathParts = currentPath.split(separator).map((p) => p.trim());

			if (!pathParts.includes(basicPathPart)) {
				addValue("PATH", basicPathPart);
			}
		});

		if (!currentEnv.HF_HUB_CACHE) {
			addValue("HF_HUB_CACHE", path.join(cacheFolder));
		}

		if (!currentEnv.HF_HOME) {
			addValue("HF_HOME", path.join(cacheFolder));
		}

		if (!currentEnv.TRANSFORMERS_CACHE) {
			addValue("TRANSFORMERS_CACHE", path.join(cacheFolder));
		}
	}
}
