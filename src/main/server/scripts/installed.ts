import fs from 'fs';
import path from 'path';

export default async function getAllScripts() {
   const root = process.cwd();
   const scriptsDir = path.join(root, 'apps');
   const apps = await fs.promises.readdir(scriptsDir);
   console.log('installed apps:', apps);
   return JSON.stringify({ apps });
}

export async function getInstalledScript(name: string) {
   const root = process.cwd();
   const scriptDir = path.join(root, 'apps', name);
   const exists = await fs.promises.readdir(scriptDir);
   return exists ? true : false;
}