import { Express } from "express";
import { supabase } from "../utils/database";
import { Server } from "socket.io";
import logger from "../utils/logger";
import { getScripts } from "../scripts/download";
import { deleteScript } from "../scripts/delete";

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
                console.error(error);
                res.send(error);
            } else {
                res.send(data);
            }
        }
        getData();
    });

    server.get('/featured', (_req, res) => {
        async function getData() {
            const { data, error } = await supabase
                .from('scripts')
                .select('*')
                .order('likes', { ascending: false }) 
                .limit(4); 
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

        try {
            await getScripts(id, res, io); 
        } catch (error) {
            logger.error('Error handling download request:', error);
            res.status(500).send('An error occurred while processing your request.');
        }
    });

    server.get('/delete/:name', async (req, res) => {
        const { name } = req.params;

        try {
            deleteScript(name, res);
        } catch (error) {
            logger.error('Error handling delete request:', error);
            res.status(500).send('An error occurred while processing your request.');
        }
    });
}