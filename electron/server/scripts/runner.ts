import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { Server } from 'socket.io';
import { promisify } from 'util';

const execAsync = promisify(exec);

// run shell command
async function runCommand(command: string, directory: string, io: Server, venv: string | null) {
  io.emit('installUpdate', `Executing '${command}' in ${directory}`);

  if (venv) {
    command = `${path.join(venv, 'Scripts', 'activate')} && ${command}`;
  }

  try {
    const { stdout, stderr } = await execAsync(command, { cwd: directory });
    if (stdout) io.emit('installUpdate', stdout);
    if (stderr) io.emit('installUpdate', stderr);
  } catch (error: any) {
    throw new Error(`Error executing '${command}': ${error.message}`);
  }
}

export class ActionRunner {
  constructor(private io: Server) {}

  // run script actions
  async runActions(scriptPath: string, workingDirectory: string) {
    try {
      const content = fs.readFileSync(scriptPath, 'utf-8');
      const data = eval('(' + content.replace('module.exports =', '').trim() + ')');
      const actions = data.run || [];
      const args = data.args || {};

      // get platform and gpu
      const platform = process.platform;
      const gpu = args.gpu || 'unknown';

      for (const { method, params, when } of actions) {
        // evaluate condition 
        if (when && !this.evaluateCondition(when, { platform, gpu, args })) {
          this.io.emit('info', `Skipping: ${method} due to condition: ${when}`);
          continue;
        }

        this.io.emit('info', `Executing: ${method}`);

        if (method === 'shell.run') {
          // run shell command
          const commands = Array.isArray(params.message) ? params.message : [params.message];
          const actionDir = params.path ? path.join(workingDirectory, params.path) : workingDirectory;
          for (const cmd of commands) {
            await runCommand(cmd, actionDir, this.io, params.venv);
          }
        } else if (method === 'script.start') {
          // run other script
          const fullPath = path.join(workingDirectory, params.uri);
          await this.runScript(fullPath, params.params);
        }
      }

      this.io.emit('installUpdate', 'All finished successfully');
    } catch (error: any) {
      this.io.emit('installUpdate', `An error occurred: ${error.message}`);
      throw error;
    }
  }

  // run other script
  async runScript(scriptPath: string, params: any) {
    if (params.uri) {
      this.io.emit('installUpdate', `Executing '${params.uri}' in ${params.path}`);
      await this.runActions(scriptPath, params.path);
    }
  }

  // evaluate conditions
  private evaluateCondition(condition: string, context: { platform: string; gpu: string; args: any }): boolean {
    const evalCondition = condition
      .replace(/{{platform}}/g, `'${context.platform}'`)
      .replace(/{{gpu}}/g, `'${context.gpu}'`)
      .replace(/{{args && args.venv ? args.venv : null}}/g, context.args.venv ? `'${context.args.venv}'` : 'null')
      .replace(/{{args && args.path ? args.path : '.'}}/g, context.args.path ? `'${context.args.path}'` : "'.'")
      .replace(/{{args && args.xformers ? 'xformers' : ''}}/g, context.args.xformers ? "'xformers'" : "''");

    return eval(evalCondition);
  }
}
