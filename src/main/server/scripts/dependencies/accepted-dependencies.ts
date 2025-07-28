import { Server } from 'socket.io';
import * as git from './files/git';
import * as conda from './files/conda';
import * as uv from './files/uv';
import * as ffmpeg from './files/ffmpeg';
import * as node from './files/node';
import * as pnpm from './files/pnpm';

export const dependencyRegistry: Record<
  string,
  {
    isInstalled: (binFolder: string) => Promise<{
      installed: boolean;
      reason: string;
    }>
    install: (binFolder: string, id: string, io: Server) => Promise<{success: boolean}>;
    uninstall: (binFolder: string) => Promise<void>;
  }
> = {
  git,
  conda,
  uv,
  ffmpeg,
  node,
  pnpm
};
