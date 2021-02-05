import {ParseArgs} from './argsParser';
import {getLogger} from './logger';

import * as fs from 'fs';
import * as path from 'path';
import * as lodash from 'lodash';

export class Worker {
    private readonly parsedArgs;
    private readonly logger = getLogger('npb-bin');
    private readonly rootFolder;

    constructor() {
        this.parsedArgs = new ParseArgs().parseArgs();
        this.rootFolder = process.cwd();
    }

    public start() {
        this.debug();

        if (this.parsedArgs.environment.toLowerCase() == '__base__') {
            try {
                fs.copyFileSync(path.join(this.rootFolder, this.parsedArgs.env_dir, this.parsedArgs.backup_name), path.join(this.rootFolder, 'package.json'));
                fs.unlinkSync(path.join(this.rootFolder, this.parsedArgs.env_dir, this.parsedArgs.backup_name));
            } catch (e) {
                this.logger.error(`Could not find backup file '${this.parsedArgs.backup_name}' inside '${this.parsedArgs.env_dir}'!`);
                process.exit(1);
            }
        } else {
            const packageJson = this.getPackageJson();
            const environmentJson = this.getEnvironment();
            const mergedPackage = this.mergeJson(packageJson, environmentJson);
            this.writeNewPackage(mergedPackage);
        }
    }

    private getPackageJson() {
        try {
            const packageString = fs.readFileSync(path.join(this.rootFolder, 'package.json'), 'utf-8');

            if (!fs.existsSync(path.join(this.rootFolder, this.parsedArgs.env_dir, this.parsedArgs.backup_name)) && this.parsedArgs.environment.toLowerCase() != '__base__') {
                fs.copyFileSync(path.join(this.rootFolder, 'package.json'), path.join(this.rootFolder, this.parsedArgs.env_dir, this.parsedArgs.backup_name));
            }

            return JSON.parse(packageString);
        } catch (e) {
            this.logger.error('Could not find "package.json". Ensure you\'re running this command fron the root of your project.');
            process.exit(1);
        }
    }

    private getEnvironment() {
        try {
            const environmentString = fs.readFileSync(path.join(this.rootFolder, this.parsedArgs.env_dir, `${this.parsedArgs.environment}.json`), 'utf-8');

            return JSON.parse(environmentString);
        } catch (e) {
            this.logger.error(`Could not find '${this.parsedArgs.environment}.json' inside '${this.parsedArgs.env_dir}'!`);
            process.exit(1);
        }
    }

    private mergeJson(packageJson: any, environmentJson: any) {
        let merged;
        if (this.parsedArgs.replace) {
            merged = environmentJson;
        } else {
            merged = lodash.merge({}, packageJson, environmentJson);
        }

        if (this.parsedArgs.environment.toLowerCase() != '__base__' && this.parsedArgs.include_environment) {
            merged.npbEnv = [
                this.parsedArgs.environment
            ]
        }

        return merged;
    }

    private writeNewPackage(mergedPackage: any) {
        fs.writeFileSync(path.join(this.rootFolder, 'test.json.merged'), JSON.stringify(mergedPackage, null, 2), 'utf-8');
    }

    private debug() {
        this.logger.info(this.parsedArgs);
        this.logger.info(this.parsedArgs.environment);
        this.logger.info(this.parsedArgs.env_dir);
        this.logger.info(this.parsedArgs.dry_run);
        this.logger.info(this.parsedArgs.backup_name);
        this.logger.info(this.parsedArgs.include_environment);
        this.logger.info(this.parsedArgs.one_file_environment);
        this.logger.info(this.parsedArgs.one_file_environment_filename);
    }
}
