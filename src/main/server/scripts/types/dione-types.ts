/**
 * Environment variable definition for dione.json steps
 */
export interface Variable {
	/** Variable name/key */
	key: string;
	/** Variable value */
	value: string;
}

/**
 * Environment specification for virtual environments
 */
export interface VirtualEnvironment {
	/** Environment name */
	name: string;
	/** Environment type (uv, conda, etc.) */
	type?: string;
	/** Python version */
	version?: string;
}

/**
 * Step definition in dione.json installation/start sections
 */
export interface DioneStep {
	/** Step description/name */
	name: string;
	/** Commands to execute */
	commands: string[] | object[];
	/** Optional environment variables for the step */
	variables?: Variable[];
	/** Optional virtual environment specification */
	env?: string | VirtualEnvironment;
	/** Whether to run commands in parallel */
	parallel?: boolean;
	/** Error handling configuration */
	catch?: any;
}
