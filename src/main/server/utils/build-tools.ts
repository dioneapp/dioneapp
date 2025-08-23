import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import logger from './logger';
import { getEnhancedEnvironment as getBuildToolsEnv, hasVSBuildTools, getVSInfo } from '../scripts/dependencies/files/build_tools';

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
      version: string;
      edition: string;
      path: string;
      vcvarsPath: string;
    }> = [];

    const vsVersions = ['2022', '2019'];
    const editions = ['Enterprise', 'Professional', 'Community', 'BuildTools'];

    for (const version of vsVersions) {
      for (const edition of editions) {
        const paths = [
          `C:\\Program Files\\Microsoft Visual Studio\\${version}\\${edition}`,
          `C:\\Program Files (x86)\\Microsoft Visual Studio\\${version}\\${edition}`
        ];

        for (const vsPath of paths) {
          const vcvarsPath = path.join(vsPath, 'VC', 'Auxiliary', 'Build', 'vcvars64.bat');
          if (fs.existsSync(vcvarsPath)) {
            installations.push({
              version,
              edition,
              path: vsPath,
              vcvarsPath
            });
          }
        }
      }
    }

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

      // First check if we have VS build tools available using the enhanced detection
      if (!hasVSBuildTools()) {
        logger.warn('No Visual Studio installations found - build tools may not work');
        return false;
      }

      const vsInfo = getVSInfo();
      logger.info(`Found VS installations: ${vsInfo.map(i => `${i.version} ${i.edition}`).join(', ')}`);

      // Try to get enhanced environment from build_tools.ts
      try {
        const enhancedEnv = getBuildToolsEnv();
        if (enhancedEnv && enhancedEnv.INCLUDE && enhancedEnv.LIB) {
          this.vcvarsEnv = enhancedEnv;
          logger.info('✅ Using enhanced Visual Studio environment from build_tools');
          this.initialized = true;
          return true;
        }
      } catch (error) {
        logger.warn('Failed to get enhanced environment, falling back to legacy method');
      }

      // Fallback to legacy detection
      const installations = this.detectVSInstallations();
      if (installations.length === 0) {
        logger.warn('No Visual Studio installations found - build tools may not work');
        return false;
      }

      // Use the newest installation
      const latest = installations[0];
      logger.info(`Using VS ${latest.version} ${latest.edition}`);

      // Get vcvars environment
      this.vcvarsEnv = this.getVCVarsEnvironment(latest.vcvarsPath);
      if (!this.vcvarsEnv) {
        logger.error('Failed to get vcvars environment');
        return false;
      }

      // Set npm environment variables
      this.vcvarsEnv.npm_config_msvs_version = latest.version;
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
      return {
        ...baseEnv,
        // Basic environment optimizations
        PYTHONUNBUFFERED: '1',
        NODE_NO_BUFFERING: '1',
        FORCE_UNBUFFERED_OUTPUT: '1',
        PYTHONIOENCODING: 'UTF-8',
        FORCE_COLOR: '1'
      };
    }

    logger.info('Using Visual Studio enhanced environment for native builds');
    return {
      ...baseEnv,
      ...this.vcvarsEnv,
      // Python build optimizations
      PYTHONUNBUFFERED: '1',
      NODE_NO_BUFFERING: '1',
      FORCE_UNBUFFERED_OUTPUT: '1',
      PYTHONIOENCODING: 'UTF-8',
      FORCE_COLOR: '1',
      // Critical Visual C++ environment variables for Python builds
      DISTUTILS_USE_SDK: '1',
      MSSdk: '1'
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

  // Check if build tools are needed for a command
  isNativeBuildCommand(command: string): boolean {
    const buildKeywords = [
      // Node.js package managers
      'npm install',
      'npm i ',
      'yarn install',
      'yarn add',
      'pnpm install',
      'pnpm add',
      'node-gyp',
      'electron-rebuild',
      'prebuild-install',
      // Python package managers and tools
      'pip install',
      'pip3 install',
      'uv add',
      'uv pip install',
      'uv install',
      'conda install',
      'mamba install',
      'poetry install',
      'poetry add',
      'python setup.py',
      'python -m pip',
      'python3 -m pip',
      // Build tools
      'make',
      'cmake',
      'gcc',
      'g++',
      'cl.exe',
      'msbuild',
      'ninja',
      // Rust
      'cargo build',
      'cargo install'
    ];

    const lowerCommand = command.toLowerCase();
    return buildKeywords.some(keyword => lowerCommand.includes(keyword));
  }
}

export default BuildToolsManager;
