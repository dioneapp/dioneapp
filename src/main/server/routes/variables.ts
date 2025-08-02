import express from "express";
import {
	addValue,
	getAllValues,
	removeKey,
	removeValue,
} from "../scripts/dependencies/environment";

export const createVariablesRouter = () => {
	const router = express.Router();
	router.use(express.json());

	router.get("/", async (_req, res) => {
		const variables = getAllValues();
		res.send(variables);
	});

	router.post("/", async (req, res) => {
		const { key, value } = req.body;
		if (!key || !value) {
			return res.status(400).send({ error: "Key and value are required" });
		}

		try {
			await addValue(key, value);
			res.status(201).send({ message: "Variable set successfully" });
		} catch (error) {
			console.error("Error setting variable:", error);
			res.status(500).send({ error: "Failed to set variable" });
		}
	});

	router.delete("/:key/:value", async (req, res) => {
		const { key, value } = req.params;

		try {
			await removeValue(value, key);
			res.status(200).send({ message: "Variable removed successfully" });
		} catch (error) {
			console.error("Error removing variable:", error);
			res.status(500).send({ error: "Failed to remove variable" });
		}
	});

	router.delete("/:key", async (req, res) => {
		const { key } = req.params;

		try {
			await removeKey(key);
			res.status(200).send({ message: "Variable removed successfully" });
		} catch (error) {
			console.error("Error removing variable:", error);
			res.status(500).send({ error: "Failed to remove variable" });
		}
	});

	return router;
};
