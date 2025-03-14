import { exec } from "node:child_process";
import { promisify } from "node:util";
import express from "express";
import os from "node:os";
import logger from "../utils/logger";

const execPromise = promisify(exec);
const router = express.Router();
router.use(express.json());

const defaultDependencies = ["uv", "node", "npm", "python", "git", "curl", "wget"];

router.get("/check", async (req, res) => {
	try {
        const dependencies = req.headers.dependencies || defaultDependencies;
        logger.info(`Checking dependencies: ${dependencies.join(", ")}`);
		const response = await checkDependencies(dependencies);
		res.send(response).status(200);
        logger.info(`Dependencies status: ${JSON.stringify(response)}`);
	} catch (error) {
		res.status(400).send({ error: "Failed to check dependencies" });
	}
});

async function checkDependencies(dependencies: string[]) {
	const isWindows = os.platform() === "win32";
	const checkCommand = isWindows ? "where" : "which";

	const results = await Promise.all(
		dependencies.map(async (dep) => {
			try {
				await execPromise(`${checkCommand} ${dep}`);
				return { name: dep, installed: true };
			} catch {
				return { name: dep, installed: false };
			}
		})
	);

	const allInstalled = results.every((dep) => dep.installed);

	return {
		success: allInstalled,
		dependencies: results,
	};
}

export default router;
