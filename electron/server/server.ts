import express from 'express';
import http from 'http';
import { setupRoutes } from './routes/setup';
import { getAvailablePort } from './routes/utils/getPort';
import {start as setupSocket} from "../socket/socket"

const server = express();
const httpServer = http.createServer(server);

export const start = async () => {
    try {
        // get available port
        const port = await getAvailablePort();

        // routes 
        setupRoutes(server)

        // socket
        setupSocket(httpServer)

        httpServer.listen(port, () => {
            console.log(`Server started on http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Error finding available port:', error);
    }
};

export const stop = () => {
    httpServer.close(() => {
        console.log('Server stopped');
    });
};
