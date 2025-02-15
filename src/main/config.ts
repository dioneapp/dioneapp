import { app } from "electron";
import path from "path";
import fs from 'fs';
import logger from "./server/utils/logger";

export interface AppConfig {
    firstLaunch: boolean;
}

// get config file
export const getConfigPath = () => {
    return path.join(app.getPath('userData'), 'config.json');
};
  
// read config
export const readConfig = (): AppConfig | null => {
    try {
        const configPath = getConfigPath();
        if (fs.existsSync(configPath)) {
        return JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }
        return null;
    } catch (error) {
        logger.error('Error reading configuration:', error);
        return null;
    }
};

// write config
export const writeConfig = (config: AppConfig) => {
    fs.writeFileSync(getConfigPath(), JSON.stringify(config));
};
  