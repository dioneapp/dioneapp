import { app } from "electron";
import express from "express";
import { supabase } from "../utils/database";
import logger from "../utils/logger";

const router = express.Router();
router.use(express.json());

// generate gradients for logo if is null
function generateGradient(input: string): string {
	if (!input) return "";

	let hash = 2166136261;
	for (let i = 0; i < input.length; i++) {
		hash ^= input.charCodeAt(i);
		hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
	}
	hash >>>= 0;

	const hue = hash % 360;
	const hue2 = (hue + 20 + (hash % 10)) % 360;
	const c1 = `hsl(${hue}, 60%, 50%)`;
	const c2 = `hsl(${hue2}, 60%, 70%)`;

	return `linear-gradient(135deg, ${c1}, ${c2})`;
}

// auth
router.get("/user/:id", async (req, res) => {
	if (!supabase) {
		logger.error("Supabase client is not initialized");
		return res.status(500).json({ error: "Database connection not available" });
	}

	// check if request come from app
	const api_key = req.get("api_key");
	if (!api_key || api_key !== process.env.LOCAL_API_KEY) {
		logger.warn(
			app.isPackaged
				? "Invalid API key"
				: "In development mode, functions like AUTH are not available.",
		);
		return res.status(401).json({ error: "Unauthorized" });
	}

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

// this refresh all user data (session, user, etc) from db
router.get("/refresh-token", async (req, res) => {
	if (!supabase) {
		logger.error("Supabase client is not initialized");
		return res.status(500).json({ error: "Database connection not available" });
	}

	// check if request come from app
	const api_key = req.get("api_key");
	if (!api_key || api_key !== process.env.LOCAL_API_KEY) {
		logger.warn(
			app.isPackaged
				? "Invalid API key"
				: "In development mode, functions like AUTH are not available",
		);
		return res.status(401).json({ error: "Unauthorized" });
	}

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
});

router.get("/set-session", async (req, res) => {
	const accessToken = req.get("accessToken");
	const refreshToken = req.get("refreshToken");

	if (!supabase) {
		logger.error("Supabase client is not initialized");
		return res.status(500).json({ error: "Database connection not available" });
	}

	// check if request come from app
	const api_key = req.get("api_key");
	if (!api_key || api_key !== process.env.LOCAL_API_KEY) {
		logger.warn(
			app.isPackaged
				? "Invalid API key"
				: "In development mode, functions like AUTH are not available",
		);
		return res.status(401).json({ error: "Unauthorized" });
	}

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
			{
				headers: {
					Authorization: `Bearer ${process.env.API_KEY}`,
				},
			},
		);
		const data = await response.json();
		if (response.status !== 200) {
			logger.error(
				`Unable to obtain the scripts: [ (${response.status}) ${response.statusText} ]`,
			);
			res.send(response.statusText);
			return;
		}

		const filteredData = data.filter(
			(script: { featured: boolean }) => script.featured,
		);
		res.send(filteredData);
	}
	getData();
});

router.get("/explore", (req, res) => {
	const page = req.query.page ? Number.parseInt(req.query.page as string) : 1;
	const limit = req.query.limit
		? Number.parseInt(req.query.limit as string)
		: 20;

	async function getData() {
		try {
			const response = await fetch(
				`https://api.getdione.app/v1/scripts?order_type=desc&page=${page}&limit=${limit}`,
				{
					headers: { Authorization: `Bearer ${process.env.API_KEY}` },
				},
			);

			if (response.status !== 200) {
				logger.error(
					`Fetch failed: [${response.status}] ${response.statusText}`,
				);
				return res.status(response.status).json({
					error: `Dione API error: ${response.statusText}`,
				});
			}

			const data = await response.json();

			if (data.status === 404) {
				return res.json(data);
			}

			const scripts = data.map((script: any) => ({
				...script,
				logo_url: script.logo_url || generateGradient(script.name),
			}));

			res.json(scripts);
		} catch (error: any) {
			logger.error(`Critical error: ${error.message}`);
			res.status(500).json({ error: "Internal server error" });
		}
	}

	getData();
});

// search
router.get("/search/:id", (req, res) => {
	async function getData() {
		logger.info(`Searching script with ID: "${req.params.id}"`);
		const response = await fetch(
			`https://api.getdione.app/v1/scripts?id=${req.params.id}&limit=1`,
			{
				headers: {
					Authorization: `Bearer ${process.env.API_KEY}`,
				},
			},
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
			script?.logo_url === null ||
			script?.logo_url === undefined ||
			script?.logo_url === "" ||
			!script
		) {
			script.logo_url = generateGradient(script?.name);
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
				`https://api.getdione.app/v1/scripts?q=${sanitizedName}`,
				{
					headers: {
						Authorization: `Bearer ${process.env.API_KEY}`,
					},
				},
			);
			const data = await response.json();
			if (response.status !== 200) {
				logger.error(
					`Unable to obtain the scripts: [ (${response.status}) ${response.statusText} ]`,
				);
				res.send(response.statusText);
				return;
			}

			if (data.length === 0) {
				res.send([]);
				return;
			}

			if (!data || !Array.isArray(data)) {
				logger.warn(
					`Invalid data format from API, probably no scripts found (${sanitizedName}).`,
				);
				res.send([]);
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

			res.send(scripts || []);
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
			{
				headers: {
					Authorization: `Bearer ${process.env.API_KEY}`,
				},
			},
		);
		const data = await response.json();
		if (response.status !== 200) {
			logger.error(
				`Unable to obtain the scripts: [ (${response.status}) ${response.statusText} ]`,
			);
			res.send(response.statusText);
			return;
		}

		if (data.length === 0) {
			res.send([]);
			return;
		}

		if (!data || !Array.isArray(data)) {
			logger.error("Invalid data format from API, probably no scripts found.");
			res.send([]);
			return;
		}

		const scripts = data.map((script) => {
			if (
				script?.logo_url === null ||
				script?.logo_url === undefined ||
				script?.logo_url === ""
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

// update a script
router.post("/update-script/:id", async (req, res) => {
	const id = req.params.id;
	const updateData = req.body;
	if (!id) {
		return res.status(400).send("No script ID provided");
	}

	if (!supabase) {
		logger.error("Supabase client is not initialized");
		return res.status(500).json({ error: "Database connection not available" });
	}

	const { data, error } = await supabase
		.from("scripts")
		.update(updateData)
		.eq("id", id)
		.select()
		.single();
	if (error) {
		logger.error(
			`Unable to update the script: [ (${error.code || "No code"}) ${error.message || "No details"} ]`,
		);
		res.send(error);
	} else {
		logger.info(`Script updated successfully: ${data.id}`);
		res.send(data);
	}
	return;
});

// events
router.get("/events", async (req, res) => {
	const user = req.headers.user;
	if (!user) {
		return res.status(400).send("No user ID provided");
	}

	if (!supabase) {
		logger.error("Supabase client is not initialized");
		return res.status(500).json({ error: "Database connection not available" });
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
		sessions: events.filter((e) => e.event === "session"),
		shared: events.filter((e) => e.event === "share"),
	};

	logger.info(`Stats generated for user ${user}`);
	res.send(stats);
});

router.post("/events", async (req, res) => {
	const update = req.headers.update || null;
	const updateData = req.headers.updatedata || null;

	if (!supabase) {
		logger.error("Supabase client is not initialized");
		return res.status(500).json({ error: "Database connection not available" });
	}

	if (update) {
		const { data, error } = await supabase
			.from("events")
			.update({
				finished_at: new Date().toISOString(),
			})
			.eq("id", req.headers.id)
			.select()
			.single();
		if (error) {
			logger.error(
				`Unable to update the event: [ (${error.code || "No code"}) ${error.message || "No details"} ]`,
			);
			res.send(error);
		} else {
			logger.info(`Event updated successfully: ${data.id}`);
			res.send(data);
		}
		return;
	}

	if (updateData) {
		const updateFields = {
			...(req.headers.id && { id: req.headers.id }),
			...(req.headers.user && { user_id: req.headers.user }),
			...(req.headers.type && { type: req.headers.type }),
			...(req.headers.event && { event: req.headers.event }),
			...(req.headers.app_id && { app_id: req.headers.app_id }),
			...(req.headers.app_name && { app_name: req.headers.app_name }),
			...(req.headers.started_at && { started_at: req.headers.started_at }),
			...(req.headers.finished_at && { finished_at: req.headers.finished_at }),
		};
		const { data, error } = await supabase
			.from("events")
			.update(updateFields)
			.eq("id", req.headers.id)
			.select()
			.single();
		if (error) {
			logger.error(
				`Unable to update the event: [ (${error.code || "No code"}) ${error.message || "No details"} ]`,
			);
			res.send(error).status(500);
		} else {
			logger.info(`Event updated successfully: ${data.id}`);
			res.send(data).status(200);
		}
		return;
	}

	type EventData = {
		created_at: string;
		type: any;
		event: any;
		app_id: any;
		app_name: any;
		started_at: any;
		finished_at: any;
		user_id?: string;
	};

	const eventData: EventData = {
		created_at: new Date().toISOString(),
		type: req.headers.type,
		event: req.headers.event,
		app_id: req.headers.app_id || null,
		app_name: req.headers.app_name || null,
		started_at: req.headers.started_at || null,
		finished_at: req.headers.finished_at || null,
	};

	if (req.headers.user) {
		eventData.user_id = req.headers.user;
	}

	const { data, error } = await supabase
		.from("events")
		.insert(eventData)
		.select()
		.single();
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
