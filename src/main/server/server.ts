import http from "node:http";
import cors from "cors";
import express from "express";
import type { Server as SocketIOServer } from "socket.io";
import { start as setupSocket } from "../socket/socket";
import { setupRoutes } from "./routes/setup";
import { getAvailablePort } from "./utils/getPort";
import logger from "./utils/logger";

let httpServer: http.Server | null = null;
let io: SocketIOServer | null = null;

export const start = async (): Promise<number> => {
	logger.info("Starting server...");
	const app = express();
	app.use(cors());

	const port = await getAvailablePort();
	const localServer = http.createServer(app);

	try {
		io = setupSocket(localServer);
		setupRoutes(app, io);

		return new Promise((resolve) => {
			localServer.listen(port, () => {
				logger.info(`Backend server started on http://localhost:${port}`);
				httpServer = localServer;
				resolve(port);
			});
		});
	} catch (error) {
		logger.error("Error starting server:", error);
		throw error;
	}
};

export const stop = async () => {
	if (io) {
		io.close();
		io = null;
	}

	if (httpServer) {
		await new Promise<void>((resolve, reject) => {
			httpServer?.close((err) => {
				if (err) return reject(err);
				logger.info("Server stopped");
				resolve();
			});
		});
		httpServer = null;
	} else {
		logger.warn(
			"Server was already stopped or never started (httpServer is null)",
		);
	}
};
