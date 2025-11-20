import express from "express";
import { createOllamaRouter } from "./ollama/ollama";
import { Server as SocketIOServer } from "socket.io";

export function createAIRouter(io: SocketIOServer) {
    const AIRouter = express.Router();
    AIRouter.use(express.json());

    // handle ollama calls
    AIRouter.use("/ollama", createOllamaRouter(io));

    return AIRouter;
}
