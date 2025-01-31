import fs from 'fs';
import path from 'path';
import { Response } from 'express';

export async function deleteScript(name: string, res: Response) {
    // sanitize name
    const sanitizedName = name.replace(/\s+/g, '-');

    // delete script dir
    const root = process.cwd(); 
    const appsDir = path.join(root, 'apps');
    const appDir = path.join(appsDir, sanitizedName);

    if (!fs.existsSync(appDir)) {
        res.status(404).send('App not found.');
        return;
    }

    fs.rmSync(appDir, { recursive: true, force: true });
    res.status(200).send('App deleted successfully.');
}