import express from 'express';
import http from 'http';
import { setupRoutes } from './routes/setup';
import { getAvailablePort } from './utils/getPort';
import {start as setupSocket} from "../socket/socket"
import logger from './utils/logger';

const server = express();
const httpServer = http.createServer(server);

export const start = async () => {
    try {
        // get available port
        const port = await getAvailablePort();
        // socket
        setupSocket(httpServer)
        // routes 
        setupRoutes(server)

        httpServer.listen(port, () => {
            logger.info('Backend server started on http://localhost:' + port);
        });
    } catch (error) {
        console.error('Error finding available port:', error);
    }
};

export const stop = () => {
    httpServer.close(() => {
        logger.info('Server stopped');
    });
};
