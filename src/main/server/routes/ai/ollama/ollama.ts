import express from "express";
import logger from "../../../utils/logger";
import { getSysPrompt } from "../instructions/instructions";
const { Ollama } = require('ollama');

const OllamaRouter = express.Router();
OllamaRouter.use(express.json());

const ollama = new Ollama({
    url: "http://localhost:11434",
});

OllamaRouter.get("/", (req, res) => {
    res.json({ message: "Ollama API is working" });
});

OllamaRouter.get("/models", async (req, res) => {
    try {
        const response = await ollama.list();
        const modelNames = response.models.map((m: { name: string }) => m.name).join(', ');
        logger.ai(`Available models: ${modelNames}`);
        res.json(response);
    } catch (error) {
        logger.error(`Error fetching models: ${error}`);
        res.status(500).json({ error: 'Failed to fetch models' });
    }
});

OllamaRouter.post("/chat", async (req, res) => {
    const isOllamaOpen = await fetch("http://localhost:11434/health", { method: "GET" }).then(res => res.ok);
    if (!isOllamaOpen) {
        logger.ai("Ollama is not open");
        res.status(500).json({ error: 'Ollama is not open' });
        return;
    }

    try {
        const { model, prompt } = req.body
        const systemprompt = await getSysPrompt()
        const messages = [{role: "system", content: systemprompt}, { role: "user", content: prompt }];
        logger.ai(`Chat started, model: ${model}, prompt: ${prompt}`);
        
        const response = await ollama.chat({ model, messages });
        const responseText = response.message?.content || 'No content in response';
        logger.ai(`Response from ${model}: ${responseText.substring(0, 200)}${responseText.length > 200 ? '...' : ''}`);
        
        res.json(response);
    } catch (error) {
        logger.error(`Chat error: ${error}`);
        res.status(500).json({ error: 'Failed to process chat request' });
    }
});

export default OllamaRouter;