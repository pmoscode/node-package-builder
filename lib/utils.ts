import fs from 'fs';
import path from 'path';
import { getLogger } from './logger';

/**
 * This is the util class for the worker.
 * It handels the path operation, the load and save of the packages (json) and provides a simple way of checking the passed cli args.
 */
export class Utils {
    /**
     * Path to the package.json file.
     *
     * @private
     */
    private readonly packageJsonPath: string;

    /**
     * Path to the selected environment json file.
     *
     * @private
     */
    private readonly environmentJsonPath: string;

    /**
     * Path to the backup file which is made of the original package.json.
     *
     * @private
     */
    private readonly backupJsonPath: string;

    /**
     * The logger.
     *
     * @private
     */
    private readonly logger = getLogger('utils');

    /**
     * The class constructor.
     *
     * @param parsedArgs The parsed arguments passed via cli
     */
    constructor(private parsedArgs: any) {
        const rootFolder = process.cwd();
        this.packageJsonPath = path.join(rootFolder, 'package.json');
        this.environmentJsonPath = path.join(
            rootFolder,
            this.parsedArgs.env_dir,
            `${this.parsedArgs.environment}.json`,
        );
        this.backupJsonPath = path.join(rootFolder, this.parsedArgs.env_dir, this.parsedArgs.backup_name);
    }

    /**
     * Get the selected environment name.
     *
     * @returns The environment name
     */
    public getEnvironment(): string {
        return this.parsedArgs.environment;
    }

    /**
     * Checks if the environment should be resetted. Means: If the original package.json should be restored.
     *
     * @returns True / False
     */
    public isResetEnvironment(): boolean {
        return this.parsedArgs.environment.toLowerCase() == '__reset__';
    }

    /**
     * Checks if the user wishes to replace the original package.json with the environmental one instead of merging it.
     *
     * @returns True / False
     */
    public isReplace(): boolean {
        return this.parsedArgs.replace;
    }

    /**
     * Checks if the user wishes to include a marker in the package.json to identify the change by the Node Package Builder.
     *
     * @returns True / False
     */
    public isIncludeEnvironment(): boolean {
        return this.parsedArgs.include_environment;
    }

    /**
     * Checks if the user wished only a dry run. Means: No changes are made; just display the changes which would have been made in the console.
     *
     * @returns True / False
     */
    public isDryRun(): boolean {
        return this.parsedArgs.dry_run;
    }

    /**
     * Checks for verbose level 1.
     *
     * @returns True / False
     */
    public isVerboseL1(): boolean {
        return this.parsedArgs.verbose >= 1;
    }

    /**
     * Checks for verbose level 2.
     *
     * @returns True / False
     */
    public isVerboseL2(): boolean {
        return this.parsedArgs.verbose >= 2;
    }

    /**
     * Checks if a backup of the package.json exists.
     *
     * @returns True / False
     */
    public isBackupExisting(): boolean {
        return fs.existsSync(this.backupJsonPath);
    }

    /**
     * Replace the generated package.json with the original one.
     */
    public restoreBackup() {
        try {
            fs.copyFileSync(this.backupJsonPath, this.packageJsonPath);
            fs.unlinkSync(this.backupJsonPath);
        } catch (e) {
            this.logError(`Could not find backup file '${this.backupJsonPath}'!`, e);
        }
    }

    /**
     * Loads the package.json if possible. If not: Exits the application with exit code 1.
     *
     * @returns The package.json content as string
     */
    public loadPackageJson(): string {
        try {
            return fs.readFileSync(this.packageJsonPath, 'utf-8');
        } catch (e) {
            this.logError(
                'Could not load "package.json". Ensure you\'re running this command fron the root of your project.',
                e,
            );
            throw new Error('exit');
        }
    }

    /**
     * Loads the backup package.json if possible. If not: Exits the application with exit code 1.
     *
     * @returns The original package.json content as string
     */
    public loadBackupJson(): string {
        try {
            return fs.readFileSync(this.backupJsonPath, 'utf-8');
        } catch (e) {
            this.logError('Could not load backup file ".package.json"...', e);
            throw new Error('exit');
        }
    }

    /**
     * Loads the selected environment json file if possible. If not: Exits the application with exit code 1.
     *
     * @returns The environment content as string
     */
    public loadEnvironmentJson(): string {
        try {
            return fs.readFileSync(this.environmentJsonPath, 'utf-8');
        } catch (e) {
            this.logError(`Could not load environment file "${this.environmentJsonPath}"...`, e);
            throw new Error('exit');
        }
    }

    /**
     * Do the backup of the original package.json.
     */
    public backupPackageJson() {
        try {
            fs.copyFileSync(this.packageJsonPath, this.backupJsonPath);
        } catch (e) {
            this.logError('Could not make backup of "package.json"...', e);
            throw new Error('exit');
        }
    }

    /**
     * Saves the new (merged) package.json.
     *
     * @param mergedPackage The content for the new package.json
     */
    public savePackageJson(mergedPackage: any) {
        try {
            fs.writeFileSync(this.packageJsonPath, JSON.stringify(mergedPackage, null, 2), 'utf-8');
        } catch (e) {
            this.logError('Could not save new "package.json"...', e);
            throw new Error('exit');
        }
    }

    /**
     * Logs errors. The output is dependent of the verbose level. The higher the more will be written to the console.
     *
     * @param msg The message to display
     * @param e The origin error object
     *
     * @private
     */
    private logError(msg: string, e: any) {
        this.logger.error(msg);
        if (this.isVerboseL1()) this.logger.debug('Source error message:', e.message);
        if (this.isVerboseL2()) this.logger.debug('Source error:', e);
    }

    /**
     * Used for debugging purposes. (Prints the parsed cli parameters to console.)
     */
    public verboseParameters() {
        for (const key of Object.keys(this.parsedArgs)) {
            this.logger.info(`Key: ${key} ==> Value: ${this.parsedArgs[key]}`);
        }
    }
}
