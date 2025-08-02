import type { Express } from "express";
import type { Server } from "socket.io";

import configRouter from "./config";
// routers
import databaseRouter from "./database";
import { createDependenciesRouter } from "./dependencies";
import { createLocalScriptsRouter } from "./local";
import { createScriptRouter } from "./scripts";
import searchBarRouter from "./searchbar";
import { createVariablesRouter } from "./variables";

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

	// local scripts stuff
	server.use("/local", createLocalScriptsRouter(io));

	// variables stuff
	server.use("/variables", createVariablesRouter());
};
