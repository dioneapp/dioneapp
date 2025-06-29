import express from "express";
import type { Server } from "socket.io";
import {
	deleteLocalScript,
	getAllLocalScripts,
	getInstalledLocalScript,
	getLocalScript,
	getLocalScriptById,
	loadLocalScript,
	uploadLocalScript,
} from "../scripts/local";
import logger from "../utils/logger";

export function createLocalScriptsRouter(io: Server) {
	const router = express.Router();
	router.use(express.json());

	router.get("/", async (_req, res) => {
		const scripts = await getAllLocalScripts();
		res.send(scripts);
	});

	router.get("/get_id/:id", async (req, res) => {
		const { id } = req.params;
		try {
			const script = await getLocalScriptById(decodeURIComponent(id));
			res.send(script);
		} catch (error: any) {
			logger.error(
				`Error handling install request: [ (${error.code || "No code"}) ${error.message || "No details"} ]`,
			);
			res.status(500).send("An error occurred while processing your request.");
		}
	});

	router.get("/get/:name", async (req, res) => {
		const { name } = req.params;
		try {
			const script = await getLocalScript(decodeURIComponent(name));
			res.send(script);
		} catch (error: any) {
			logger.error(
				`Error handling install request: [ (${error.code || "No code"}) ${error.message || "No details"} ]`,
			);
			res.status(500).send("An error occurred while processing your request.");
		}
	});

	router.get("/installed/:name", async (req, res) => {
		const { name } = req.params;
		try {
			const script = await getInstalledLocalScript(decodeURIComponent(name));
			res.send(script);
		} catch (error: any) {
			logger.error(
				`Error handling install request: [ (${error.code || "No code"}) ${error.message || "No details"} ]`,
			);
			res.status(500).send("An error occurred while processing your request.");
		}
	});

	router.get("/installed_all", async (_req, res) => {
		const scripts = await getAllLocalScripts();
		res.send(scripts);
	});

	router.get("/load/:name", async (req, res) => {
		const { name } = req.params;
		try {
			await loadLocalScript(name, io);
			res.send("Script installed successfully.");
		} catch (error: any) {
			logger.error(
				`Error handling install request: [ (${error.code || "No code"}) ${error.message || "No details"} ]`,
			);
			res.status(500).send("An error occurred while processing your request.");
		}
	});

	router.post("/upload/:filePath/:name/:description/", async (req, res) => {
		const name = req.params.name;
		const description = req.params.description;
		const filePath = decodeURIComponent(req.params.filePath as string);
		try {
			await uploadLocalScript(filePath, name, description);
			res.send("Script uploaded successfully.");
		} catch (error: any) {
			logger.error(
				`Error handling upload request: [ (${error.code || "No code"}) ${error.message || "No details"} ]`,
			);
			res.status(500).send("An error occurred while processing your request.");
		}
	});

	router.delete("/delete/:name", async (req, res) => {
		const { name } = req.params;
		try {
			await deleteLocalScript(decodeURIComponent(name));
			res.send("Script deleted successfully.");
		} catch (error: any) {
			logger.error(
				`Error handling delete request: [ (${error.code || "No code"}) ${error.message || "No details"} ]`,
			);
			res.status(500).send("An error occurred while processing your request.");
		}
	});

	return router;
}
