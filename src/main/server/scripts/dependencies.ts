import { Server } from "socket.io";
import { execute } from "./execute";
import logger from "../utils/logger";
import * as semver from "semver";
import { DependencyChecks } from "./types";

// check dependencies commands
const dependencyCheckers: { [key: string]: DependencyChecks } = {
	git: {
		command: "git --version",
		versionRegex: /git version (\d+\.\d+\.\d+)/,
	},
	python: {
		command: "python --version",
		altCommand: "python3 --version",
		versionRegex: /Python (\d+\.\d+\.\d+)/,
	},
	conda: {
		command: "conda --version",
		versionRegex: /conda (\d+\.\d+\.\d+)/,
	},
	node: {
		command: "npm --version",
		versionRegex: /(\d+\.\d+\.\d+)/,
	},
};
// check if dependency is installed
export const checkDependency = async (
	depName: string,
	requiredVersion: string,
	io: Server,
	workingDir: string,
): Promise<string> => {
	const checker = dependencyCheckers[depName];
	if (!checker) {
		io.emit("installUpdate", {
			type: "error",
			content: `Error: Dependency '${depName}' is not supported`,
		});
		logger.error(`Error: Dependency '${depName}' is not supported`);
	}

	let version: string | null = null;
	let output: string | null = null;
	try {
		output =
			(await execute(checker.command, io, workingDir, "dependency")) || "";
		const match = output.match(checker.versionRegex);
		if (match) version = match[1];

		// try alt command
		if (!version && checker.altCommand) {
			output =
				(await execute(checker.altCommand, io, workingDir, "dependency")) || "";
			const altMatch = output.match(checker.versionRegex);
			if (altMatch) version = altMatch[1];
		}
	} catch (error) {
		// error checking
		io.emit("installUpdate", {
			type: "error",
			content: `Error checking dependency '${depName}': ${error}`,
		});
		logger.error(`Error checking dependency '${depName}': ${error}`);
	}
	if ((!version && !output) || output === "false") {
		// dependency not found
		logger.error(`Error: Dependency '${depName}' not found`);
		return "not_found";
	}
	if (!semver.satisfies(version, requiredVersion)) {
		// version is not exact
		io.emit("installUpdate", {
			type: "error",
			content: `ERROR: Dependency '${depName}' version ${version} does not satisfy ${requiredVersion}`,
		});
		logger.error(
			`Error: Dependency '${depName}' version ${version} does not satisfy ${requiredVersion}`,
		);
	}
	if (requiredVersion === "latest" && output) {
		// dependency exists and the version does not matter
		io.emit("installUpdate", {
			type: "log",
			content: `✓ Dependency '${depName}' found.`,
		});
	}
	if (semver.satisfies(version, requiredVersion)) {
		// version is exact
		io.emit("installUpdate", {
			type: "log",
			content: `✓ Dependency '${depName}' found with version '${requiredVersion}'.`,
		});
	}

	return "success";
};
