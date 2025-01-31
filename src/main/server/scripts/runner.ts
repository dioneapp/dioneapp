import * as fs from 'fs';
import path from 'path';
import { Server } from 'socket.io';
import logger from '../utils/logger';
import * as semver from 'semver';
import { Action, DependencyChecks } from './types';
import { execute } from './execute';
import { createEnvironment, executeOnEnvironment, existsEnvironment } from './environment';

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
    },
    node: {
        command: 'npm --version',
        versionRegex: /(\d+\.\d+\.\d+)/,
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
        let output = await execute(checker.command, io, workingDir, "dependency") || ''
        const match = output.match(checker.versionRegex);
        if (match) version = match[1];

        // try alt command
        if (!version && checker.altCommand) {
            output = await execute(checker.altCommand, io, workingDir, "dependency") || ''
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
    if (!semver.satisfies(version, requiredVersion)) {
        io.emit("installUpdate", { type: 'error', content: `Error: Dependency '${depName}' version ${version} does not satisfy ${requiredVersion}` });
        logger.error(`Error: Dependency '${depName}' version ${version} does not satisfy ${requiredVersion}`);
    }

    io.emit("installUpdate", {type: 'log', content: `✓ Dependency '${depName}' found.`});
}

// execute actions
const executeActions = async (actions: Action, io: Server, workingDir: string) => {
    io.emit('installUpdate', { type: 'status', status: 'pending', content: 'Executing actions...' });
    
    // execute dependencies checks
    if (actions.dependencies) {
        io.emit('installUpdate', { type: 'status', status: 'pending', content: 'Checking dependencies...' });
        for (const [depName, depConfig] of Object.entries(actions.dependencies)) {
            await checkDependency(depName, depConfig.version, io, workingDir);
        }
        io.emit('installUpdate', { type: 'status', status: 'success', content: 'Dependencies checked' });
    }

    // execute installation commands
    if (actions.installation) {
        io.emit('installUpdate', { type: 'status', status: 'pending', content: 'Installing...' });
        for (const step of actions.installation) {
            if (step.env) {
                const exists = await existsEnvironment(step.env, workingDir)
                logger.warn(`${step.env} dont exists in ${workingDir}`)
                if (!exists) {
                    io.emit(`Creating environment '${step.env}' on '${workingDir}'`)
                    logger.info('Creating environment')
                    await createEnvironment(step.env, workingDir, io)
                }
            }
            for (const cmd of step.commands) { 
                io.emit('installUpdate', { 
                    type: 'log', 
                    content: `${step.name}: ${cmd}` 
                });

                if (cmd.startsWith('cd')) {
                    const newDir = cmd.split(' ')[1];
                    workingDir = path.resolve(workingDir, newDir); 
                    io.emit('installUpdate', { type: 'log', content: `Actual dir: ${workingDir}` });
                } else if (step.env) {
                    await executeOnEnvironment(cmd, step.env, workingDir, io)
                } else  {
                    await execute(cmd, io, workingDir);
                }
            }
        }
    }

    // this message is always shown, even if there are errors. check the logs for detailed error information
    io.emit('installUpdate', { type: 'status', status: 'success', content: 'Actions executed' });
};

// start script
export const startScript = async (workingDir: string, io: Server) => {
    try {
        io.emit('installUpdate', { type: 'log', content: 'Reading script...' });
        const dioneFile = path.join(workingDir, 'dione.json');
        const data = fs.readFileSync(dioneFile, 'utf8');
        const actions: Action = JSON.parse(data);
        // read start action
        if (actions.start) {
            io.emit('installUpdate', { type: 'status', status: 'pending', content: 'Starting script...' });
            for (const command of actions.start) {
                if (command.catch) {
                    logger.info(`Executing script on: http://127.0.0.1://${command.catch}`);
                    io.emit('installUpdate', { type: 'catch', content: command.catch });
                    io.emit('installUpdate', { type: 'log', content: `Watching port ${command.catch}` });
                }
                for (const cmd of command.commands) {
                    if (cmd.startsWith('cd')) {
                        io.emit('installUpdate', { type: 'log', content: `Changing directory to '${cmd.split(' ')[1]}'` });
                        const newDir = cmd.split(' ')[1];
                        workingDir = path.join(workingDir, newDir);
                    } else {
                        io.emit('installUpdate', { type: 'log', content: `${command.name}` });
                        if (command.env) {
                            await executeOnEnvironment(cmd, command.env, workingDir, io)
                        } else  {
                            await execute(cmd, io, workingDir);
                        }
                    }
                }
            }
        } else {
            io.emit('installUpdate', { type: 'error', content: 'No start action found' });
        }
    } catch (error) {
        console.error('Error starting script:', error);
    }
}

// stop script, probably dont need this
// export const stopScript = async (workingDir: string, io: Server) => {
//     try {
//         io.emit('installUpdate', 'Stopping script...');
//         const dioneFile = path.join(workingDir, 'dione.json');
//         const data = fs.readFileSync(dioneFile, 'utf8');
//         const actions: Action = JSON.parse(data);
//         // read stop action
//         if (actions.stop) {
//             io.emit('installUpdate', 'Stopping...');
//             for (const command of actions.stop) {
//                 io.emit('installUpdate', `${command.name}`);
//                 for (const cmd of command.commands) {
//                     await execute(cmd, io, workingDir);
//                 }
//             }
//         }
//     } catch (error) {
//         console.error('Error stopping script:', error);
//     }

//     io.emit('installUpdate', { type: 'log', content: 'Process exited with code 1' });
// };

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
                    await execute(cmd, io, workingDir);
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
        io.emit('installUpdate', {type: "log", content: `ERROR: '${error}'`})
        io.emit('installUpdate', {type: "status", status: "error", content: "Error found"})
        console.error('Error reading or executing actions:', error);
    }
};