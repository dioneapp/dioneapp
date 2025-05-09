import express from "express";
import { supabase } from "../utils/database";
import logger from "../utils/logger";

const router = express.Router();
router.use(express.json());

router.get("/type/:name/:type", async (req, res) => {
	const name = req.params.name;
	const type = req.params.type;
	try {
		const { data, error } = await supabase
			.from("scripts")
			.select("*")
			.filter("name", "ilike", `${name}%`)
			.ilike("tags", type)
			.order("name", { ascending: true });
		if (error) {
			logger.error(
				`Unable to search in database: [ (${error.code || "No code"}) ${error.details || "No details"} ]`,
			);
			res.send(error);
		} else {
			res.send(data);
		}
	} catch (error: any) {
		logger.error(
			`Error getting '${name}': [ (${error.code || "No code"}) ${error.message || "No details"} ]`,
		);
		res.status(500).send("An error occurred while processing your request.");
	}
});

router.get("/name/:name", async (req, res) => {
	const { name } = req.params;
	try {
		const { data, error } = await supabase
			.from("scripts")
			.select("*")
			.filter("name", "ilike", `${name}%`)
			.order("name", { ascending: true });
		if (error) {
			logger.error(
				`Unable to search in database: [ (${error.code || "No code"}) ${error.details || "No details"} ]`,
			);
			res.send(error);
		} else {
			res.send(data);
		}
	} catch (error: any) {
		logger.error(
			`Error getting '${name}': [ (${error.code || "No code"}) ${error.message || "No details"} ]`,
		);
		res.status(500).send("An error occurred while processing your request.");
	}
});

export default router;
