import { ArgumentParser } from 'argparse';
import fs from 'fs';
import path from 'path';

/**
 * Reads the version from the nearest package.json at runtime.
 * This works both in the source tree and after compilation to dist/.
 */
function getVersion(): string {
    try {
        const pkgPath = path.resolve(__dirname, '..', 'package.json');
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        return pkg.version ?? 'unknown';
    } catch {
        return 'unknown';
    }
}

/**
 * Interface for the parsed CLI arguments.
 */
export interface ParsedArgs {
    environment: string;
    env_dir: string;
    dry_run: boolean;
    backup_name: string;
    include_environment: boolean;
    replace: boolean;
    verbose: number;
}

/**
 * This class defines all arguments which can be passed to the Node Package Builder.
 * It also parses the cli input.
 */
export class ParseArgs {
    /**
     * Is the main ArgumentParser object.
     *
     * @private
     */
    private readonly parser: ArgumentParser;

    /**
     * The constructor (instantiates the ArgumentParser)
     */
    constructor() {
        this.parser = new ArgumentParser({
            description:
                'A node package helper which assists you in organizing your package.json for multiple environment.',
            add_help: true,
        });
    }

    /**
     * Here the whole arguments are build together.
     *
     * @returns The ParsArgs object
     */
    public build() {
        this.parser.add_argument('environment', {
            help: 'The name of the environment to apply to package.json',
            default: '__reset__',
            nargs: '?',
        });
        this.parser.add_argument('-e', '--env-dir', {
            help: 'path to environment files (default == envs)',
            default: 'envs',
        });
        this.parser.add_argument('-d', '--dry-run', {
            help: 'Shows only the result. No modification of package.json done (default == false)',
            action: 'store_true',
        });
        this.parser.add_argument('-b', '--backup-name', {
            help:
                'Name of the package.json backup file. Restored when calling without any environment. (default == .package.json)',
            default: '.package.json',
        });
        this.parser.add_argument('-i', '--include-environment', {
            help: 'Inserts a field into the modified package.json which contains the used environment',
            action: 'store_true',
        });
        this.parser.add_argument('-r', '--replace', {
            help:
                'Replaces the package.json instead of a merge. For this, the environment package.json has to be complete.',
            action: 'store_true',
        });
        this.parser.add_argument('-v', '--verbose', {
            help: 'Select level of verbosity (max: 2)',
            action: 'count',
            default: 0,
        });
        this.parser.add_argument('--version', {
            action: 'version',
            version: getVersion(),
        });
    }

    /**
     * Parses the cli inputs
     *
     * @returns An object with the parsed parameters
     */
    public parseArgs(): ParsedArgs {
        return this.parser.parse_args();
    }
}
