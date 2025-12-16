import type { Express } from "express";
import type { Server } from "socket.io";

import { createAIRouter } from "@/server/routes/ai/ai";
import configRouter from "@/server/routes/config";
// routers
import databaseRouter from "@/server/routes/database";
import { createDependenciesRouter } from "@/server/routes/dependencies";
import filesRouter from "@/server/routes/files";
import { createLocalScriptsRouter } from "@/server/routes/local";
import reportRouter from "@/server/routes/report";
import { createScriptRouter } from "@/server/routes/scripts";
import searchBarRouter from "@/server/routes/searchbar";
import { createVariablesRouter } from "@/server/routes/variables";

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

	// files stuff
	server.use("/files", filesRouter);

	// ai
	server.use("/ai", createAIRouter(io));

	// report stuff
	server.use("/report", reportRouter);
};
