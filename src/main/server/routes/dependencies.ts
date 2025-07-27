import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import express from "express";
import type { Server } from "socket.io";
import { readConfig } from "../../config";
import { killProcess } from "../scripts/process";
import logger from "../utils/logger";
import { installDependency, inUseDependencies, uninstallDependency } from "../scripts/dependencies/dependencies";

export const createDependenciesRouter = (io: Server) => {
	const router = express.Router();
	router.use(express.json());

	// router.get("/check", async (req, res) => {
	// 	try {
	// 		const dependencies = req.headers.dependencies;
	// 		logger.info(`Checking dependencies: ${dependencies.join(", ")}`);
	// 		const response = await checkDependencies(dependencies);
	// 		res.send(response).status(200);
	// 		logger.info(`Dependencies status: ${JSON.stringify(response)}`);
	// 	} catch (error) {
	// 		res.status(400).send({ error: "Failed to check dependencies" });
	// 	}
	// });

	router.post("/install/:id", async (req, res) => {
		const { id } = req.params;
		const dependencies = Array.isArray(req.body?.dependencies)
				? req.body.dependencies
				: [];
		if (dependencies.length === 0) {
			res.json({ success: true });
			return;
		}

		let allInstalled = true;
		for (const depName of dependencies) {
			logger.info(`Starting installation for dependency: ${depName}`);
			const result = await installDependency(depName, id, io);
			if (!result?.success) {
				allInstalled = false;
			}
		}
		res.json({ success: allInstalled });
	});

	// async function checkDependencies(dependencies: string[]) {
	// 	const isWindows = os.platform() === "win32";
	// 	const checkCommand = isWindows ? "where" : "which";

	// 	const results = await Promise.all(
	// 		dependencies.map(async (dep) => {
	// 			try {
	// 				await execPromise(`${checkCommand} ${dep}`);
	// 				return { name: dep, installed: true };
	// 			} catch {
	// 				return { name: dep, installed: false };
	// 			}
	// 		}),
	// 	);

	// 	const allInstalled = results.every((dep) => dep.installed);

	// 	return {
	// 		success: allInstalled,
	// 		dependencies: results,
	// 	};
	// }

	router.post("/uninstall", async (req, res) => {
		const selectedDeps = req.body.selectedDeps;
		if (selectedDeps.length === 0) {
			res.json({ success: true });
			return;
		}
		const result = await uninstallDependency(selectedDeps, io);
		if (result.success) {
			res.json({ success: true });
		} else {
			if (
				result?.reasons?.length === 1 &&
				result?.reasons[0] === "not-installed"
			) {
				res.json({ success: true });
			} else {
				res.json({ success: false, reasons: result.reasons });
			}
		}
		res.json({ success: true });
	});

	router.post("/in-use", async (req, res) => {
		const root = process.cwd();
		const sanitizedName = req.body.dioneFile.replace(/\s+/g, "-");
		const settings = readConfig();
		const dioneFile = `${path.join(settings?.defaultInstallFolder || root, "apps", sanitizedName, "dione.json")}`;
		const result = await inUseDependencies(dioneFile);

		console.log(`Dependencies in use: ${result}`);
		res.json({ result: result });
	});

	return router;
};
