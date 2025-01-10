import { Express } from "express";
import { getCurrentPort } from "../utils/getPort";
import { io } from "socket.io-client";

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
}