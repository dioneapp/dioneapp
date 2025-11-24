import http from "node:http";
import { setupRoutes } from "@/server/routes/setup";
import { getAvailablePort } from "@/server/utils/getPort";
import logger from "@/server/utils/logger";
import { start as setupSocket } from "@/socket/socket";
import cors from "cors";
import express from "express";
import type { Server as SocketIOServer } from "socket.io";

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
		io.sockets.disconnectSockets(true); // force disconnect
		io.close();
		io = null;
	}

	if (httpServer) {
		// close all socket connections
		const forceClose = () => {
			if (httpServer) {
				httpServer.closeAllConnections?.();
				httpServer.closeIdleConnections?.();
			}
		};

		// timeout to avoid blocking
		const timeout = setTimeout(() => {
			logger.warn("Forcing server closure");
			forceClose();
		}, 2000);

		await new Promise<void>((resolve) => {
			httpServer?.close(() => {
				clearTimeout(timeout);
				logger.info("Server stopped gracefully");
				resolve();
			});

			httpServer?.once("close", resolve);
		});

		httpServer = null;
	} else {
		logger.warn("Server already stopped");
	}
};
