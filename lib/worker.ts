import {ParseArgs} from './argsParser';
import {getLogger} from './logger';

import * as fs from 'fs';
import * as path from 'path';
import merge from 'lodash.merge';
import {isBaseEnvironment, verboseParameters} from './helper';

export class Worker {
    private readonly parsedArgs;
    private readonly logger = getLogger('npb-bin');
    private readonly rootFolder;
    private readonly packageJsonPath;
    private readonly environmentJsonPath;
    private readonly backupJsonPath;

    constructor() {
        this.parsedArgs = new ParseArgs().parseArgs();
        this.rootFolder = process.cwd();
        this.packageJsonPath = path.join(this.rootFolder, 'package.json');
        this.environmentJsonPath = path.join(this.rootFolder, this.parsedArgs.env_dir, `${this.parsedArgs.environment}.json`);
        this.backupJsonPath = path.join(this.rootFolder, this.parsedArgs.env_dir, this.parsedArgs.backup_name);
    }

    public start() {
        verboseParameters(this.logger, this.parsedArgs);

        if (isBaseEnvironment(this.parsedArgs)) {
            try {
                fs.copyFileSync(this.backupJsonPath, this.packageJsonPath);
                fs.unlinkSync(this.backupJsonPath);
            } catch (e) {
                this.logger.error(`Could not find backup file '${this.backupJsonPath}'!`);
                process.exit(1);
            }
        } else {
            const packageJson = this.getPackageJson();
            const environmentJson = this.getEnvironmentJson();
            const mergedPackage = this.mergeJson(packageJson, environmentJson);
            this.writeNewPackage(mergedPackage);
        }
    }

    private getPackageJson() {
        try {
            const packageString = fs.readFileSync(this.packageJsonPath, 'utf-8');

            if (!fs.existsSync(this.backupJsonPath) && isBaseEnvironment(this.parsedArgs)) {
                fs.copyFileSync(this.packageJsonPath, this.backupJsonPath);
            }

            return JSON.parse(packageString);
        } catch (e) {
            this.logger.error('Could not find "package.json". Ensure you\'re running this command fron the root of your project.');
            process.exit(1);
        }
    }

    private getEnvironmentJson() {
        try {
            const environmentString = fs.readFileSync(this.environmentJsonPath, 'utf-8');

            return JSON.parse(environmentString);
        } catch (e) {
            this.logger.error(`Could not find '${this.environmentJsonPath}'!`);
            process.exit(1);
        }
    }

    private mergeJson(packageJson: any, environmentJson: any) {
        let merged;

        if (this.parsedArgs.replace) {
            merged = environmentJson;
        } else {
            merged = merge({}, packageJson, environmentJson);
        }

        if (!isBaseEnvironment(this.parsedArgs) && this.parsedArgs.include_environment) {
            merged.npbEnv = [
                this.parsedArgs.environment
            ];
        }

        return merged;
    }

    private writeNewPackage(mergedPackage: any) {
        if (this.parsedArgs.dry_run) {
            this.logger.info('##################################');
            this.logger.info('######### DRY-RUN output #########');
            this.logger.info(JSON.stringify(mergedPackage, null, 4));
            this.logger.info('##################################');
        } else {
            fs.writeFileSync(this.packageJsonPath, JSON.stringify(mergedPackage, null, 2), 'utf-8');
        }
    }
}
