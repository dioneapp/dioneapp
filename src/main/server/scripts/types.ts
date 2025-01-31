// command types
export interface Command {
    name: string;
    type: string;
    commands: string[];
    'not-required'?: boolean;
    catch?: number;
    env?: string;
}
// action types
export interface Action {
    dependencies?: { [key: string]: { version: string } };
    installation?: Command[];
    start?: Command[];
    stop?: Command[];
    uninstall?: Command[];
}
// dependency types
export interface DependencyChecks {
    command: string,
    altCommand?: string,
    versionRegex: RegExp
}