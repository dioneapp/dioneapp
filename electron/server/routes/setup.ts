import { Express } from "express";
import { supabase } from "../utils/database";
import path from 'path';
import fs from 'fs';
import https from 'https';
import { app } from "electron";
import { Server } from "socket.io";
import logger from "../utils/logger";

export const setupRoutes = (server: Express, io: Server) => {
    server.get('/', (_req, res) => {
        res.send({message: 'Hello World!'});
        io.emit('message', 'Someone connected');
    });

    server.get('/discovery', (_req, res) => {
        async function getData() {
            const { data, error } = await supabase
                .from('scripts')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) {
                console.error(error);
                res.send(error);
            } else {
                res.send(data);
            }
        }
        getData();
    });
    server.get('/search/:id', (req, res) => {
        async function getData() {
            console.log('searching for id:', req.params.id);
            const { data, error } = await supabase
                .from('scripts')
                .select('*')
                .eq('id', req.params.id);
            if (error) {
                console.error(error);
                res.send(error);
            } else {
                console.log('sending data:', data);
                res.send(data);
            }
        }
        getData();
    });

    server.get('/download/:id', async (req, res) => {
        const { id } = req.params;
        const root = app.getAppPath();
        console.log('root:', root);
    
        async function getScript() {
            io.emit('installUpdate', `Searching ${id} script in database...`);
            const { data } = await supabase
                .from('scripts')
                .select('script_url,name,version')
                .eq('id', id)
                .single();
    
            if (data) {
                logger.info(`Downloading ${data.name} with version ${data.version}.`);
                io.emit('installUpdate', `Found ${data.name} script with version ${data.version}.`);
                const filename = path.basename(new URL(data.script_url).pathname);
                const saveDirectory = path.join(root, 'apps', data.name);
                io.emit('installUpdate', `Downloading at ${saveDirectory}...`);
    
                if (!fs.existsSync(saveDirectory)) {
                    fs.mkdirSync(saveDirectory, {recursive: true});
                    io.emit('installUpdate', `Directory created at ${root}.`);
                }
    
                const savePath = path.join(saveDirectory, filename);
                const file = fs.createWriteStream(savePath);

                const rawUrl = data.script_url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
    
                https.get(rawUrl, (response) => {
                    response.pipe(file);
    
                    file.on('finish', () => {
                        file.close();
                        io.emit('installUpdate', 'Download complete.');
                        res.status(200).send('File downloaded successfully.');
                        logger.info(`Downloaded ${data.name} in ${saveDirectory}.`);
                    });
                }).on('error', (err) => {
                    fs.unlink(savePath, () => {
                        console.error('Error downloading script:', err);
                        io.emit('installUpdate', 'Error downloading script.');
                        res.status(500).send('Error downloading file.');
                        logger.error(`Error downloading ${data.name} in ${saveDirectory}:`, err);
                    });
                });
            } else {
                io.emit('installUpdate', 'Script not found in database.');
                res.status(404).send('Script not found.');
                logger.error(`Script ${id} not found in database.`);
            }
        }
    
        await getScript();
    });
}