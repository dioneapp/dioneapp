import type http from "http";
import { ipcMain } from "electron";
import { Server } from "socket.io";
import logger from "../server/utils/logger";

export const start = (httpServer: http.Server) => {
	logger.info("Starting connection server...");
	try {
		const io = new Server(httpServer, {
			cors: {
				origin: "*",
				methods: ["GET", "POST"],
			},
		});

		io.on("connection", (socket) => {
			logger.info(`A user has connected to the server with ID: "${socket.id}"`);

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

		logger.info("Socket connection works successfully");
		ipcMain.emit("socket-ready");

		return io;
	} catch (error) {
		logger.error("Failed to start socket connection:", error);
		ipcMain.emit("socket-error");
		throw error;
	}
};
