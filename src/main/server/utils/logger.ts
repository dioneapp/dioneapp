import fs from "node:fs";
import path from "node:path";
import { app } from "electron";
import winston from "winston";

declare module "winston" {
	interface Logger {
		ai: winston.LeveledLogMethod;
	}
}

const logsDir = path.join(app.getPath("logs"));

if (!fs.existsSync(logsDir)) {
	fs.mkdirSync(logsDir);
}

const aiLogger = winston.createLogger({
	level: "ai",
	levels: {
		ai: 0,
	},
	format: winston.format.combine(
		winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
		winston.format.printf(({ timestamp, level, message }) => {
			return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
		}),
	),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({
			filename: path.join(logsDir, "ai.log"),
			level: "ai",
		}),
	],
});

const logger = winston.createLogger({
	level: "info",
	levels: winston.config.npm.levels,
	format: winston.format.combine(
		winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
		winston.format.printf(({ timestamp, level, message }) => {
			return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
		}),
	),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({
			filename: path.join(logsDir, "server.log"),
			level: "info",
		}),
		new winston.transports.File({
			filename: path.join(logsDir, "error.log"),
			level: "error",
		}),
	],
});

export const getLogs = () => {
	return fs.readFileSync(path.join(logsDir, "error.log"), "utf-8");
};

Object.assign(logger, {
	ai: (message: string) => {
		aiLogger.log('ai', message);
	}
});

logger.info(`Saving logs to ${logsDir}`);

export default logger;
