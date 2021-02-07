import fs from 'fs';
import path from 'path';
import {getLogger} from './logger';

export class Utils {
    private readonly packageJsonPath: string;
    private readonly environmentJsonPath: string;
    private readonly backupJsonPath: string;
    private readonly logger = getLogger('utils');

    constructor(private parsedArgs: any) {
        const rootFolder = process.cwd();
        this.packageJsonPath = path.join(rootFolder, 'package.json');
        this.environmentJsonPath = path.join(rootFolder, this.parsedArgs.env_dir, `${this.parsedArgs.environment}.json`);
        this.backupJsonPath = path.join(rootFolder, this.parsedArgs.env_dir, this.parsedArgs.backup_name);
    }

    public getEnvironment(): string {
        return this.parsedArgs.environment;
    }

    public isResetEnvironment(): boolean {
        return this.parsedArgs.environment.toLowerCase() == '__reset__';
    }

    public isReplace(): boolean {
        return this.parsedArgs.replace;
    }

    public isIncludeEnvironment(): boolean {
        return this.parsedArgs.include_environment;
    }

    public isDryRun(): boolean {
        return this.parsedArgs.replace.dry_run;
    }

    public isVerboseL1(): boolean {
        return this.parsedArgs.verbose >= 1;
    }

    public isVerboseL2(): boolean {
        return this.parsedArgs.verbose >= 2;
    }

    public backupExist(): boolean {
        return fs.existsSync(this.backupJsonPath);
    }

    public restoreBackup() {
        try {
            fs.copyFileSync(this.backupJsonPath, this.packageJsonPath);
            fs.unlinkSync(this.backupJsonPath);
        } catch (e) {
            this.logError(`Could not find backup file '${this.backupJsonPath}'!`, e);
        }
    }

    public loadPackageJson(): string {
        try {
            return fs.readFileSync(this.packageJsonPath, 'utf-8');
        } catch (e) {
            this.logError('Could not load "package.json". Ensure you\'re running this command fron the root of your project.', e);
            process.exit(1);
        }
    }

    public loadBackupJson(): string {
        try {
            return fs.readFileSync(this.backupJsonPath, 'utf-8');
        } catch (e) {
            this.logError('Could not load backup file ".package.json"...', e);

            process.exit(1);
        }
    }

    public loadEnvironmentJson(): string {
        try {
            return fs.readFileSync(this.environmentJsonPath, 'utf-8');
        } catch (e) {
            this.logError(`Could not load environment file "${this.environmentJsonPath}"...`, e);
            process.exit(1);
        }
    }

    public backupPackageJson() {
        try {
            fs.copyFileSync(this.packageJsonPath, this.backupJsonPath);
        } catch (e) {
            this.logError('Could not make backup of "package.json"...', e);
            process.exit(1);
        }
    }

    public savePackageJson(mergedPackage: any) {
        try {
            fs.writeFileSync(this.packageJsonPath, JSON.stringify(mergedPackage, null, 2), 'utf-8');
        } catch (e) {
            this.logError('Could not save new "package.json"...', e);
            process.exit(1);
        }
    }

    private logError(msg: string, e: any) {
        this.logger.error(msg);
        if (this.isVerboseL1()) this.logger.debug('Source error message:', e.message);
        if (this.isVerboseL2()) this.logger.debug('Source error:', e);
    }

    public verboseParameters() {
        Object.keys(this.parsedArgs).forEach(key => {
            this.logger.info(`Key: ${key} ==> Value: ${this.parsedArgs[key]}`);
        });
    }
}
