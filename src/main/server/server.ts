import http from "http";
import cors from "cors";
import express from "express";
import { start as setupSocket } from "../socket/socket";
import { setupRoutes } from "./routes/setup";
import { getAvailablePort } from "./utils/getPort";
import logger from "./utils/logger";

const server = express();
const httpServer = http.createServer(server);

export const start = async () => {
	try {
		server.use(cors());
		// get available port
		const port = await getAvailablePort();
		// socket
		const io = setupSocket(httpServer);
		// routes
		setupRoutes(server, io);

		httpServer.listen(port, () => {
			logger.info("Backend server started on http://localhost:" + port);
		});
	} catch (error) {
		console.error("Error finding available port:", error);
	}
};

export const stop = () => {
	httpServer.close(() => {
		logger.info("Server stopped");
	});
};
