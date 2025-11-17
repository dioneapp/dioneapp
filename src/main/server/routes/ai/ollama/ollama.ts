import express from "express";
import logger from "../../../utils/logger";
import { getSysPrompt } from "../instructions/instructions";
import { getTools, readFile } from "./tools";
const { Ollama } = require("ollama");

const OllamaRouter = express.Router();
OllamaRouter.use(express.json());

const ollama = new Ollama({
	url: "http://localhost:11434",
});

OllamaRouter.get("/", (_req, res) => {
	res.json({ message: "Ollama API is working" });
});

OllamaRouter.get("/models", async (_req, res) => {
	try {
		const response = await ollama.list();
		const modelNames = response.models
			.map((m: { name: string }) => m.name)
			.join(", ");
		logger.ai(`Available models: ${modelNames}`);
		res.json(response);
	} catch (error) {
		logger.error(`Error fetching models: ${error}`);
		res.status(500).json({ error: "Failed to fetch models" });
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
			workspacePath = "",
			quickAI = false,
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
			workspacePath,
			quickAI,
		});
		logger.ai(`Chat response: ${JSON.stringify(finalResponse)}`);
		res.json(finalResponse);
	} catch (error) {
		logger.error(`Error processing chat request: ${error}`);
		res.status(500).json({ error: `Failed to process chat request: ${error}` });
	}
});

async function handleOllamaChat({
	model,
	messages,
	tools,
	workspacePath,
	quickAI,
}) {
	let response = await ollama.chat({
		model,
		messages,
		tools: quickAI ? [] : tools,
	});
	// repeat until no more tool calls
	while (
		response.message?.tool_calls &&
		response.message.tool_calls.length > 0
	) {
		for (const call of response.message.tool_calls) {
			if (call.function.name === "read_file" && !quickAI) {
				logger.ai(`Using tools: ${JSON.stringify(call.function)}`);
				const safePath = call.function.arguments.file_path;
				const fileContents = readFile(safePath, workspacePath);
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
			tools: quickAI ? [] : tools,
		});
	}
	// if no more tool calls, return response
	return response;
}
export default OllamaRouter;
