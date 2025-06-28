import express from "express";
import {
	deleteConfig,
	readConfig,
	resetConfig,
	updateConfig,
} from "../../config";

const router = express.Router();
router.use(express.json());

// read config
router.get("/", (_req, res) => {
	const config = readConfig();
	res.send(config);
});

// update config
router.post("/update", (req, res) => {
	try {
		console.log("trying to update config: ", req.body);
		updateConfig(req.body);
		const updatedConfig = readConfig();
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
