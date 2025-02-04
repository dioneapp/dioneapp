import { spawn } from "node:child_process";
import { Server } from "socket.io";
import logger from "../utils/logger";
import pidtree from "pidtree";
import { platform } from "os"; 

let activeProcess: any = null;
let activePID: number | null = null;

// kill process and its children
const killProcess = async (pid: number, io: Server) => {
  try {
    const currentPlatform = platform();
    
    if (currentPlatform === 'win32') {
      // for windows
      spawn('taskkill', ['/PID', pid.toString(), '/T', '/F']);
    } else {
      // macos/linux
      const childPids = await pidtree(pid, { root: true });
      for (const childPid of childPids) {
        process.kill(childPid, 'SIGKILL');
      }
      process.kill(pid, 'SIGKILL');
    }
    io.emit("installUpdate", { type: 'log', content: `Script killed successfully` });
  } catch (error) {
    logger.error(`Cant killing process with PID ${pid}: ${error}`);
  }
};
// is active process running?
export const stopActiveProcess = async (io: Server) => {
  if (activeProcess && activePID) {
    logger.warn(`Stopping process ${activePID} and its children`);
    
    try {
      await killProcess(activePID, io);
      
      // wait to ensure process is killed
      await new Promise((resolve) => {
        activeProcess.on('exit', () => resolve(true));
        setTimeout(resolve, 3000);
      });
      
    } catch (error) {
      logger.error(`Error stopping process: ${error}`);
    } finally {
      activeProcess = null;
      activePID = null;
    }
  }
};
// execute command
export const execute = async (command: string, io: Server, workingDir: string, logs?: string): Promise<string> => {
  if (!logs) logs = "installUpdate";
  let output 
  try {
    await stopActiveProcess(io);

    const currentPlatform = platform();
    const isWindows = currentPlatform === 'win32';
    const isBatchFile = isWindows && (command.endsWith('.bat') || command.endsWith('.cmd'));
    const [executable, ...args] = command.split(/\s+/);

    if (isBatchFile) {
      activeProcess = spawn(
        'cmd.exe',
        ['/c', executable, ...args],
        {
          cwd: workingDir,
          stdio: ['pipe'],
          windowsHide: true 
        }
      );
    } else {
      activeProcess = spawn(
        executable,
        args,
        {
          cwd: workingDir,
          stdio: ['pipe'],
          shell: isWindows,
          windowsHide: true
        }
      );
    }

    activePID = activeProcess.pid;

    const processOutput = (data: Buffer, isError = false) => {
      output = data.toString();
      io.emit(logs, { type: "log", content: output });
      isError ? logger.error(output) : logger.info(output);
    };

    // get output
    activeProcess.stdout.on('data', (data: Buffer) => processOutput(data));
    activeProcess.stderr.on('data', (data: Buffer) => processOutput(data, true));

    // return a promise that resolves when the process exits
    return new Promise<string>((resolve) => {
      activeProcess.on('exit', (code: number) => {
        io.emit(logs, `Process exited with code ${code}`);
        logger.info(`Process exited with code ${code}`);
        activeProcess = null;
        activePID = null;
        if (code === 0) {
          resolve(output);
        } else {
          io.emit(logs, {type: "status", status: "error", content: "Error detected"})
          logger.error(`Process exited with code ${code}`)
          resolve("false")
        }
      });
    });

  } catch (error: any) {
    io.emit(logs, { type: "status", status: "error", content: 'Error detected' });
    io.emit(logs, { type: "log", content: `ERROR: ${error.message}` });
    logger.error(`ERROR: ${error.message}`);
    return "false"
  }
};
