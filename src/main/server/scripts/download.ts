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
  io.emit('installUpdate', `Searching script in database...`);

  // get script from db
  const { data, error } = await supabase
    .from('scripts')
    .select('script_url,name,version')
    .eq('id', id)
    .single();

  if (error || !data) {
    io.emit('installUpdate', 'Script not found in database.');
    res.status(404).send('Script not found.');
    logger.error(`Script ${id} not found in database.`);
    return;
  }

  logger.info(`Cloning scripts from ${data.name} with version ${data.version}.`);
  io.emit('installUpdate', `Found ${data.name} script with version ${data.version}.`);
  const saveDirectory = path.join(root, 'apps', data.name);
  io.emit('installUpdate', `Cloning at ${saveDirectory}...`);

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

    // run install 
    await runActions(saveDirectory, io);

    io.emit('installUpdate', 'All files cloned successfully.');
    res.status(200).send('All files cloned successfully.');
  } catch (err) {
    io.emit('installUpdate', 'Error cloning scripts.');
    res.status(500).send('Error cloning scripts.');
    logger.error(`Error cloning scripts from ${data.name}:`, err);
  }
}
