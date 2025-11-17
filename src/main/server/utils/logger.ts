import { app } from "electron";
import fs from "node:fs";
import path from "node:path";
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

let loggerInstance: winston.Logger | null = null;
let aiLoggerInstance: winston.Logger | null = null;

const createAILogger = () => {
	if (aiLoggerInstance) {
		return aiLoggerInstance;
	}

	aiLoggerInstance = winston.createLogger({
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

	return aiLoggerInstance;
};

const createLogger = () => {
	if (loggerInstance) {
		return loggerInstance;
	}

	loggerInstance = winston.createLogger({
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

	const aiLogger = createAILogger();
	Object.assign(loggerInstance, {
		ai: (message: string) => {
			aiLogger.log("ai", message);
		},
	});

	loggerInstance.info(`Saving logs to ${logsDir}`);

	return loggerInstance;
};

export const getLogs = () => {
	return fs.readFileSync(path.join(logsDir, "error.log"), "utf-8");
};

const logger = createLogger();

export default logger;
