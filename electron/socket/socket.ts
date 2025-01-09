import { Server } from 'socket.io';
import { ipcMain } from 'electron';
import http from 'http';

export const start = (httpServer: http.Server) => {
    const io = new Server(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.emit('message', 'Welcome to the WebSocket server!');

        socket.on('clientMessage', (data) => {
            console.log('Received message from client:', data);
            socket.emit('serverMessage', 'Message received: ' + data);
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });

    console.log('socket initialized successfully');
    // send alert to close loading window and open main window
    ipcMain.emit('socket-ready');
}