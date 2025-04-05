import express from "express";
import { supabase } from "../utils/database";
import logger from "../utils/logger";

const router = express.Router();
router.use(express.json());


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
            res
                .status(500)
                .send("An error occurred while processing your request.");
        } else {
            res.send(data);
        }
        console.log("User:", data);
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
        } else {
            res.send(data);
        }
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
                console.log("No found scripts with TAG", type, error);
                res.send(data);
            }
        }
    }
    getData();
});

export default router;
