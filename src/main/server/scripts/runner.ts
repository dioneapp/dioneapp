import * as fs from 'fs';
import path from 'path';
import { Server } from 'socket.io';
import logger from '../utils/logger';
import { Action } from './types';
import { execute } from './execute';
import { createEnvironment, executeOnEnvironment, existsEnvironment } from './environment';
import { checkDependency } from './dependencies';

// execute actions
const executeActions = async (actions: Action, io: Server, workingDir: string) => {
    io.emit('installUpdate', { type: 'status', status: 'pending', content: 'Executing actions...' });
    
    // execute dependencies checks
    if (actions.dependencies) {
        io.emit('installUpdate', { type: 'status', status: 'pending', content: 'Checking dependencies...' });
        for (const [depName, depConfig] of Object.entries(actions.dependencies)) {
            const result = await checkDependency(depName, depConfig.version, io, workingDir);
            if (result === 'not_found') {
                io.emit('installUpdate', { type: 'status', status: 'error', content: 'Error detected' })
                io.emit('installUpdate', { type: 'log', content: `ERROR: Aborting... Dependency '${depName}@${depConfig.version}' not found.` });
                return;
            }
        }
        io.emit('installUpdate', { type: 'status', status: 'success', content: 'Dependencies checked' });
    }

    // execute installation commands
    if (actions.installation) {
        io.emit('installUpdate', { type: 'status', status: 'pending', content: 'Installing...' });
        for (const step of actions.installation) {
            // check if env exists
            if (step.env) {
                const exists = await existsEnvironment(step.env, workingDir)
                logger.warn(`${step.env} dont exists in ${workingDir}`)
                if (!exists) {
                    // create env
                    io.emit(`Creating environment '${step.env}' on '${workingDir}'`)
                    logger.info('Creating environment')
                    await createEnvironment(step.env, workingDir, io)
                }
            }
            for (const cmd of step.commands) { 
                io.emit('installUpdate', {type: 'log', content: `${step.name}: ${cmd}`});

                if (cmd.startsWith('cd')) {
                    // change directory
                    const newDir = cmd.split(' ')[1];
                    workingDir = path.resolve(workingDir, newDir); 
                    io.emit('installUpdate', { type: 'log', content: `Actual dir: ${workingDir}` });
                } else if (step.env) {
                    // execute on env if exists
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
                // catch port if exists
                if (command.catch) {
                    logger.info(`Executing script on: http://127.0.0.1://${command.catch}`);
                    io.emit('installUpdate', { type: 'catch', content: command.catch });
                    io.emit('installUpdate', { type: 'log', content: `Watching port ${command.catch}` });
                }
                // execute commands sequentially 
                for (const cmd of command.commands) {
                    if (cmd.startsWith('cd')) {
                        // change directory
                        io.emit('installUpdate', { type: 'log', content: `Changing directory to '${cmd.split(' ')[1]}'` });
                        const newDir = cmd.split(' ')[1];
                        workingDir = path.join(workingDir, newDir);
                    } else {
                        io.emit('installUpdate', { type: 'log', content: `${command.name}` });
                        if (command.env) {
                            // execute on env if exists
                            await executeOnEnvironment(cmd, command.env, workingDir, io)
                        } else  {
                            await execute(cmd, io, workingDir);
                        }
                    }
                }
            }
        } else {
            // not found start action
            io.emit('installUpdate', { type: 'error', content: 'No start action found' });
        }
    } catch (error) {
        console.error('Error starting script:', error);
    }
}

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