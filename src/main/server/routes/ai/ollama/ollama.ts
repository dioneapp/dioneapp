import { type ChildProcess, spawn } from "child_process";
import fs from "fs";
import path from "path";
import { readConfig } from "@/config";
import { getSysPrompt } from "@/server/routes/ai/instructions/instructions";
import { getTools, read_file } from "@/server/routes/ai/ollama/tools";
import {
	checkOneDependency,
	installDependency,
} from "@/server/scripts/dependencies/dependencies";
import { getAllValues } from "@/server/scripts/dependencies/environment";
import { killProcess } from "@/server/scripts/process";
import logger from "@/server/utils/logger";
import { app } from "electron";
import express from "express";
import type { Server as SocketIOServer } from "socket.io";
const { Ollama } = require("ollama");

let activeProcess: ChildProcess | null = null;

export function createOllamaRouter(io: SocketIOServer) {
	const OllamaRouter = express.Router();
	OllamaRouter.use(express.json());

	const ollama = new Ollama({
		url: "http://localhost:11434",
	});

	OllamaRouter.get("/", (_req, res) => {
		res.json({ message: "Ollama API is working" });
	});

	OllamaRouter.get("/isinstalled", async (_req, res) => {
		logger.ai("Checking if Ollama is installed...");
		const config = readConfig();
		const binFolder = path.join(
			config?.defaultBinFolder || path.join(app.getPath("userData")),
			"bin",
		);
		const result = await checkOneDependency("ollama", binFolder);
		logger.ai(
			`Ollama is installed?: ${result.installed}, reason: ${result.reason}`,
		);
		res.json(result);
	});

	OllamaRouter.post("/install", async (_req, res) => {
		logger.ai("Installing Ollama...");
		let installed = false;
		const result = await installDependency("ollama", "ollama", io);
		if (result.success) {
			installed = true;
		}
		logger.ai(`Installation finished.`);
		res.json({ installed });
	});

	OllamaRouter.post("/start", async (_req, res) => {
		logger.ai("Starting Ollama...");
		const config = readConfig();
		const binFolder = path.join(
			config?.defaultBinFolder || path.join(app.getPath("userData")),
			"bin",
		);
		const ollamaDir = path.join(binFolder, "ollama");
		const command = "ollama serve";

		if (!fs.existsSync(ollamaDir)) {
			logger.ai("Ollama directory does not exist.");
			return res.status(400).json({ error: "Ollama directory does not exist" });
		}

		if (activeProcess) {
			logger.ai("Ollama server already running.");
			return res.status(400).json({ error: "Ollama server already running" });
		}

		try {
			const ENVIRONMENT = getAllValues();
			activeProcess = spawn(command, {
				cwd: ollamaDir,
				shell: true,
				env: ENVIRONMENT,
			});

			if (!activeProcess) {
				res.status(500).json({ error: "Failed to start Ollama server" });
				return;
			}

			activeProcess?.stdout?.on("data", (data) => {
				const text = data.toString("utf8");
				logger.ai(`[ollama stdout] ${text}`);
			});

			activeProcess?.stderr?.on("data", (data) => {
				const text = data.toString("utf8");
				logger.ai(`[ollama stderr] ${text}`);
			});

			activeProcess.on("exit", (code) => {
				logger.ai(`Ollama server exited with code ${code}`);
				activeProcess = null;
			});

			logger.ai(`Ollama server started with PID ${activeProcess.pid}`);

			res.json({ message: "Ollama server started", pid: activeProcess.pid });
		} catch (error) {
			logger.error(`Error starting Ollama server: ${(error as Error).message}`);
			res.status(500).json({ error: "Failed to start Ollama server" });
		}
	});

	OllamaRouter.post("/stop", async (_req, res) => {
		if (!activeProcess || !activeProcess.pid) {
			logger.ai("No Ollama server running.");
			return res.status(400).json({ error: "No Ollama server running" });
		}

		await killProcess(activeProcess.pid, io, "ollama");
		activeProcess = null;

		res.json({ message: "Ollama server stopped" });
	});

	// ollama routes

	OllamaRouter.get("/models", async (_req, res) => {
		try {
			// wait until ollama server is ready
			await new Promise((resolve) => setTimeout(resolve, 500));
			const response = await ollama.list();
			const modelNames = response.models
				.map((m: { name: string }) => m.name)
				.join(", ");
			logger.ai(`Downloaded models: ${modelNames}`);
			res.json(response);
		} catch (error) {
			logger.error(`Error fetching downloaded models: ${error}`);
			res.status(500).json({ error: "Failed to fetch downloaded models" });
		}
	});

	OllamaRouter.get("/available-models", async (_req, res) => {
		try {
			const response = await fetch("https://api.getdione.app/v1/ai/models", {
				method: "GET",
				headers: {
					...(process.env.API_KEY
						? { Authorization: `Bearer ${process.env.API_KEY}` }
						: {}),
				},
			});

			if (!response.ok) {
				const errorText = await response.text();
				logger.error(
					`Failed to fetch models: ${response.status} - ${errorText}`,
				);
				return res.status(response.status).json({
					error: "Failed to fetch models",
					details: errorText,
				});
			}

			const data = await response.json();
			logger.ai(`Available models: ${JSON.stringify(data)}`);
			res.json(data);
		} catch (error) {
			logger.error(`Error fetching models: ${error}`);
			res.status(500).json({ error: "Failed to fetch models" });
		}
	});

	OllamaRouter.post("/download-model", async (req, res) => {
		try {
			const { model } = req.query;
			if (typeof model !== "string") {
				return res.status(400).json({ error: "Model name is required" });
			}

			const stream = await ollama.pull({ model, stream: true });

			for await (const part of stream) {
				let percent = 0;

				if (part.digest) {
					if (
						typeof part.completed === "number" &&
						typeof part.total === "number"
					) {
						percent = Math.round((part.completed / part.total) * 100);
					}
				}

				io.emit("ollama:download-progress", {
					model,
					percentage: percent,
					status: part.status,
				});
			}

			io.emit("ollama:download-progress", {
				model,
				percentage: 100,
				status: "completed",
			});

			res.json({ success: true });
		} catch (err) {
			io.emit("ollama:download-progress", {
				model: req.query.model,
				percentage: 0,
				status: "error",
			});
			res.status(500).json({ error: "Failed to download model" });
		}
	});

	OllamaRouter.post("/chat", async (req, res) => {
		try {
			const {
				model,
				prompt,
				context = "",
				name = "",
				path = "",
				workspaceName = "",
				workspaceFiles = [],
				quickAI = false,
				support = [],
			} = req.body;
			const tools = await getTools();
			const systemprompt = getSysPrompt(
				context,
				name,
				path,
				workspaceFiles,
				workspaceName,
				quickAI,
			);
			const messages = [
				{ role: "system", content: systemprompt },
				{ role: "user", content: prompt },
			];
			logger.ai(`Chat request (prompt): ${prompt}`);
			logger.ai(`Chat request (systemprompt): ${systemprompt}`);
			const finalResponse = await handleOllamaChat({
				model,
				messages,
				tools,
				quickAI,
				support,
			});
			logger.ai(`Chat response: ${JSON.stringify(finalResponse)}`);
			res.json(finalResponse);
		} catch (error: any) {
			logger.error(`Error processing chat request: ${error}`);

			if (error.message.includes("not found")) {
				res.status(500).json({
					error: "Model Not Found",
					message: "Model Not Found, please select a valid model.",
				});
				return;
			}

			res.status(500).json({
				error: `Unexpected error`,
				message: `Unexpected error: ${error}`,
			});
		}
	});

	async function handleOllamaChat({
		model,
		messages,
		tools,
		quickAI,
		support = [],
	}: {
		model: string;
		messages: any[];
		tools: any;
		quickAI: boolean;
		support?: string[];
	}) {
		logger.ai(`Chat request (support): ${JSON.stringify(support)}`);
		let response = await ollama.chat({
			model,
			messages,
			tools: support.includes("tools") ? tools : undefined,
		});
		// repeat until no more tool calls
		while (
			response.message?.tool_calls &&
			response.message.tool_calls.length > 0
		) {
			for (const call of response.message.tool_calls) {
				if (call.function.name === "read_file") {
					logger.ai(`Using tools: ${JSON.stringify(call.function)}`);
					const project = call.function.arguments.project;
					const file = call.function.arguments.file;
					const fileContents = read_file(project, file);
					messages.push({
						role: "tool",
						name: call.function.name,
						content: fileContents,
						tool_call_id: call.id,
					});
				}
			}
			// call ollama again after fulfilling the previous tool calls
			response = await ollama.chat({
				model,
				messages,
				tools: support.includes("tools") ? tools : undefined,
			});
		}
		// if no more tool calls, return response
		return response;
	}

	return OllamaRouter;
}
