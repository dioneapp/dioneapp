import { Express } from "express";
import { supabase } from "../utils/database";
import { Server } from "socket.io";
import logger from "../utils/logger";
import { getScripts } from "../scripts/download";
import { deleteScript } from "../scripts/delete";
import getAllScripts, { getInstalledScript } from "../scripts/installed";
import path from "node:path";
import { startScript } from "../scripts/runner";
import { stopActiveProcess } from "../scripts/execute";

// routers
import configRouter from "./config";

export const setupRoutes = (server: Express, io: Server) => {
    server.get('/', (_req, res) => {
        res.send({message: 'Hello World!'});
        io.emit('message', 'Someone connected');
    });

    server.get('/explore', (_req, res) => {
        async function getData() {
            const { data, error } = await supabase
                .from('scripts')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) {
                logger.error(`Unable to obtain the scripts: [ (${error.code || "No code"}) ${error.details} ]`,);
                res.send(error);
            } else {
                res.send(data);
            }
        }
        getData();
    });

    server.get('/featured', (_req, res) => {
        async function getData() {
            const { data: featuredScripts, error: featuredScriptsError } = await supabase
                .from('scripts')
                .select('*')
                .eq('featured', true)
                .limit(4);

            if (featuredScriptsError) {
                logger.error(`Unable to obtain the scripts: [ (${featuredScriptsError.code || "No code"}) ${featuredScriptsError.details} ]`,);
                res.send(featuredScriptsError);
                return;
            }

            const maxScripts = 4 - featuredScripts.length;

            if (maxScripts <= 0) {
                res.send(featuredScripts);
                return;
            }

            const { data: randomScripts, error: randomScriptsError } = await supabase
                .from('scripts')
                .select('*')
                .order('likes', { ascending: false })
                .limit(maxScripts);

            if (randomScriptsError) {
                logger.error(`Unable to obtain the scripts: [ (${randomScriptsError.code || "No code"}) ${randomScriptsError.details} ]`,);
                res.send(randomScriptsError);
                return;
            }

            const data = [...featuredScripts, ...randomScripts];
            res.send(data);
        }
        getData();
    });
    
    server.get('/search/:id', (req, res) => {
        async function getData() {
            logger.info(`Searching script with ID: "${req.params.id}"`);
            const { data, error } = await supabase
                .from('scripts')
                .select('*')
                .eq('id', req.params.id);
            if (error) {
                logger.error(`No database connection established: [ (${error.code || "No code"}) ${error.details} ]`,);
                res.status(500).send(error);
            } else {
                res.send(data);
            }
        }
        getData();
    });

    server.get('/search_name/:name', async (req, res) => {
        if (!req.params.name) return;
        if (req.params.name.length === 0) return;
        async function getData() {
            const sanitizedName = req.params.name.replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
            if (sanitizedName) { 
                const { data, error } = await supabase
                    .from('scripts')
                    .select('*')
                    .eq('name', sanitizedName)
                    .range(0,1)
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

    server.get('/download/:id', async (req, res) => {
        const { id } = req.params;

        try {
            await getScripts(id, res, io); 
        } catch (error: any) {
            logger.error(`Error handling download request: [ (${error.code || "No code"}) ${error.details || "No details"} ]`,);
            res.status(500).send('An error occurred while processing your request.');
        }
    });

    server.get('/start/:name', async (req, res) => {
        const { name } = req.params;
        const sanitizedName = name.replace(/\s+/g, '-');
        const root = process.cwd();
        const workingDir = path.join(root, 'apps', sanitizedName);
        logger.info(`Starting script '${sanitizedName}' on '${workingDir}'`);
        io.emit('installUpdate', { type: 'log', content: `Starting script '${sanitizedName}' on '${workingDir}'` });
        try {
            await startScript(workingDir, io);
        } catch (error: any) {
            logger.error(`Error handling start request: [ (${error.code || "No code"}) ${error.details || "No details"} ]`,);
            res.status(500).send('An error occurred while processing your request.');
        }
    });

    server.get('/stop/:name', async (req, res) => {
        const { name } = req.params;
        const sanitizedName = name.replace(/\s+/g, '-');
        const root = process.cwd();
        const workingDir = path.join(root, 'apps', sanitizedName);
        logger.info('Working on:', workingDir);
        try {
            await stopActiveProcess(io);
            res.status(200).json({ success: true });
        } catch (error: any) {
            logger.error(`Error handling stop request: [ (${error.code || "No code"}) ${error.details || "No details"} ]`,);
            res.status(500).send('An error occurred while processing your request.');
        }
    });
    

    server.get('/delete/:name', async (req, res) => {
        const { name } = req.params;
        const sanitizedName = name.replace(/\s+/g, '-');

        try {
            deleteScript(sanitizedName, res);
        } catch (error: any) {
            logger.error(`Error handling delete request: [ (${error.code || "No code"}) ${error.details || "No details"} ]`,);
            res.status(500).send('An error occurred while processing your request.');
        }
    });

    server.get('/installed', async (_req, res) => {
        try {
            const data = await getAllScripts();
            res.send(data);
        } catch (error: any) {
            logger.error(`Unable to obtain installed scripts: [ (${error.code || "No code"}) ${error.details || "No details"} ]`,);
            res.status(500).send('An error occurred while processing your request.');
        }
    });

    server.get('/installed/:name', async (req, res) => {
        const { name } = req.params;
        try {
            const isInstalled = await getInstalledScript(name);
            res.send(isInstalled);
        } catch (error: any) {
            logger.error(`Unable to obtain "${name}" script: [ (${error.code || "No code"}) ${error.details || "No details"} ]`,);
            res.status(500).send('An error occurred while processing your request.');
        }
    });

    server.get('/set-session', async (req, res) => {
        const accessToken = req.get("accessToken");
        const refreshToken = req.get("refreshToken");
        try {
            const { data, error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
            }) 
            if (error) {
                logger.error(`Unable to established session: [ (${error.code || "No code"}) ${error.message || "No details"} ]`,);
                res.send(error);
            } else {
                res.send(data);
            }
        } catch (error: any) {
            logger.error(`Unable to get session: [ (${error.code || "No code"}) ${error.message || "No details"} ]`,);
            res.status(500).send('An error occurred while processing your request.');
        }
    });

    server.get('/get-session', async (_req, res) => {
        try {
            const { data, error } = await supabase.auth.getSession();
            if (error) {
                logger.error(`Unable to get session: [ (${error.code || "No code"}) ${error.message || "No details"} ]`,);
                res.send(error);
            } else {
                res.send(data);
            }
        } catch (error: any) {
            logger.error(`Unable to get session: [ (${error.code || "No code"}) ${error.message || "No details"} ]`,);
            res.status(500).send('An error occurred while processing your request.');
        }
    });

    server.get('/searchbar/:name', async (req, res) => {
        const { name } = req.params;
        try {
            const { data, error } = await supabase
                .from('scripts')
                .select('*')
                .filter('name', 'ilike', `${name}%`)
                .order('name', { ascending: true });
            if (error) {
                logger.error(`Unable to search in database: [ (${error.code || "No code"}) ${error.details || "No details"} ]`,);
                res.send(error);
            } else {
                res.send(data);
            }
        } catch (error: any) {
            logger.error(`Error getting '${name}': [ (${error.code || "No code"}) ${error.message || "No details"} ]`,);
            res.status(500).send('An error occurred while processing your request.');
        }
    });

    // config stuff
    server.use('/config', configRouter);

}