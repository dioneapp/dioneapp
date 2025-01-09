import { Express } from "express";
import { getCurrentPort } from "./utils/getPort";

export const setupRoutes = (server: Express) => {
    server.get('/', (_req, res) => {
        res.send({message: 'Hello World!'});
    });
    server.get('/get-port', (_req, res) => {
        const port = getCurrentPort();
        res.send({port: port});
    });
}