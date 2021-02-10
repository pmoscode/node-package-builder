import {ParseArgs} from './argsParser';
import {getLogger} from './logger';

import merge from 'lodash.merge';
import {Utils} from './utils';

/**
 * The main class of the Node Package Builder. Handels the whole workflow.
 */
export class Worker {
    /**
     * The Utils class
     *
     * @private
     */
    private readonly utils: Utils;

    /**
     * The logger
     *
     * @private
     */
    private readonly logger = getLogger('worker');

    /**
     * The constructor parses the cli arguments and instantiate the Util class.
     */
    constructor() {
        const parsedArgs: ParseArgs = new ParseArgs()

        this.utils = new Utils(parsedArgs.build().parseArgs());
    }

    /**
     * Main method. Starts the workflow.
     */
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

    /**
     * Loads the package.json file.
     *
     * @returns The package.json as object
     *
     * @private
     */
    private getPackageJson(): any {
        let packageString;
        if (this.utils.isBackupExisting()) {
            packageString = this.utils.loadBackupJson();
        } else {
            packageString = this.utils.loadPackageJson();
            if (!this.utils.isDryRun()) {
                this.utils.backupPackageJson();
            }
        }

        return JSON.parse(packageString);
    }

    /**
     * Loads the environment file.
     *
     * @returns Environment as object
     *
     * @private
     */
    private getEnvironmentJson(): any {
        return JSON.parse(this.utils.loadEnvironmentJson());
    }

    /**
     * Does the merge of the two package.json parts. If "replace" is passed via parameter, only the environment file content is used. (So no merge is done)
     *
     * @param packageJson The package.json object
     * @param environmentJson The environment object
     *
     * @returns The merged/replaced package.json object
     *
     * @private
     */
    private mergeJson(packageJson: any, environmentJson: any): any {
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

    /**
     * Saved the new package.json to disk or displays it to console if "dry-run" is passed via cli.
     *
     * @param mergedPackage New package.json content object
     *
     * @private
     */
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
