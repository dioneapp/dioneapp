import express from "express";
import { supabase, isSupabaseConfigured, safeSupabaseOperation } from "../utils/database";
import logger from "../utils/logger";

const router = express.Router();
router.use(express.json());

// check if Supabase is configured
const requireSupabase = (req: express.Request, res: express.Response, next: express.NextFunction) => {
	if (!isSupabaseConfigured()) {
		return res.status(503).json({ error: "Database is not configured" });
	}
	next();
};

// generate gradients for logo if is null
const darkColors = [
	"#1e1e2f",
	"#2c2c3a",
	"#3b3b4f",
	"#1f2937",
	"#374151",
	"#4b5563",
	"#111827",
	"#2d3748",
];
const lightColors = [
	"#f5f5f5",
	"#e0e0e0",
	"#dbeafe",
	"#fce4ec",
	"#e8eaf6",
	"#f0f4c3",
	"#cfd8dc",
	"#ffd7be",
];
function generateGradient(input: string): string {
	let hash = 0;
	for (let i = 0; i < input.length; i++) {
		hash = input.charCodeAt(i) + ((hash << 5) - hash);
	}
	hash = Math.abs(hash);
	const dark = darkColors[hash % darkColors.length];
	const light = lightColors[(hash >> 3) % lightColors.length];
	const angle = hash % 360;
	return `linear-gradient(${angle}deg, ${dark}, ${light})`;
}

// auth
router.get("/user/:id", requireSupabase, async (req, res) => {
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

// this refresh all user data (session, user, etc) from db
router.get('/refresh-token', requireSupabase, async (req, res) => {
    try {
		const token = req.get("accessToken");
		if (!token) {
			logger.error("No access token provided");
			res.status(400).send("No access token provided");
			return;
		}
        const { data, error } = await supabase.auth.refreshSession({
			refresh_token: token,
		});
        if (error) {
            logger.error(
                `Unable to refresh session: [ (${error.code || "No code"}) ${error.message || "No details"} ]`,
            );
            res.send(error);
        } else {
            res.send(data);
        }
    } catch (error: any) {
        logger.error(
            `Unable to refresh session: [ (${error.code || "No code"}) ${error.message || "No details"} ]`,
        );
        res.status(500).send("An error occurred while processing your request.");
    }
})

router.get("/set-session", requireSupabase, async (req, res) => {
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
			logger.info(`Session established successfully: ${data.user?.id}`);
			const userId = data.user?.id;
			const now = new Date().toISOString();
			console.log(`Attempting to update user with ID: ${userId}`);

			if (!userId) {
				logger.error("User ID is missing from session");
				res.status(400).send({ error: "Missing user ID" });
				return;
			}

			const { error: updateError } = await supabase
				.from("users")
				.update({ last_login: now })
				.eq("id", userId)
				.select();

			if (updateError) {
				logger.error(
					`Unable to update user: [ (${updateError.code || "No code"}) ${updateError.message || "No details"} ]`,
				);
				res.send(updateError);
			} else {
				res.send(data);
			}
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
		const response = await fetch(
			"https://api.getdione.app/v1/scripts?limit=4&order_type=desc&featured=true",
		);
		const data = await response.json();
		if (response.status !== 200) {
			logger.error(
				`Unable to obtain the scripts: [ (${response.status}) ${response.statusText} ]`,
			);
			res.send(response.statusText);
			return;
		}

		const filteredData = data.filter((script: { featured: boolean }) => script.featured);
		res.send(filteredData);
	}
	getData();
});

router.get("/explore", (_req, res) => {
	async function getData() {
		const response = await fetch(
			"https://api.getdione.app/v1/scripts?order_type=desc",
		);
		const data = await response.json();
		if (response.status !== 200) {
			logger.error(
				`Unable to obtain the scripts: [ (${response.status}) ${response.statusText} ]`,
			);
			res.send(response.statusText);
			return;
		}

		const scripts = data.map((script) => {
			if (
				script.logo_url === null ||
				script.logo_url === undefined ||
				script.logo_url === ""
			) {
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
		const response = await fetch(
			`https://api.getdione.app/v1/scripts?id=${req.params.id}&limit=1`,
		);
		const data = await response.json();
		if (response.status !== 200) {
			logger.error(
				`Unable to obtain the scripts: [ (${response.status}) ${response.statusText} ]`,
			);
			res.send(response.statusText);
			return;
		}
		const script = data[0];
		if (
			script.logo_url === null ||
			script.logo_url === undefined ||
			script.logo_url === ""
		) {
			script.logo_url = generateGradient(script.name);
		}
		res.send(script);
		return;
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
			const response = await fetch(
				`https://api.getdione.app/v1/scripts?name=${sanitizedName}`,
			);
			const data = await response.json();
			if (response.status !== 200) {
				logger.error(
					`Unable to obtain the scripts: [ (${response.status}) ${response.statusText} ]`,
				);
				res.send(response.statusText);
				return;
			}

			const scripts = data.map((script) => {
				if (
					script.logo_url === null ||
					script.logo_url === undefined ||
					script.logo_url === ""
				) {
					script.logo_url = generateGradient(script.name);
				}
				return script;
			});

			res.send(scripts);
		}
	}
	getData();
});

router.get("/search/type/:type", async (req, res) => {
	if (!req.params.type) return;
	if (req.params.type.length === 0) return;
	async function getData() {
		const type = req.params.type;

		const response = await fetch(
			`https://api.getdione.app/v1/scripts?tags=${type}`,
		);
		const data = await response.json();
		if (response.status !== 200) {
			logger.error(
				`Unable to obtain the scripts: [ (${response.status}) ${response.statusText} ]`,
			);
			res.send(response.statusText);
			return;
		}

		const scripts = data.map((script) => {
			if (
				script.logo_url === null ||
				script.logo_url === undefined ||
				script.logo_url === ""
			) {
				script.logo_url = generateGradient(script.name);
			}
			return script;
		});

		res.send(scripts);
		return;
	}
	getData();
});

// events

router.get("/events", requireSupabase, async (req, res) => {
	const user = req.headers.user;
	if (!user) {
		return res.status(400).send("No user ID provided");
	}

	const date = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(); // last seven days

	// fetch all user events on last seven days
	const { data: events, error } = await supabase
		.from("events")
		.select("*")
		.eq("user_id", user)
		.gte("created_at", date);

	if (error) {
		logger.error(`Error fetching stats: ${error.message}`);
		return res.status(500).send(error);
	}

	// basic stats processing
	const stats = {
		total: events.length,
		sessions: events.filter(e => e.event === "session"),
	};

	logger.info(`Stats generated for user ${user}`);
	res.send(stats);
});

router.post("/events", requireSupabase, async (req, res) => {
	const update = req.headers.update;
	if (update) {
		const { data, error } = await supabase.from("events").update({
			finished_at: new Date().toISOString(),
		}).eq("id", req.headers.id).select().single();
		if (error) {
			logger.error(
				`Unable to update the event: [ (${error.code || "No code"}) ${error.message || "No details"} ]`,
			);
			res.send(error);
		} else {
			logger.info(`Event updated successfully: ${data}`);
			res.send(data);
		}
		return;
	}

	const { data, error } = await supabase.from("events").insert({
		created_at: new Date().toISOString(),
		user_id: req.headers.user,
		type: req.headers.type,
		event: req.headers.event,
		started_at: req.headers.started_at || null,
		finished_at: req.headers.finished_at || null,
	}).select().single();
	if (error) {
		logger.error(
			`Unable to obtain the events: [ (${error.code || "No code"}) ${error.message || "No details"} ]`,
		);
		res.status(500).send(error);
	} else {
		logger.info(`Event created successfully with id: ${data.id}`);
		res.send(data, 200);
	}
});

export default router;
