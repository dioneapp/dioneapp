import fs from "node:fs";
import path from "node:path";
import type { Server } from "socket.io";
import { readDioneConfig } from "./dependencies/dependencies";
import { createVirtualEnvCommands } from "./dependencies/env-utils";
import { executeCommand, executeCommands, log } from "./process";

function findDirWithFile(rootDir: string, fileName: string): string | null {
	if (fs.existsSync(path.join(rootDir, fileName))) return rootDir;

	try {
		const entries = fs.readdirSync(rootDir, { withFileTypes: true });
		for (const entry of entries) {
			if (
				entry.isDirectory() &&
				![
					"node_modules",
					".git",
					".venv",
					"dist",
					"build",
					"__pycache__",
				].includes(entry.name)
			) {
				const found = findDirWithFile(path.join(rootDir, entry.name), fileName);
				if (found) return found;
			}
		}
	} catch {
		return null;
	}
	return null;
}

function getProjectEnv(dione: any) {
	const fromInstall = Array.isArray(dione.installation)
		? dione.installation.find((s: any) => s.env)?.env
		: null;

	const fromStart = Array.isArray(dione.start)
		? dione.start.find((s: any) => s.env)?.env
		: null;

	return fromInstall || fromStart || null;
}

export async function updateScript(
	workingDir: string,
	dioneFile: any,
	io: Server,
	id: string,
) {
	const dione = await readDioneConfig(dioneFile);
	const dependencies = Object.keys(dione.dependencies || {});
	let projectDir = workingDir;

	log(io, id, "INFO: Starting update process...");

	// Update git repository
	if (dependencies.includes("git")) {
		if (!fs.existsSync(path.join(projectDir, ".git"))) {
			try {
				const entries = fs.readdirSync(projectDir, { withFileTypes: true });
				const gitDir = entries.find(
					(entry) =>
						entry.isDirectory() &&
						fs.existsSync(path.join(projectDir, entry.name, ".git")),
				);
				if (gitDir) {
					projectDir = path.join(projectDir, gitDir.name);
					log(io, id, `INFO: Found git repository in ${gitDir.name}`);
				}
			} catch (error) {
				log(io, id, `WARN: Error searching for git repository: ${error}`);
			}
		}

		log(io, id, "INFO: pulling latest changes...");
		const gitPull = await executeCommand("git pull", io, projectDir, id);

		if (gitPull.code !== 0) {
			log(io, id, `ERROR: Git pull failed: ${gitPull.stderr}`);
			return false;
		}

		if (gitPull.stdout.includes("Already up to date.")) {
			log(io, id, "INFO: Code is already up to date.");
		} else {
			log(io, id, "INFO: Code updated successfully.");
		}
	}

	const projectEnv = getProjectEnv(dione);

	const envName = projectEnv?.name ?? "env";
	const envType = projectEnv?.type ?? "uv";
	const pythonVersion = projectEnv?.version ?? "";

	// Update Python dependencies
	const pyReqDir = findDirWithFile(projectDir, "requirements.txt");
	const pyTomlDir = findDirWithFile(projectDir, "pyproject.toml");
	const pyEnvDir = findDirWithFile(projectDir, "environment.yml");

	const pythonFilesDir = pyReqDir || pyTomlDir || pyEnvDir;
	const pythonCommands: string[] = [];

	let executionCwd = pythonFilesDir || workingDir;

	if (pythonFilesDir) {
		const envInRoot = fs.existsSync(path.join(workingDir, envName));

		if (envInRoot) {
			executionCwd = workingDir;
		} else {
			executionCwd = pythonFilesDir;
		}

		const relPath = path.relative(executionCwd, pythonFilesDir);

		const reqPath = path.join(relPath, "requirements.txt");
		const tomlPath = relPath === "" ? "." : relPath;
		const envYmlPath = path.join(relPath, "environment.yml");

		const absReq = path.join(pythonFilesDir, "requirements.txt");
		const absToml = path.join(pythonFilesDir, "pyproject.toml");
		const absEnvYml = path.join(pythonFilesDir, "environment.yml");

		if (fs.existsSync(absReq)) {
			if (envType === "uv") {
				pythonCommands.push(`uv pip install -U -r "${reqPath}"`);
			} else if (envType === "conda") {
				pythonCommands.push(`pip install -U -r "${reqPath}"`);
			} else {
				pythonCommands.push(`pip install -U -r "${reqPath}"`);
			}
		}
		if (fs.existsSync(absToml) && envType === "uv") {
			pythonCommands.push(`uv pip install -U "${tomlPath}"`);
		}
		if (fs.existsSync(absEnvYml) && envType === "conda") {
			pythonCommands.push(`conda env update --file "${envYmlPath}" --prune`);
		}
	}

	if (pythonCommands.length > 0) {
		log(
			io,
			id,
			`INFO: Updating Python dependencies (Context: ${executionCwd})...`,
		);
		try {
			const wrappedCommands = await createVirtualEnvCommands(
				envName,
				pythonCommands,
				executionCwd,
				pythonVersion,
				envType,
			);

			const result = await executeCommands(
				wrappedCommands,
				executionCwd,
				io,
				id,
				false,
			);

			if (result.cancelled) {
				log(io, id, "INFO: Update cancelled.");
				return false;
			}
		} catch (error: any) {
			log(io, id, `ERROR: Python dependency update failed: ${error.message}`);
			return false;
		}
	}

	// Update Node dependencies
	const nodeDir = findDirWithFile(projectDir, "package.json");
	const nodeCommands: string[] = [];

	if (nodeDir) {
		if (dependencies.includes("node")) {
			nodeCommands.push(`npm install`);
		}
		if (dependencies.includes("pnpm")) {
			nodeCommands.push(`pnpm install`);
		}
	}

	if (nodeCommands.length > 0 && nodeDir) {
		log(io, id, `INFO: Updating Node dependencies in ${nodeDir}...`);
		try {
			const result = await executeCommands(
				nodeCommands,
				nodeDir,
				io,
				id,
				false,
			);

			if (result.cancelled) {
				log(io, id, "INFO: Update cancelled.");
				return false;
			}
		} catch (error: any) {
			log(io, id, `ERROR: Node dependency update failed: ${error.message}`);
			return false;
		}
	}

	// Update git large files
	if (dependencies.includes("git_lfs")) {
		await executeCommand("git lfs pull", io, projectDir, id);
	}

	if (pythonCommands.length === 0 && nodeCommands.length === 0) {
		log(
			io,
			id,
			"INFO: No standard dependency files found. Skipping dependency update.",
		);
		return true;
	}

	log(io, id, "INFO: Dependencies updated successfully.");
	return true;
}
