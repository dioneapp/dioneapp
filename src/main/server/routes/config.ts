import express from "express";
import {
	deleteConfig,
	readConfig,
	resetConfig,
	updateConfig,
} from "../../config";
import { toggleDiscordRPC } from "../../discord/presence";

const router = express.Router();
router.use(express.json());

// read config
router.get("/", (_req, res) => {
	const config = readConfig();
	res.send(config);
});

// update config
router.post("/update", async (req, res) => {
	try {
		console.log("trying to update config: ", req.body);

		// Validate incoming paths: do not allow whitespace
		if (
			(req.body.defaultInstallFolder &&
				/\s/.test(req.body.defaultInstallFolder)) ||
			(req.body.defaultBinFolder && /\s/.test(req.body.defaultBinFolder))
		) {
			console.warn("Attempt to update config with path containing whitespace");
			return res.status(400).send({ error: "Paths cannot contain spaces." });
		}
		const currentConfig = readConfig();
		updateConfig(req.body);
		const updatedConfig = readConfig();

		if (
			req.body.enableDiscordRPC !== undefined &&
			req.body.enableDiscordRPC !== currentConfig?.enableDiscordRPC
		) {
			await toggleDiscordRPC(req.body.enableDiscordRPC);
		}

		res.send(updatedConfig);
	} catch (error) {
		res.status(400).send({ error: "Failed to update configuration" });
	}
});

router.post("/reset", (_req, res) => {
	try {
		console.log("trying to reset config");
		resetConfig();
		res.send({ success: true });
	} catch (error) {
		res.status(400).send({ error: "Failed to reset configuration" });
	}
});

router.post("/delete", (_req, res) => {
	try {
		console.log("trying to delete config");
		deleteConfig();
		res.send({ success: true });
	} catch (error) {
		res.status(400).send({ error: "Failed to delete configuration" });
	}
});

export default router;
