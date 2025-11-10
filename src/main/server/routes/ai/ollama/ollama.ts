import express from "express";
import logger from "../../../utils/logger";
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
    const models = await ollama.list();
    logger.ai(`Available models: ${models}`);
    res.json(models);
});

OllamaRouter.post("/chat", async (req, res) => {
    const { model, prompt } = req.body;
    const messages = [{ role: "user", content: prompt }];
    const response = await ollama.chat({ model, messages });
    logger.ai(`Chat started, model: ${model}, prompt: ${prompt}`);
    logger.ai(`Response: ${response}`);
    res.json(response);
});

export default OllamaRouter;