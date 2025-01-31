import { Server } from "socket.io";
import { execute } from "./execute";
import logger from "../utils/logger";
import * as fs from 'fs';
import * as path from 'path';

export const existsEnvironment = async (envName: string, workingDir: string) => {
    try {
        const envPath = path.join(workingDir, envName);
        if (fs.existsSync(envPath) && fs.lstatSync(envPath).isDirectory()) {
            logger.info(`Environment '${envName}' exists in '${workingDir}'`);
            return true;
        } else {
            logger.info(`Environment '${envName}' does not exist in '${workingDir}'`);
            return false;
        }
    } catch {
        logger.error(`Error searching if ${envName} exists`)
        return false
    }
}

export const createEnvironment = async (envName: string, workingDir: string, io: Server) => {
    try {
        const command = process.platform === "win32" ? `python -m venv ${envName}` : `python3 -m venv ${envName}`;
        logger.info(`Creating environment with command '${command}' on '${workingDir}'`)
        await execute(command, io, workingDir);
    } catch (error: any) {
        logger.error(`An error ocurred creating an environment: ${error}`)
    }
}

export const executeOnEnvironment = async (command: string, envName: string, workingDir: string, io: Server) => {
    try {
        const commandPath = `${workingDir}/${envName}/${process.platform === "win32" ? "Scripts/python.exe" : "bin/python"} -m ${command}`;
        logger.info(`Executing ${command} on env '${envName}'`)
        await execute(commandPath, io, workingDir)
    } catch (error: any) {
        io.emit('installUpdate', {type: 'log', content: `ERROR: ${error}`})
        io.emit('installUpdate', {type: 'status', status: 'error', content: 'Error detected'})
        logger.error(`An error ocurred: ${error}`)
    }
}