import express from "express";
import { supabase } from "../utils/database";
import logger from "../utils/logger";

const router = express.Router();
router.use(express.json());


// generate gradients for logo if is null
const darkColors = ["#1e1e2f", "#2c2c3a", "#3b3b4f", "#1f2937", "#374151", "#4b5563", "#111827", "#2d3748"];
const lightColors = ["#f5f5f5", "#e0e0e0", "#dbeafe", "#fce4ec", "#e8eaf6", "#f0f4c3", "#cfd8dc", "#ffd7be"];
function generateGradient(input: string): string {
	let hash = 0;
	for (let i = 0; i < input.length; i++) { hash = input.charCodeAt(i) + ((hash << 5) - hash);}
	hash = Math.abs(hash);
	const dark = darkColors[hash % darkColors.length];
	const light = lightColors[(hash >> 3) % lightColors.length];
	const angle = hash % 360;
	return `linear-gradient(${angle}deg, ${dark}, ${light})`;
}


// auth
router.get("/user/:id", async (req, res) => {
	try {
		const { data, error } = await supabase
			.from("users")
			.select("*")
			.eq("id", req.params.id)
			.limit(1);
		if (error) {
			logger.error(
				`Unable to get user: [ (${error.code || "No code"}) ${error.message || "No details"} ]`,
			);
			res.status(500).send("An error occurred while processing your request.");
		} else {
			res.send(data);
		}
	} catch (error: any) {
		logger.error(
			`Unable to get user: [ (${error.code || "No code"}) ${error.message || "No details"} ]`,
		);
		res.status(500).send("An error occurred while processing your request.");
	}
});

// unused
// router.get("/get-session", async (_req, res) => {
//     try {
//         const { data, error } = await supabase.auth.getSession();
//         if (error) {
//             logger.error(
//                 `Unable to get session: [ (${error.code || "No code"}) ${error.message || "No details"} ]`,
//             );
//             res.send(error);
//         } else {
//             res.send(data);
//         }
//     } catch (error: any) {
//         logger.error(
//             `Unable to get session: [ (${error.code || "No code"}) ${error.message || "No details"} ]`,
//         );
//         res.status(500).send("An error occurred while processing your request.");
//     }
// });

router.get("/set-session", async (req, res) => {
	const accessToken = req.get("accessToken");
	const refreshToken = req.get("refreshToken");
	try {
		const { data, error } = await supabase.auth.setSession({
			access_token: accessToken,
			refresh_token: refreshToken,
		});
		if (error) {
			logger.error(
				`Unable to established session: [ (${error.code || "No code"}) ${error.message || "No details"} ]`,
			);
			res.send(error);
		} else {
			res.send(data);
		}
	} catch (error: any) {
		logger.error(
			`Unable to get session: [ (${error.code || "No code"}) ${error.message || "No details"} ]`,
		);
		res.status(500).send("An error occurred while processing your request.");
	}
});

// tables
router.get("/featured", (_req, res) => {
	async function getData() {
		const { data: featuredScripts, error: featuredScriptsError } =
			await supabase
				.from("scripts")
				.select("*")
				.eq("featured", true)
				.order("order", { ascending: true })
				.limit(4);

		if (featuredScriptsError) {
			logger.error(
				`Unable to obtain the scripts: [ (${featuredScriptsError.code || "No code"}) ${featuredScriptsError.details} ]`,
			);
			res.send(featuredScriptsError);
			return;
		}

		const data = [...featuredScripts];
		res.send(data);
	}
	getData();
});

router.get("/explore", (_req, res) => {
	async function getData() {
		const { data, error } = await supabase
			.from("scripts")
			.select("*")
			.order("created_at", { ascending: false });

		if (error) {
			logger.error(
				`Unable to obtain the scripts: [ (${error.code || "No code"}) ${error.details} ]`,
			);
			res.send(error);
			return;
		}

		const scripts = data.map((script) => {
			if (script.logo_url === null || script.logo_url === undefined || script.logo_url === '') {
				script.logo_url = generateGradient(script.name);
			}
			return script;
		});

		res.send(scripts);
	}

	getData();
});

// search
router.get("/search/:id", (req, res) => {
	async function getData() {
		logger.info(`Searching script with ID: "${req.params.id}"`);
		const { data, error } = await supabase
			.from("scripts")
			.select("*")
			.eq("id", req.params.id);
		if (error) {
			logger.error(
				`No database connection established: [ (${error.code || "No code"}) ${error.details} ]`,
			);
			res.status(500).send(error);
		} else {
			if (data[0].logo_url === null || data[0].logo_url === undefined || data[0].logo_url === '') {
				data[0].logo_url = generateGradient(data[0].name);
			}
			res.send(data);
		}
	}
	getData();
});

router.get("/search/name/:name", async (req, res) => {
	if (!req.params.name) return;
	if (req.params.name.length === 0) return;
	async function getData() {
		const sanitizedName = req.params.name
			.replace(/-/g, " ")
			.replace(/\s+/g, " ")
			.trim();
		if (sanitizedName) {
			const { data, error } = await supabase
				.from("scripts")
				.select("*")
				.eq("name", sanitizedName)
				.range(0, 1)
				.single();
			if (error) {
				logger.error(`Not found an script named: "${sanitizedName}"`);
				res.send(error);
			} else {
				if (data.logo_url === null || data.logo_url === undefined || data.logo_url === '') {
					data.logo_url = generateGradient(data.name);
				}
				res.send(data);
			}
		}
	}
	getData();
});

router.get("/search/type/:type", async (req, res) => {
	if (!req.params.type) return;
	if (req.params.type.length === 0) return;
	async function getData() {
		const type = req.params.type;
		if (type) {
			const { data, error } = await supabase
				.from("scripts")
				.select("*")
				.ilike("tags", type);
			if (error) {
				console.log("No found scripts with TAG", type, error);
				res.send(error);
			} else {
				data.map((script) => {
					if (script.logo_url === null || script.logo_url === undefined || script.logo_url === '') {
						script.logo_url = generateGradient(script.name);
					}
					return script;
				});
				res.send(data);
			}
		}
	}
	getData();
});

export default router;
