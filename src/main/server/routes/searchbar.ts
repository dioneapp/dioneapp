import { supabase } from "@/server/utils/database";
import logger from "@/server/utils/logger";
import express from "express";

const router = express.Router();
router.use(express.json());

router.get("/type/:name/:type", async (req, res) => {
	const name = req.params.name;
	const type = req.params.type;

	const orderBy = (req.query.order_by as string) || "name";
	const orderType = (req.query.order_type as string) || "asc";

	if (!supabase) {
		logger.error("Supabase client is not initialized");
		return res.status(500).json({ error: "Database connection not available" });
	}
	try {
		const { data, error } = await supabase
			.from("scripts")
			.select("*")
			.filter("name", "ilike", `${name}%`)
			.ilike("tags", type)
			.order(orderBy, { ascending: orderType === "asc" });
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
	const name = req.params.name.replace(/-/g, " ").replace(/\s+/g, " ").trim();

	const orderBy = (req.query.order_by as string) || null;
	const orderType = (req.query.order_type as string) || null;

	try {
		const url = new URL(`https://api.getdione.app/v1/scripts`);
		url.searchParams.set("q", name);
		if (orderBy) url.searchParams.set("order", orderBy);
		if (orderType) url.searchParams.set("order_type", orderType);

		const response = await fetch(url.toString(), {
			headers: {
				...(process.env.API_KEY
					? { Authorization: `Bearer ${process.env.API_KEY}` }
					: {}),
			},
		});
		const data = await response.json();
		if (data.error === false && data.status === 404) {
			res.send([]);
			return;
		}
		if (response.status !== 200) {
			logger.error(
				`Unable to obtain the scripts: [ (${response.status}) ${response.statusText} ]`,
			);
			res.send(response.statusText);
			return;
		}
		res.send(data);
	} catch (error: any) {
		logger.error(
			`Error getting '${name}': [ (${error.code || "No code"}) ${error.message || "No details"} ]`,
		);
		res.status(500).send("An error occurred while processing your request.");
	}
});

export default router;
