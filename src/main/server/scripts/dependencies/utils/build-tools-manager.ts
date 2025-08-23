import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { readConfig } from '../../../../config';
import logger from '../../../utils/logger';

class BuildToolsManager {
  private static instance: BuildToolsManager;
  private vcvarsEnv: Record<string, string> | null = null;
  private initialized = false;

  private constructor() { }

  static getInstance(): BuildToolsManager {
    if (!BuildToolsManager.instance) {
      BuildToolsManager.instance = new BuildToolsManager();
    }
    return BuildToolsManager.instance;
  }

  // Detect Visual Studio installations
  private detectVSInstallations() {
    const installations: Array<{
      path: string;
      vcvarsPath: string;
    }> = [];

    const settings = readConfig()
    const defaultBinFolder = settings ? path.join(settings.defaultBinFolder, "bin") || path.join(process.cwd(), 'bin') : path.join(process.cwd(), 'bin');
    const vsFolder = path.join(defaultBinFolder, 'build_tools');
    const vcvarsPath = path.join(vsFolder, 'VC', 'Auxiliary', 'Build', 'vcvars64.bat');
        if (fs.existsSync(vcvarsPath)) {
          console.log(`Found VC vars at ${vcvarsPath}`);
          installations.push({
            path: vsFolder,
            vcvarsPath
          });
        }
  

    console.log(`Found VS installations: ${installations.map(i => i.path).join(', ')}`);
    return installations;
  }

  // Get environment variables from vcvars
  private getVCVarsEnvironment(vcvarsPath: string): Record<string, string> | null {
    try {
      const tempScript = path.join(require('node:os').tmpdir(), `vcvars_${Date.now()}.bat`);
      const batchContent = `@echo off
call "${vcvarsPath}" >nul 2>&1
echo VCVARS_ENV_START
set
echo VCVARS_ENV_END`;

      fs.writeFileSync(tempScript, batchContent);

      const output = execSync(`"${tempScript}"`, {
        encoding: 'utf8',
        timeout: 30000,
        windowsHide: true
      });

      fs.unlinkSync(tempScript);

      const envStart = output.indexOf('VCVARS_ENV_START');
      const envEnd = output.indexOf('VCVARS_ENV_END');

      if (envStart === -1 || envEnd === -1) {
        throw new Error('Could not parse vcvars output');
      }

      const envSection = output.substring(envStart + 'VCVARS_ENV_START'.length, envEnd);
      const envVars: Record<string, string> = {};

      for (const line of envSection.split('\n')) {
        const trimmed = line.trim();
        if (trimmed?.includes('=')) {
          const [key, ...valueParts] = trimmed.split('=');
          envVars[key] = valueParts.join('=');
        }
      }

      return envVars;
    } catch (error: any) {
      logger.error(`Failed to get vcvars environment: ${error.message}`);
      return null;
    }
  }

  // Initialize build tools environment
  async initialize(): Promise<boolean> {
    if (this.initialized && this.vcvarsEnv) {
      return true;
    }

    try {
      logger.info('Initializing build tools environment...');

      const installations = this.detectVSInstallations();
      if (installations.length === 0) {
        logger.warn('No Visual Studio installations found - build tools may not work');
        return false;
      }

      logger.info(`Found VS installations: ${installations.join(', ')}`);

      // Use the newest installation
      const latest = installations[0];
      logger.info(`Using VS from ${latest.path}`);

      // Get vcvars environment
      this.vcvarsEnv = this.getVCVarsEnvironment(latest.vcvarsPath);
      if (!this.vcvarsEnv) {
        logger.error('Failed to get vcvars environment');
        return false;
      }

      // Set npm environment variables
      this.vcvarsEnv.npm_config_msvs_version = '2022';
      this.vcvarsEnv.npm_config_node_gyp = 'node-gyp';

      // Try to find Python
      try {
        const pythonPath = execSync('where python', { encoding: 'utf8' }).trim().split('\n')[0];
        if (pythonPath) {
          this.vcvarsEnv.npm_config_python = pythonPath;
          this.vcvarsEnv.PYTHON = pythonPath;
        }
      } catch (e) {
        // Python not found, that's okay for many cases
        logger.info('Python not found in PATH - some native modules may not compile');
      }

      this.initialized = true;
      logger.info('✅ Build tools environment initialized successfully');
      return true;
    } catch (error: any) {
      logger.error(`Failed to initialize build tools: ${error.message}`);
      return false;
    }
  }

  // Get enhanced environment for spawning processes
  getEnhancedEnvironment(baseEnv: Record<string, string> = {}): Record<string, string> {
    if (!this.vcvarsEnv) {
      logger.warn('Build tools not initialized - using base environment');
      return baseEnv;
    }

    return {
      ...baseEnv,
      ...this.vcvarsEnv,
      // Ensure these are set for better compatibility
      PYTHONUNBUFFERED: '1',
      NODE_NO_BUFFERING: '1',
      FORCE_UNBUFFERED_OUTPUT: '1',
      PYTHONIOENCODING: 'UTF-8',
      FORCE_COLOR: '1'
    };
  }

  // Test if build tools are working
  async test(): Promise<boolean> {
    if (!this.vcvarsEnv) {
      logger.error('Build tools not initialized');
      return false;
    }

    try {
      logger.info('Testing build tools...');

      // Test if we can find cl.exe
      try {
        const clPath = execSync('where cl', {
          encoding: 'utf8',
          env: this.vcvarsEnv
        }).trim();
        logger.info(`✅ Found cl.exe: ${clPath.split('\n')[0]}`);
      } catch (e) {
        logger.warn('❌ cl.exe not found in PATH');
        return false;
      }

      // Test if we can find link.exe
      try {
        const linkPath = execSync('where link', {
          encoding: 'utf8',
          env: this.vcvarsEnv
        }).trim();
        logger.info(`✅ Found link.exe: ${linkPath.split('\n')[0]}`);
      } catch (e) {
        logger.warn('❌ link.exe not found in PATH');
        return false;
      }

      logger.info('✅ Build tools test completed successfully');
      return true;
    } catch (error: any) {
      logger.error(`❌ Build tools test failed: ${error.message}`);
      return false;
    }
  }
}

export default BuildToolsManager;