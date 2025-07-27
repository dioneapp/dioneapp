import { Server } from 'socket.io';
import * as git from './files/git';

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
  git
};
