import { Server } from 'socket.io';
import { ipcMain } from 'electron';
import http from 'http';
import logger from '../server/utils/logger';

export const start = (httpServer: http.Server) => {
    logger.info('Starting connection server...');
    try {
        const io = new Server(httpServer, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST']
            }
        });

        io.on('connection', (socket) => {
            console.log('A user connected');
            
            socket.on('connect_error', (err) => {
                logger.error(`Connection error: ${err.message}`);
            });

            socket.emit('message', 'Welcome to the WebSocket server!');

            socket.on('clientMessage', (data) => {
                console.log('Received message from client:', data);
                socket.emit('serverMessage', 'Message received: ' + data);
            });

            socket.on('disconnect', () => {
                console.log('A user disconnected');
            });
        });

        // send alert to close loading window and open main window
        logger.info('Socket connection works successfully');
        ipcMain.emit('socket-ready');
    } catch (error) {
        logger.error('Failed to start socket connection:', error);
        ipcMain.emit('socket-error');
    }
}
