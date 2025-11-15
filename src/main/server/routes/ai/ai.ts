import express from "express";
import OllamaRouter from "./ollama/ollama";

const AIRouter = express.Router();
AIRouter.use(express.json());

// handle ollama calls
AIRouter.use("/ollama", OllamaRouter);

export default AIRouter;
