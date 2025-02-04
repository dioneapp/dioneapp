import fs from 'fs';
import path from 'path';
import logger from '../utils/logger';

export default async function getAllScripts() {
   const root = process.cwd();
   const scriptsDir = path.join(root, 'apps');
   try {
      const apps = await fs.promises.readdir(scriptsDir);
      if (apps.length === 0) {
         logger.info('No installed apps found.');
         return JSON.stringify({ apps: [] });
      }
      console.log('founded apps:', apps)
      return JSON.stringify({ apps });
   } catch (error) {
      logger.error('Error reading apps directory:', error);
      return JSON.stringify({ apps: [] });
   }
}

export async function getInstalledScript(name: string) {
   const root = process.cwd();
   const sanitizedName = name.replace(/\s+/g, '-');
   const scriptDir = path.join(root, 'apps', sanitizedName);
   try {
      await fs.promises.readdir(scriptDir);
      return true;
   } catch (error) {
      return false;
   }
}