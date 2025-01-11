import { Express } from "express";
import { getCurrentPort } from "../utils/getPort";
import { io } from "socket.io-client";
import { supabase } from "../utils/database";

export const setupRoutes = (server: Express) => {
    const port = getCurrentPort();
    const socket = io(`http://localhost:${port}`);

    server.get('/', (_req, res) => {
        res.send({message: 'Hello World!'});
        socket.emit('clientMessage', 'Hello World!');
    });
    server.get('/get-port', (_req, res) => {
        res.send({port: port});
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
}