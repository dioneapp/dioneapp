import fs from "node:fs";
import path from "node:path";
import { app } from "electron";
import express from "express";
import { fileTypeFromBuffer } from "file-type";
import { readConfig } from "../../config";
import logger from "../utils/logger";

const router = express.Router();

router.use(express.json({ limit: "20mb" }));

const fallbackRoot = app.isPackaged
	? path.join(path.dirname(app.getPath("exe")))
	: path.join(process.cwd());

const APP_FOLDER_NAME = "apps";

const mediaMimeMap: Record<string, string> = {
	"3g2": "video/3gpp2",
	"3gp": "video/3gpp",
	aac: "audio/aac",
	aif: "audio/aiff",
	aifc: "audio/aiff",
	aiff: "audio/aiff",
	amr: "audio/amr",
	apng: "image/apng",
	avi: "video/x-msvideo",
	avif: "image/avif",
	bmp: "image/bmp",
	flac: "audio/flac",
	flv: "video/x-flv",
	gif: "image/gif",
	heic: "image/heic",
	heif: "image/heif",
	ico: "image/x-icon",
	jfif: "image/jpeg",
	jpeg: "image/jpeg",
	jpg: "image/jpeg",
	m4a: "audio/mp4",
	m4b: "audio/mp4",
	m4p: "audio/mp4",
	m4v: "video/x-m4v",
	mkv: "video/x-matroska",
	mov: "video/quicktime",
	mp3: "audio/mpeg",
	mp4: "video/mp4",
	mpg: "video/mpeg",
	mpeg: "video/mpeg",
	oga: "audio/ogg",
	ogg: "audio/ogg",
	opus: "audio/ogg",
	png: "image/png",
	svg: "image/svg+xml",
	tif: "image/tiff",
	tiff: "image/tiff",
	weba: "audio/webm",
	webm: "video/webm",
	webp: "image/webp",
	wav: "audio/wav",
	wave: "audio/wav",
};

type FileEntry = {
	name: string;
	type: "file" | "directory";
	relativePath: string;
	absolutePath: string;
	size: number | null;
	modified: number;
};

const sanitizeAppName = (name: string) => {
	return name
		.replace(/[<>:"/\\|?*]/g, "")
		.replace(/[\x00-\x1F]/g, "")
		.replace(/\s+/g, "-")
		.trim();
};

const normalizeRelative = (value: string) => {
	const sanitized = value.replace(/\\/g, "/");
	const parts = sanitized.split("/").filter(Boolean);
	return parts.join("/");
};

export const joinRelativePath = (parent: string | undefined, name: string) => {
	const sanitizedParent = parent ? normalizeRelative(parent) : "";
	return sanitizedParent ? `${sanitizedParent}/${name}` : name;
};

const getParentRelative = (value: string) => {
	const normalized = normalizeRelative(value);
	if (!normalized) return "";
	const idx = normalized.lastIndexOf("/");
	return idx === -1 ? "" : normalized.slice(0, idx);
};

export const isValidEntryName = (name: string) => {
	if (typeof name !== "string") return false;
	const trimmed = name.trim();
	if (!trimmed) return false;
	return !/[<>:"/\\|?*\x00-\x1F]/.test(trimmed);
};

const toFileEntry = async (
	root: string,
	absolutePath: string,
): Promise<FileEntry> => {
	const stats = await fs.promises.stat(absolutePath);
	return {
		name: path.basename(absolutePath),
		type: stats.isDirectory() ? "directory" : "file",
		relativePath: toRelativePath(root, absolutePath),
		absolutePath,
		size: stats.isFile() ? stats.size : null,
		modified: stats.mtimeMs,
	};
};

const createNameVariants = (value: string) => {
	const trimmed = value.trim();
	if (!trimmed) return [] as string[];
	const variants = new Set<string>();
	variants.add(trimmed);
	variants.add(trimmed.replace(/\s+/g, "-"));
	variants.add(sanitizeAppName(trimmed));
	return Array.from(variants).filter(Boolean);
};

const buildCandidateNames = (rawName: string) => {
	const trimmed = rawName.trim();
	const spaceSanitized = trimmed.replace(/\s+/g, "-");
	const strictSanitized = sanitizeAppName(rawName);
	const set = new Set<string>([trimmed, spaceSanitized, strictSanitized]);
	return Array.from(set).filter(Boolean);
};

const buildNameCandidateSet = (names: string[]) => {
	const set = new Set<string>();
	for (const name of names) {
		for (const variant of createNameVariants(name)) {
			set.add(variant.toLowerCase());
		}
	}
	return set;
};

const matchNameCandidate = (value: unknown, candidates: Set<string>) => {
	if (typeof value !== "string") return false;
	return createNameVariants(value).some((variant) =>
		candidates.has(variant.toLowerCase()),
	);
};

const matchIdCandidate = (value: unknown, candidateIds: Set<string>) => {
	if (candidateIds.size === 0) return false;
	if (typeof value !== "string") return false;
	const trimmed = value.trim().toLowerCase();
	if (!trimmed) return false;
	return candidateIds.has(trimmed);
};

const getAppBaseDirectories = (): string[] => {
	const config = readConfig();
	const directories: string[] = [];
	if (config?.defaultInstallFolder) {
		directories.push(
			path.resolve(config.defaultInstallFolder, APP_FOLDER_NAME),
		);
	}
	const fallbackApps = path.resolve(fallbackRoot, APP_FOLDER_NAME);
	if (
		!directories.some((dir) => dir.toLowerCase() === fallbackApps.toLowerCase())
	) {
		directories.push(fallbackApps);
	}
	return directories;
};

const inspectDirectoryMetadata = (
	base: string,
	dirName: string,
	candidateNames: Set<string>,
	candidateIds: Set<string>,
) => {
	let nameMatch = false;
	const dirPath = path.join(base, dirName);

	const appInfoPath = path.join(dirPath, "app_info.json");
	if (fs.existsSync(appInfoPath)) {
		try {
			const raw = fs.readFileSync(appInfoPath, "utf8");
			const appInfo = JSON.parse(raw) as { id?: string; name?: string };
			if (matchIdCandidate(appInfo?.id, candidateIds)) {
				return "id" as const;
			}
			if (matchNameCandidate(appInfo?.name, candidateNames)) {
				nameMatch = true;
			}
		} catch (error) {
			const message = (error as Error)?.message || "Unknown error";
			logger.warn(`Failed to parse app_info.json for ${dirPath}: ${message}`);
		}
	}

	const dionePath = path.join(dirPath, "dione.json");
	if (fs.existsSync(dionePath)) {
		try {
			const raw = fs.readFileSync(dionePath, "utf8");
			const dione = JSON.parse(raw);
			const potentialIds = [
				dione?.id,
				dione?.appId,
				dione?.app_id,
				dione?.metadata?.id,
				dione?.info?.id,
				dione?.script?.id,
				dione?.package?.id,
				dione?.app?.id,
				dione?.slug?.id,
				dione?.script_id,
			];
			if (potentialIds.some((value) => matchIdCandidate(value, candidateIds))) {
				return "id" as const;
			}
			const potentialNames = [
				dione?.name,
				dione?.info?.name,
				dione?.metadata?.name,
				dione?.app?.name,
				dione?.script?.name,
				dione?.slug,
			];
			if (
				potentialNames.some((value) =>
					matchNameCandidate(value, candidateNames),
				)
			) {
				nameMatch = true;
			}
		} catch (error) {
			const message = (error as Error)?.message || "Unknown error";
			logger.warn(`Failed to parse dione.json for ${dirPath}: ${message}`);
		}
	}

	return nameMatch ? ("name" as const) : null;
};

const resolveAppRoot = (rawName: string, appId?: string) => {
	if (!rawName) {
		throw new Error("Application name is required");
	}

	const appBases = getAppBaseDirectories();
	const candidates = buildCandidateNames(rawName);
	const candidateNames = buildNameCandidateSet([...candidates, rawName]);
	const candidateIds = new Set<string>();
	if (appId) {
		candidateIds.add(appId.trim().toLowerCase());
	}

	const normalizedMatches: Array<{ base: string; dir: string }> = [];
	const normalizedPaths = new Set<string>();

	for (const appBase of appBases) {
		if (!fs.existsSync(appBase)) {
			continue;
		}

		let dirEntries: fs.Dirent[] = [];
		try {
			dirEntries = fs.readdirSync(appBase, { withFileTypes: true });
		} catch (error) {
			logger.error("Failed to read applications directory", error);
			continue;
		}

		const directories = dirEntries.filter((entry) => entry.isDirectory());

		for (const candidate of candidates) {
			const candidatePath = path.resolve(appBase, candidate);
			if (fs.existsSync(candidatePath)) {
				return candidatePath;
			}
		}

		for (const entry of directories) {
			const resolvedPath = path.resolve(appBase, entry.name);
			if (!fs.existsSync(resolvedPath)) continue;

			const metadataMatch = inspectDirectoryMetadata(
				appBase,
				entry.name,
				candidateNames,
				candidateIds,
			);
			if (metadataMatch === "id") {
				return resolvedPath;
			}

			if (
				metadataMatch === "name" ||
				matchNameCandidate(entry.name, candidateNames)
			) {
				const key = `${appBase.toLowerCase()}::${entry.name.toLowerCase()}`;
				if (!normalizedPaths.has(key)) {
					normalizedPaths.add(key);
					normalizedMatches.push({ base: appBase, dir: entry.name });
				}
			}
		}
	}

	if (normalizedMatches.length > 0) {
		const { base, dir } = normalizedMatches[0];
		return path.resolve(base, dir);
	}

	throw new Error("Application directory not found");
};

const resolveWithinRoot = (root: string, relativePath?: string) => {
	const normalizedRelative = relativePath
		? normalizeRelative(relativePath).split("/").join(path.sep)
		: "";
	const targetPath = path.resolve(root, normalizedRelative);
	const relative = path.relative(root, targetPath);
	if (relative.startsWith("..") || path.isAbsolute(relative)) {
		throw new Error("Path is outside application root");
	}
	return targetPath;
};

const toRelativePath = (root: string, absolute: string) => {
	const relative = path.relative(root, absolute);
	return relative.split(path.sep).join("/");
};

router.get("/root/:appName", async (req, res) => {
	try {
		const appName = decodeURIComponent(req.params.appName);
		const appId =
			typeof req.query.appId === "string" ? req.query.appId : undefined;
		const appRoot = resolveAppRoot(appName, appId);

		if (!fs.existsSync(appRoot)) {
			return res.status(404).send({ error: "Application directory not found" });
		}

		return res.send({ rootPath: appRoot });
	} catch (error: any) {
		const message = error?.message || "Invalid request";
		const status = message === "Application directory not found" ? 404 : 400;
		if (status === 404) {
			logger.warn(`App root not found for ${req.params.appName}`);
		} else {
			logger.error("Failed to resolve app root", error);
		}
		return res.status(status).send({ error: message });
	}
});

router.get("/list/:appName", async (req, res) => {
	try {
		const appName = decodeURIComponent(req.params.appName);
		const appId =
			typeof req.query.appId === "string" ? req.query.appId : undefined;
		const appRoot = resolveAppRoot(appName, appId);

		const dirParam = typeof req.query.dir === "string" ? req.query.dir : "";
		const targetDir = resolveWithinRoot(appRoot, dirParam);

		if (!fs.existsSync(targetDir)) {
			return res.status(404).send({ error: "Directory not found" });
		}

		const entries = await fs.promises.readdir(targetDir, {
			withFileTypes: true,
		});

		const mappedEntries: FileEntry[] = await Promise.all(
			entries.map((entry) =>
				toFileEntry(appRoot, path.join(targetDir, entry.name)),
			),
		);

		mappedEntries.sort((a, b) => {
			if (a.type === b.type) {
				return a.name.localeCompare(b.name);
			}
			return a.type === "directory" ? -1 : 1;
		});

		return res.send({ entries: mappedEntries });
	} catch (error: any) {
		const message = error?.message || "Failed to list directory";
		const status =
			message === "Application directory not found" ||
			message === "Directory not found"
				? 404
				: 400;
		if (status === 404) {
			logger.warn(
				`Directory lookup failed for ${req.params.appName}: ${message}`,
			);
		} else {
			logger.error("Failed to list directory", error);
		}
		return res.status(status).send({ error: message });
	}
});

router.get("/content/:appName", async (req, res) => {
	try {
		const appName = decodeURIComponent(req.params.appName);
		const appId =
			typeof req.query.appId === "string" ? req.query.appId : undefined;
		const appRoot = resolveAppRoot(appName, appId);

		const fileParam = typeof req.query.file === "string" ? req.query.file : "";
		if (!fileParam) {
			return res.status(400).send({ error: "File path is required" });
		}

		const targetFile = resolveWithinRoot(appRoot, fileParam);

		if (!fs.existsSync(targetFile)) {
			return res.status(404).send({ error: "File not found" });
		}

		const stats = await fs.promises.stat(targetFile);
		if (!stats.isFile()) {
			return res.status(400).send({ error: "Requested path is not a file" });
		}

		const buffer = await fs.promises.readFile(targetFile);
		const extension = path.extname(targetFile).slice(1).trim().toLowerCase();

		let mimeType = extension ? mediaMimeMap[extension] : undefined;
		let canPreview = Boolean(mimeType);

		if (!canPreview) {
			try {
				const detectedType = await fileTypeFromBuffer(buffer);
				if (detectedType && typeof detectedType.mime === "string") {
					const detectedMime = detectedType.mime.toLowerCase();
					const isMedia =
						detectedMime.startsWith("image/") ||
						detectedMime.startsWith("audio/") ||
						detectedMime.startsWith("video/");
					if (isMedia) {
						mimeType = detectedType.mime;
						canPreview = true;
						if (!extension && detectedType.ext) {
							const detectedExtension = detectedType.ext.toLowerCase();
							const mappedMime = mediaMimeMap[detectedExtension];
							if (!mimeType && mappedMime) {
								mimeType = mappedMime;
							}
						}
					}
				}
			} catch (error) {
				const message = (error as Error)?.message || "Unknown error";
				logger.warn(
					`Media type detection failed for ${targetFile}: ${message}`,
				);
			}

			if (!canPreview && buffer.length >= 12) {
				const riffHeader = buffer.subarray(0, 4).toString("ascii");
				const waveHeader = buffer.subarray(8, 12).toString("ascii");
				if (riffHeader === "RIFF" && waveHeader === "WAVE") {
					mimeType = "audio/wav";
					canPreview = true;
				}
			}
		}

		if (canPreview && mimeType) {
			return res.send({
				content: buffer.toString("base64"),
				encoding: "base64",
				mimeType,
			});
		}
		const sample = buffer.subarray(0, 1024);
		const looksBinary = sample.includes(0);

		if (looksBinary) {
			const fallbackMime = extension ? mediaMimeMap[extension] : undefined;
			const resolvedMime = mimeType || fallbackMime;
			if (
				resolvedMime &&
				(resolvedMime.startsWith("image/") ||
					resolvedMime.startsWith("audio/") ||
					resolvedMime.startsWith("video/"))
			) {
				return res.send({
					content: buffer.toString("base64"),
					encoding: "base64",
					mimeType: resolvedMime,
				});
			}
			return res.status(415).send({ error: "Binary files are not supported" });
		}

		return res.send({
			content: buffer.toString("utf8"),
			encoding: "utf8",
		});
	} catch (error: any) {
		const message = error?.message || "Failed to read file";
		const notFoundMessages = [
			"Application directory not found",
			"File not found",
			"Requested path is not a file",
		];
		const status = notFoundMessages.includes(message)
			? 404
			: message === "Binary files are not supported"
				? 415
				: 400;
		if (status === 404) {
			logger.warn(`File access failed for ${req.params.appName}: ${message}`);
		} else if (status === 415) {
			logger.info(`Binary file access prevented for ${req.params.appName}`);
		} else {
			logger.error("Failed to read file content", error);
		}
		return res.status(status).send({ error: message });
	}
});

router.post("/save/:appName", async (req, res) => {
	try {
		const appName = decodeURIComponent(req.params.appName);
		const appId =
			typeof req.query.appId === "string" ? req.query.appId : undefined;
		const appRoot = resolveAppRoot(appName, appId);

		const { file, content } = req.body ?? {};

		if (typeof file !== "string") {
			return res.status(400).send({ error: "File path is required" });
		}

		const targetFile = resolveWithinRoot(appRoot, file);
		const stats = await fs.promises.stat(targetFile).catch(() => null);

		if (!stats || !stats.isFile()) {
			return res.status(400).send({ error: "Target file does not exist" });
		}

		await fs.promises.writeFile(targetFile, content ?? "", "utf8");

		return res.send({ success: true });
	} catch (error: any) {
		const message = error?.message || "Failed to save file";
		const status =
			message === "Application directory not found" ||
			message === "Target file does not exist"
				? 404
				: 400;
		if (status === 404) {
			logger.warn(`Save rejected for ${req.params.appName}: ${message}`);
		} else {
			logger.error("Failed to save file", error);
		}
		return res.status(status).send({ error: message });
	}
});

router.post("/create/:appName", async (req, res) => {
	try {
		const appName = decodeURIComponent(req.params.appName);
		const appId =
			typeof req.query.appId === "string" ? req.query.appId : undefined;
		const appRoot = resolveAppRoot(appName, appId);

		const { parent, name, type } = req.body ?? {};
		if (type !== "file" && type !== "directory") {
			return res
				.status(400)
				.send({ error: "Entry type must be file or directory" });
		}
		if (!isValidEntryName(name)) {
			return res.status(400).send({ error: "Invalid entry name" });
		}

		const parentRelative =
			typeof parent === "string" ? normalizeRelative(parent) : "";
		const parentAbsolute = resolveWithinRoot(appRoot, parentRelative);
		const parentStats = await fs.promises
			.stat(parentAbsolute)
			.catch(() => null);
		if (!parentStats || !parentStats.isDirectory()) {
			return res.status(400).send({ error: "Parent directory does not exist" });
		}

		const entryRelative = joinRelativePath(parentRelative, name.trim());
		const entryAbsolute = resolveWithinRoot(appRoot, entryRelative);
		const exists = await fs.promises
			.stat(entryAbsolute)
			.then(() => true)
			.catch(() => false);
		if (exists) {
			return res.status(409).send({ error: "Entry already exists" });
		}

		if (type === "directory") {
			await fs.promises.mkdir(entryAbsolute, { recursive: false });
		} else {
			await fs.promises.writeFile(entryAbsolute, "", "utf8");
		}

		const entry = await toFileEntry(appRoot, entryAbsolute);
		return res.send({ entry });
	} catch (error: any) {
		const message = error?.message || "Failed to create entry";
		logger.error("Failed to create filesystem entry", error);
		const status =
			message === "Application directory not found"
				? 404
				: message === "Entry already exists"
					? 409
					: 400;
		return res.status(status).send({ error: message });
	}
});

router.post("/rename/:appName", async (req, res) => {
	try {
		const appName = decodeURIComponent(req.params.appName);
		const appId =
			typeof req.query.appId === "string" ? req.query.appId : undefined;
		const appRoot = resolveAppRoot(appName, appId);

		const { path: pathParam, name } = req.body ?? {};
		if (typeof pathParam !== "string") {
			return res.status(400).send({ error: "Source path is required" });
		}
		if (!isValidEntryName(name)) {
			return res.status(400).send({ error: "Invalid entry name" });
		}

		const currentRelative = normalizeRelative(pathParam);
		if (!currentRelative) {
			return res.status(400).send({ error: "Cannot rename workspace root" });
		}

		const currentAbsolute = resolveWithinRoot(appRoot, currentRelative);
		const currentStats = await fs.promises
			.stat(currentAbsolute)
			.catch(() => null);
		if (!currentStats) {
			return res.status(404).send({ error: "Source entry not found" });
		}

		const parentRelative = getParentRelative(currentRelative);
		const targetRelative = joinRelativePath(parentRelative, name.trim());
		const targetAbsolute = resolveWithinRoot(appRoot, targetRelative);

		const sameLocation =
			currentAbsolute.toLowerCase() === targetAbsolute.toLowerCase();
		if (!sameLocation) {
			const targetExists = await fs.promises
				.stat(targetAbsolute)
				.then(() => true)
				.catch(() => false);
			if (targetExists) {
				return res
					.status(409)
					.send({ error: "A file or folder with that name already exists" });
			}
		}

		await fs.promises.rename(currentAbsolute, targetAbsolute);
		const entry = await toFileEntry(appRoot, targetAbsolute);
		return res.send({ entry, previousPath: currentRelative });
	} catch (error: any) {
		const message = error?.message || "Failed to rename entry";
		logger.error("Failed to rename filesystem entry", error);
		const status =
			message === "Application directory not found"
				? 404
				: message === "Source entry not found"
					? 404
					: message === "A file or folder with that name already exists"
						? 409
						: message === "Cannot rename workspace root"
							? 400
							: 400;
		return res.status(status).send({ error: message });
	}
});

router.post("/delete/:appName", async (req, res) => {
	try {
		const appName = decodeURIComponent(req.params.appName);
		const appId =
			typeof req.query.appId === "string" ? req.query.appId : undefined;
		const appRoot = resolveAppRoot(appName, appId);

		const { path: pathParam } = req.body ?? {};
		if (typeof pathParam !== "string") {
			return res.status(400).send({ error: "Path is required" });
		}

		const relative = normalizeRelative(pathParam);
		if (!relative) {
			return res.status(400).send({ error: "Cannot delete workspace root" });
		}

		const targetAbsolute = resolveWithinRoot(appRoot, relative);
		const stats = await fs.promises.stat(targetAbsolute).catch(() => null);
		if (!stats) {
			return res.status(404).send({ error: "Entry not found" });
		}

		// remove file or directory (recursive for directories)
		await fs.promises.rm(targetAbsolute, {
			recursive: stats.isDirectory(),
			force: false,
		});

		return res.send({ success: true });
	} catch (error: any) {
		const message = error?.message || "Failed to delete entry";
		logger.error("Failed to delete filesystem entry", error);
		const status = message === "Application directory not found" ? 404 : 400;
		return res.status(status).send({ error: message });
	}
});

export default router;
