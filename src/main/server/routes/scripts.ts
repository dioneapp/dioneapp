import { deleteScript } from "@/server/scripts/delete";
import { readDioneConfig } from "@/server/scripts/dependencies/dependencies";
import { extractInfo, getScripts } from "@/server/scripts/download";
import { executeStartup } from "@/server/scripts/execute";
import getAllScripts, { getInstalledScript } from "@/server/scripts/installed";
import { stopActiveProcess } from "@/server/scripts/process";
import { resolveScriptPaths } from "@/server/scripts/utils/paths";
import logger from "@/server/utils/logger";
import express from "express";
import type { Server } from "socket.io";
import { updateScript } from "../scripts/update";

const activeStarts = new Map<string, boolean>();

export function createScriptRouter(io: Server) {
	const router = express.Router();
	router.use(express.json());

	router.get("/download/:id/", async (req, res) => {
		const { id } = req.params;
		const force = req.query.force === "true";

		try {
			await getScripts(id, io, force);
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

		try {
			const response = await deleteScript(name, res);
			return response;
		} catch (error: any) {
			logger.error(
				`Error handling delete request: [ (${error.code || "No code"}) ${error.details || "No details"} ]`,
			);
			res.status(500).send("An error occurred while processing your request.");
		}
	});
	// stop a script by name
	router.get("/stop/:name/:id", async (req, res) => {
		const { name, id } = req.params;
		const { sanitizedName, workingDir } = resolveScriptPaths(name);
		logger.info(`Stopping script '${sanitizedName}' on '${workingDir}'`);
		try {
			const success = await stopActiveProcess(io, id);
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
	router.post("/start/:name/:id", async (req, res) => {
		const { name, id } = req.params;
		const { replaceCommands } = req.body;
		const selectedStart = decodeURIComponent((req.query.start as string) || "");
		const { sanitizedName, workingDir } = resolveScriptPaths(name);
		const key = `${sanitizedName}:${id}`;

		// if already starting, ignore duplicate request
		if (activeStarts.get(key)) {
			logger.info(`Start request ignored: already starting ${key}`);
			return res.status(409).send({ message: "Start already in progress" });
		}
		activeStarts.set(key, true);

		try {
			logger.info(`Starting script '${sanitizedName}' on '${workingDir}'`);
			io.to(id).emit("installUpdate", {
				type: "log",
				content: `Starting script '${sanitizedName}' on '${workingDir}'\n`,
			});

			console.log("selected start option:", selectedStart);
			io.to(id).emit("enableStop");
			await executeStartup(
				workingDir,
				io,
				id,
				selectedStart !== "" ? selectedStart : undefined,
				replaceCommands !== "" ? replaceCommands : undefined,
			);
			res.status(200).send({ message: "Script started successfully" });
		} catch (error: any) {
			logger.error(`Error handling start request - Full error:`, error);
			logger.error(`Error message: ${error.message}`);
			logger.error(`Error stack: ${error.stack}`);
			logger.error(
				`Error handling start request: [ (${error.code || "No code"}) ${error.message || error.details || "No details"} ]`,
			);
			res.status(500).send("An error occurred while processing your request.");
		} finally {
			activeStarts.delete(key);
		}
	});

	// get script start options
	router.get("/start-options/:name", async (req, res) => {
		const name = decodeURIComponent(req.params.name);
		const { dioneFile } = resolveScriptPaths(name);

		try {
			const options = await readDioneConfig(dioneFile);

			if (!options.start || !Array.isArray(options.start)) {
				return res.status(404).json({ error: "No start options found" });
			}

			const starts = options.start
				.map((s) => {
					if (s.commands) {
						return {
							name: s.name,
							catch: s.catch,
							env: s.env,
							steps: [
								{
									name: "Step 0",
									commands: s.commands,
								},
							],
						};
					} else if (s.steps) {
						return {
							name: s.name,
							catch: s.catch,
							env: s.env,
							steps: s.steps,
						};
					}
					return null;
				})
				.filter(Boolean);

			return res.status(200).json({ starts });
		} catch (error: any) {
			logger.error(
				`Unable to obtain start options for "${name}" script: [ (${error.code || "No code"}) ${error.details || "No details"} ]`,
			);
			res.status(500).send("An error occurred while processing your request.");
		}
	});

	router.post("/check-update", async (req, res) => {
		const data = req.body
		const { workingDir, dioneFile } = resolveScriptPaths(data.name);
		logger.info(`Checking update for script '${data.name}' on '${workingDir}'`);
		try {
			const success = await updateScript(workingDir, dioneFile, io, data.id);
			res.status(200).json({ success });
		} catch (error: any) {
			logger.error(
				`Unable to check update for "${data.name}" script: [ (${error.code || "No code"}) ${error.details || "No details"} ]`,
			);
			res.status(500).send("An error occurred while processing your request.");
		}
	});

	return router;
}
