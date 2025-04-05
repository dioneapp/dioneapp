import express from "express";
import getAllScripts, { getInstalledScript } from "../scripts/installed";
import logger from "../utils/logger";
import { deleteScript } from "../scripts/delete";
import path from "node:path";
import { stopActiveProcess } from "../scripts/process";
import type { Server } from "socket.io";
import { executeStartup } from "../scripts/execute";
import { getScripts } from "../scripts/download";

export function createScriptRouter(io: Server) {
	const router = express.Router();
	router.use(express.json());

	router.get("/download/:id", async (req, res) => {
		const { id } = req.params;

		try {
			await getScripts(id, io);
			res.status(200).send("Script downloaded successfully.");
		} catch (error: any) {
			logger.error(
				`Error handling download request: [ (${error.code || "No code"}) ${error.details || "No details"} ]`,
			);
			res.status(500).send("An error occurred while processing your request.");
		}
	});

	// get if script is installed
	router.get("/installed/:name", async (req, res) => {
		const { name } = req.params;
		try {
			const isInstalled = await getInstalledScript(name);
			console.log("is installed", isInstalled);
			res.send(isInstalled);
		} catch (error: any) {
			logger.error(
				`Unable to obtain "${name}" script: [ (${error.code || "No code"}) ${error.details || "No details"} ]`,
			);
			res.status(500).send("An error occurred while processing your request.");
		}
	});
	// get all scripts installed
	router.get("/installed", async (_req, res) => {
		try {
			const data = await getAllScripts();
			console.log("installed scripts", data);
			res.send(data);
		} catch (error: any) {
			logger.error(
				`Unable to obtain installed scripts: [ (${error.code || "No code"}) ${error.details || "No details"} ]`,
			);
			res.status(500).send("An error occurred while processing your request.");
		}
	});
	// delete a script by name
	router.get("/delete/:name", async (req, res) => {
		const { name } = req.params;
		const sanitizedName = name.replace(/\s+/g, "-");

		try {
			const response = await deleteScript(sanitizedName, res);
			return response;
		} catch (error: any) {
			logger.error(
				`Error handling delete request: [ (${error.code || "No code"}) ${error.details || "No details"} ]`,
			);
			res.status(500).send("An error occurred while processing your request.");
		}
	});
	// stop a script by name
	router.get("/stop/:name", async (req, res) => {
		const { name } = req.params;
		const sanitizedName = name.replace(/\s+/g, "-");
		const root = process.cwd();
		const workingDir = path.join(root, "apps", sanitizedName);
		logger.info(`Stopping script '${sanitizedName}' on '${workingDir}'`);
		try {
			const success = await stopActiveProcess(io);
			if (success) {
				res.status(200).send({ message: "Process stopped successfully" });
			} else {
				res.status(500).send({ message: "Failed to stop process" });
			}
		} catch (error: any) {
			logger.error(
				`Error handling stop request: [ (${error.code || "No code"}) ${error.details || "No details"} ]`,
			);
			res.status(500).send("An error occurred while processing your request.");
		}
	});
	// start a script by name
	router.get("/start/:name", async (req, res) => {
		const { name } = req.params;
		const sanitizedName = name.replace(/\s+/g, "-");
		const root = process.cwd();
		const workingDir = path.join(root, "apps", sanitizedName);
		logger.info(`Starting script '${sanitizedName}' on '${workingDir}'`);
		io.emit("installUpdate", {
			type: "log",
			content: `Starting script '${sanitizedName}' on '${workingDir}'`,
		});
		try {
			await executeStartup(workingDir, io);
		} catch (error: any) {
			logger.error(
				`Error handling start request: [ (${error.code || "No code"}) ${error.details || "No details"} ]`,
			);
			res.status(500).send("An error occurred while processing your request.");
		}
	});
	return router;
}
