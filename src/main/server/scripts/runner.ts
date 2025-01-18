import * as fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { Server } from 'socket.io';
import logger from '../utils/logger';

interface Command {
    name: string;
    type: string;
    commands: string[];
    'not-required'?: boolean;
}

interface Action {
    dependencies?: { [key: string]: { version: string } };
    installation?: Command[];
    start?: Command[];
    stop?: Command[];
    uninstall?: Command[];
}

const runCommand = (command: string, io: Server, workingDir: string): Promise<void> => {
  if (command.endsWith('.bat')) {
    command = `cmd /c start "" "${command}"`;
  }
  
    return new Promise((resolve, reject) => {
        exec(command, { cwd: workingDir, }, (error, stdout, stderr) => {
            if (error) {
                logger.error("Error executing command:", command);
                logger.error(stderr);
                io.emit('installUpdate', 'Error executing command:', command);
                io.emit('installUpdate', stderr);
                reject(error);
            } else {
                logger.info("Command executed:", command);
                logger.info(stdout);
                io.emit('installUpdate', stdout);
                resolve();
            }
        });
    });
};

const executeActions = async (actions: Action, io: Server, workingDir: string) => {
    io.emit('installUpdate', 'Executing actions...');
    if (actions.installation) {
        io.emit('installUpdate', 'Installing...');
        for (const command of actions.installation) {
            io.emit('installUpdate', `Executing step: ${command.name}`);
            for (const cmd of command.commands) {
                if (cmd.startsWith('cd')) {
                    io.emit('installUpdate', `Changing directory to ${cmd.split(' ')[1]}`);
                    const newDir = cmd.split(' ')[1];
                    workingDir = path.join(workingDir, newDir);
                } else {
                  await runCommand(cmd, io, workingDir);
                }
            }
        }
    }
};

export const startScript = async (workingDir: string, io: Server) => {
    try {
        io.emit('installUpdate', 'Starting script...');
        const dioneFile = path.join(workingDir, 'dione.json');
        const data = fs.readFileSync(dioneFile, 'utf8');
        const actions: Action = JSON.parse(data);

        if (actions.start) {
            io.emit('installUpdate', 'Starting...');
            for (const command of actions.start) {
                io.emit('installUpdate', `${command.name}`);
                for (const cmd of command.commands) {
                    await runCommand(cmd, io, workingDir);
                }
            }
        } else {
            io.emit('installUpdate', 'No start commands found.');
        }
    } catch (error) {
        console.error('Error starting script:', error);
    }
}

export const stopScript = async (workingDir: string, io: Server) => {
    try {
        io.emit('installUpdate', 'Stopping script...');
        const dioneFile = path.join(workingDir, 'dione.json');
        const data = fs.readFileSync(dioneFile, 'utf8');
        const actions: Action = JSON.parse(data);

        if (actions.stop) {
            io.emit('installUpdate', 'Stopping...');
            for (const command of actions.stop) {
                io.emit('installUpdate', `${command.name}`);
                for (const cmd of command.commands) {
                    await runCommand(cmd, io, workingDir);
                }
            }
        }
    } catch (error) {
        console.error('Error stopping script:', error);
    }
};

export const uninstallScript = async (workingDir: string, io: Server) => {
    try {
        io.emit('installUpdate', 'Uninstalling script...');
        const dioneFile = path.join(workingDir, 'dione.json');
        const data = fs.readFileSync(dioneFile, 'utf8');
        const actions: Action = JSON.parse(data);

        if (actions.uninstall) {
            io.emit('installUpdate', 'Uninstalling...');
            for (const command of actions.uninstall) {
                io.emit('installUpdate', `${command.name}`);
                for (const cmd of command.commands) {
                    await runCommand(cmd, io, workingDir);
                }
            }
        }
    } catch (error) {
        console.error('Error uninstalling script:', error);
    }
};

export const runActions = async (workingDir: string, io: Server) => {
    try {
        io.emit('installUpdate', 'Reading actions...');
        const dioneFile = path.join(workingDir, 'dione.json');
        const data = fs.readFileSync(dioneFile, 'utf8');
        const actions: Action = JSON.parse(data);
        
        await executeActions(actions, io, workingDir);
    } catch (error) {
        console.error('Error reading or executing actions:', error);
    }
};