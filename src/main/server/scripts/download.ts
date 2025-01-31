import fs from 'fs';
import path from 'path';
import { Response } from 'express';
import { Server as SocketIO } from 'socket.io';
import { supabase } from '../utils/database';
import logger from '../utils/logger';
import * as git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import { runActions } from './runner';

export async function getScripts(id: string, res: Response, io: SocketIO): Promise<void> {
  const root = process.cwd();
  io.emit('installUpdate', { type: 'status', status: 'pending', content: `Searching script...` });

  // get script from db
  const { data, error } = await supabase
    .from('scripts')
    .select('script_url,name,version')
    .eq('id', id)
    .single();

  if (error || !data) {
    io.emit('installUpdate', { type: 'error', content: `Script not found in database` });
    res.status(404).send('Script not found.');
    logger.error(`Script ${id} not found in database.`);
    return;
  }

  logger.info(`Cloning scripts from ${data.name} with version ${data.version}.`);
  io.emit('installUpdate', { type: 'log', content: `Found script '${data.name}' with version '${data.version}'` });
  io.emit('installUpdate', { type: 'status', status: 'success', content: 'Script founded' });

  const sanitizedScriptName = data.name.replace(/\s+/g, '-');
  const saveDirectory = path.join(root, 'apps', sanitizedScriptName);
  io.emit('installUpdate', { type: 'log', content: `Cloning script to '${saveDirectory}'` });	
  io.emit('installUpdate', { type: 'status', status: 'pending', content: `Cloning script...` });

  if (!fs.existsSync(saveDirectory)) {
    // make app dir
    fs.mkdirSync(saveDirectory, { recursive: true });
  }

  try {
    // clone script repo
    await git.clone({
      fs,
      http,
      dir: saveDirectory,
      url: data.script_url,
      singleBranch: true,
      depth: 1,
    });
    io.emit('installUpdate', { type: 'status', status: 'success', content: 'Script cloned' });

    // run install 
    await runActions(saveDirectory, io);

    io.emit('installUpdate', 'All files cloned successfully.');
    res.status(200).send('All files cloned successfully.');
  } catch (err) {
    io.emit('installUpdate', { type: 'error', content: `Error detected` });
    io.emit('installUpdate', 'Error cloning scripts:', err);
    res.status(500).send('Error cloning scripts.');
    logger.error(`Error cloning scripts from ${data.name}:`, err);
  }
}
