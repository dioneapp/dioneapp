import winston from 'winston';
import path from 'path';
import fs from 'node:fs';
import { app } from 'electron';

const logsDir = path.join(app.getPath('logs'));

if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);  
}

console.log('logs dir', logsDir);

const logger = winston.createLogger({
    level: 'info', 
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: path.join(logsDir, 'server.log'),
            level: 'info',
        }),
        new winston.transports.File({
            filename: path.join(logsDir, 'error.log'),
            level: 'error',
        }),
    ],
});

export default logger;
