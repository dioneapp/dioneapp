import { supabase } from "@/server/utils/database";
import logger from "@/server/utils/logger";
import express from "express";

const router = express.Router();
router.use(express.json());

router.post("/", async (req, res) => {
	const { type, script, ai } = req.body;

	if (!supabase) {
		logger.error("Supabase client is not initialized");
		return res.status(500).json({ error: "Database connection not available" });
	}

	try {
		let report: any;
		report = {
			type,
		};

		if (type === "script") {
			report.appid = script.appid;
			report.details = script.details;

			logger.info(
				`Reporting app with id ${report.appid}, details: ${report.details}`,
			);
		} else if (type === "ai") {
			report.model = ai.model;
			report.input = ai.input;
			report.output = ai.output;
		}

		const { error } = await supabase.from("reports").insert(report);
		if (error) {
			logger.error(
				`Unable to report: [ (${error.code || "No code"}) ${error.details || "No details"} ]`,
			);
			res.status(500).send(error);
		} else {
			res.status(200).send("success");
			logger.info(`Reported send successfully`);
		}
	} catch (error: any) {
		logger.error(
			`Error reporting: [ (${error.code || "No code"}) ${error.message || "No details"} ]`,
		);
		res.status(500).send("An error occurred while processing your request.");
	}
});

export default router;
