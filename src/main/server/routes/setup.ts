import type { Express } from "express";
import type { Server } from "socket.io";

// routers
import databaseRouter from "./database";
import searchBarRouter from "./searchbar";
import configRouter from "./config";
import { createDependenciesRouter } from "./dependencies";
import { createScriptRouter } from "./scripts";

export const setupRoutes = (server: Express, io: Server) => {
	server.get("/", (_req, res) => {
		res.send({ message: "Hello World!" });
		io.emit("message", "Someone connected");
	});

	// config stuff
	server.use("/config", configRouter);

	// database stuff
	server.use("/db", databaseRouter);

	// searchbar stuff
	server.use("/searchbar", searchBarRouter);

	// script stuff
	server.use("/scripts", createScriptRouter(io));

	// dependencies stuff
	server.use("/deps", createDependenciesRouter(io));
};
