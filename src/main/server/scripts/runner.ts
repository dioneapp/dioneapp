import * as fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { Server } from 'socket.io';
import logger from '../utils/logger';
import semver from 'semver';

// command types
interface Command {
    name: string;
    type: string;
    commands: string[];
    'not-required'?: boolean;
}
// action types
interface Action {
    dependencies?: { [key: string]: { version: string } };
    installation?: Command[];
    start?: Command[];
    stop?: Command[];
    uninstall?: Command[];
}
// dependency types
interface DependencyChecks {
    command: string,
    altCommand?: string,
    versionRegex: RegExp
}
// check dependencies commands
const dependencyCheckers: {[key: string]: DependencyChecks} = {
    git: {
        command: 'git --version',
        versionRegex: /git version (\d+\.\d+\.\d+)/,
    },
    python: {
        command: 'python --version',
        altCommand: 'python3 --version',
        versionRegex: /Python (\d+\.\d+\.\d+)/,
    },
    conda: {
        command: 'conda --version',
        versionRegex: /conda (\d+\.\d+\.\d+)/,
    }
}
// check if dependency is installed
const checkDependency = async (
    depName: string,
    requiredVersion: string,
    io: Server,
    workingDir: string
): Promise<void> => {
    const checker = dependencyCheckers[depName];
    if (!checker) {
        io.emit("installUpdate", { type: 'error', content: `Error: Dependency '${depName}' is not suported` });
        logger.error(`Error: Dependency '${depName}' is not suported`);
    }

    let version: string | null = null
    try {
        let output = await runCommand(checker.command, io, workingDir, "dependency")
        const match = output.match(checker.versionRegex);
        if (match) version = match[1];

        // try alt command
        if (!version && checker.altCommand) {
            output = await runCommand(checker.altCommand, io, workingDir, "dependency")
            const altMatch = output.match(checker.versionRegex);
            if (altMatch) version = altMatch[1];
        }
    } catch (error) {
        io.emit("installUpdate", { type: 'error', content: `Error checking dependency '${depName}': ${error}` });
        logger.error(`Error checking dependency '${depName}': ${error}`);
    }
    if (!version) {
        io.emit("installUpdate", { type: 'error', content: `Error: Dependency '${depName}' not found` });
        logger.error(`Error: Dependency '${depName}' not found`);
    }
    if (requiredVersion.toLowerCase() === 'latest') {
        io.emit("installUpdate", {type: 'log', content: `✓ Dependency '${depName}' ${version} found`});
        return;
    }
    if (!semver.satisfies(version, requiredVersion)) {
        io.emit("installUpdate", { type: 'error', content: `Error: Dependency '${depName}' version ${version} does not satisfy ${requiredVersion}` });
        logger.error(`Error: Dependency '${depName}' version ${version} does not satisfy ${requiredVersion}`);
    }

    io.emit("installUpdate", {type: 'log', content: `✓ Dependency '${depName}' ${version} found.`});
}
// run command
const runCommand = (command: string, io: Server, workingDir: string, type?: string): Promise<string> => {
  if (command.endsWith('.bat')) {
    command = `cmd /c start "" "${command}"`;
  }
    return new Promise((resolve, reject) => {
        exec(command, { cwd: workingDir, encoding: 'utf8' }, (error, stdout, stderr) => {
            if (error) {
                logger.error("Error executing command:", command);
                logger.error(stderr);
                io.emit('installUpdate', { type: 'error', content: stderr });
                reject(error);
            } else {
                logger.info("Command executed:", command);
                logger.info(stdout);
                io.emit('installUpdate', { type: 'log', content: `Executing command: '${command}'` });
                if (type !== 'dependency') {
                    io.emit('installUpdate', { type: 'log', content: `Command response: '${stdout || undefined}'` });
                }
                resolve(stdout);
            }
        });
    });
};

// execute actions
const executeActions = async (actions: Action, io: Server, workingDir: string) => {
    io.emit('installUpdate', { type: 'status', status: 'pending', content: 'Executing actions...' });
    // execute dependencies checks
    if (actions.dependencies) {
        io.emit('installUpdate', {type: 'status', status: 'pending', content: 'Checking dependencies...'});
        for (const [depName, depConfig] of Object.entries(actions.dependencies)) {
            await checkDependency(depName, depConfig.version, io, workingDir);
        }
        io.emit('installUpdate', {type: 'status', status: 'success', content: 'Dependencies checked'});
    }
    // execute installation commands
    if (actions.installation) {
        io.emit('installUpdate', { type: 'status', status: 'pending', content: 'Installing...' });
        for (const command of actions.installation) {
            for (const cmd of command.commands) {
                io.emit('installUpdate', { type: 'log', content: `${command.name}: ${command.commands}` });
                if (cmd.startsWith('cd')) {
                    io.emit('installUpdate', { type: 'log', content: `Changing directory to '${cmd.split(' ')[1]}'` });
                    const newDir = cmd.split(' ')[1];
                    workingDir = path.join(workingDir, newDir);
                } else {
                  await runCommand(cmd, io, workingDir);
                }
            }
        }
    }

    io.emit('installUpdate', { type: 'status', status: 'success', content: 'Actions executed' });
};
// start script
export const startScript = async (workingDir: string, io: Server) => {
    try {
        io.emit('installUpdate', 'Starting script...');
        const dioneFile = path.join(workingDir, 'dione.json');
        const data = fs.readFileSync(dioneFile, 'utf8');
        const actions: Action = JSON.parse(data);
        // read start action
        if (actions.start) {
            io.emit('installUpdate', 'Starting...');
            for (const command of actions.start) {
                io.emit('installUpdate', `${command.name}`);
                for (const cmd of command.commands) {
                    await runCommand(cmd, io, workingDir);
                }
            }
        } else {
            io.emit('installUpdate', { type: 'error', content: 'No start action found' });
        }
    } catch (error) {
        console.error('Error starting script:', error);
    }
}
// stop script
export const stopScript = async (workingDir: string, io: Server) => {
    try {
        io.emit('installUpdate', 'Stopping script...');
        const dioneFile = path.join(workingDir, 'dione.json');
        const data = fs.readFileSync(dioneFile, 'utf8');
        const actions: Action = JSON.parse(data);
        // read stop action
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
// uninstall script
export const uninstallScript = async (workingDir: string, io: Server) => {
    try {
        io.emit('installUpdate', 'Uninstalling script...');
        const dioneFile = path.join(workingDir, 'dione.json');
        const data = fs.readFileSync(dioneFile, 'utf8');
        const actions: Action = JSON.parse(data);
        // read uninstall action
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
// read dione.json file
export const runActions = async (workingDir: string, io: Server) => {
    try {
        io.emit('installUpdate', { type: 'status', status: 'pending', content: 'Reading actions...' });
        const dioneFile = path.join(workingDir, 'dione.json');
        const data = fs.readFileSync(dioneFile, 'utf8');
        const actions: Action = JSON.parse(data);
        
        await executeActions(actions, io, workingDir);
    } catch (error) {
        console.error('Error reading or executing actions:', error);
    }
};