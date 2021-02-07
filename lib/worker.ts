import {ParseArgs} from './argsParser';
import {getLogger} from './logger';

import merge from 'lodash.merge';
import {Utils} from './utils';

export class Worker {
    private readonly utils: Utils;
    private readonly logger = getLogger('worker');

    constructor() {
        this.utils = new Utils(new ParseArgs().parseArgs());
    }

    public start() {
        if (this.utils.isResetEnvironment()) {
            if (this.utils.isDryRun()) {
                this.logger.warn(`Won't reset package.json because of "dry-run" enabled...`);
            } else {
                this.utils.restoreBackup();
            }
        } else {
            const packageJson = this.getPackageJson();
            const environmentJson = this.getEnvironmentJson();
            const mergedPackage = this.mergeJson(packageJson, environmentJson);
            this.writeNewPackage(mergedPackage);
        }
    }

    private getPackageJson() {
        let packageString;
        if (this.utils.backupExist()) {
            packageString = this.utils.loadBackupJson();
        } else {
            packageString = this.utils.loadPackageJson();
            if (!this.utils.isDryRun()) {
                this.utils.backupPackageJson();
            }
        }

        return JSON.parse(packageString);
    }

    private getEnvironmentJson() {
        return JSON.parse(this.utils.loadEnvironmentJson());
    }

    private mergeJson(packageJson: any, environmentJson: any) {
        let merged;

        if (this.utils.isReplace()) {
            merged = environmentJson;
        } else {
            merged = merge({}, packageJson, environmentJson);
        }

        if (this.utils.isIncludeEnvironment()) {
            merged.npbEnv = [
                this.utils.getEnvironment()
            ];
        }

        return merged;
    }

    private writeNewPackage(mergedPackage: any) {
        if (this.utils.isDryRun()) {
            this.logger.info('##################################');
            this.logger.info('######### DRY-RUN output #########');
            this.logger.info(JSON.stringify(mergedPackage, null, 4));
            this.logger.info('##################################');
        } else {
            this.utils.savePackageJson(mergedPackage);
        }
    }
}
