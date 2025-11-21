import logger from "@/server/utils/logger";
import { ipcMain } from "electron";
import type http from "node:http";
import { Server } from "socket.io";

export const start = (httpServer: http.Server) => {
	logger.info("Connecting socket...");
	try {
		const io = new Server(httpServer, {
			cors: {
				origin: "*",
				methods: ["GET", "POST"],
			},
		});

		io.on("connection", (socket) => {
			logger.info(`A user has connected to the server with ID: "${socket.id}"`);

			socket.on("registerApp", (appId) => {
				if (appId) {
					socket.join(appId);
					logger.info(`Socket ${socket.id} joined room: ${appId}`);
				}
			});

			socket.on("connect_error", (err) => {
				logger.error(`Connection error: ${err.message}`);
			});

			socket.emit("message", "Welcome to the WebSocket server!");

			socket.on("installUpdate", (data) => {
				console.log("Received message from server:", data);
			});

			socket.on("disconnect", () => {
				logger.info(
					`A user has disconnected to the server with ID: "${socket.id}"`,
				);
			});
		});

		logger.info("Socket connected successfully");
		ipcMain.emit("socket-ready");

		return io;
	} catch (error) {
		logger.error("Failed to start socket connection:", error);
		ipcMain.emit("socket-error");
		throw error;
	}
};
