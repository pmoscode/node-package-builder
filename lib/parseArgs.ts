import {ArgumentParser} from 'argparse';
import {version} from '../package.json';

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
                'A node package helper which assists you in organizing your test.json for multiple environment.',
            add_help: true
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
            nargs: '?'
        });
        this.parser.add_argument('-e', '--env-dir', {
            help: 'path to environment files (default == envs)',
            default: 'envs'
        });
        this.parser.add_argument('-d', '--dry-run', {
            help: 'Shows only the result. No modification of package.json done (default == false)',
            action: 'store_true'
        });
        this.parser.add_argument('-b', '--backup-name', {
            help: 'Name of the package.json backup file. Restored when calling without any environment. (default == .package.json)',
            default: '.package.json'
        });
        this.parser.add_argument('-i', '--include-environment', {
            help: 'Inserts a field into the modified package.json which contains the used environment',
            action: 'store_true'
        });
        this.parser.add_argument('-r', '--replace', {
            help: 'Replaces the package.json instead of a merge. For this, the environment package.json has to be complete.',
            action: 'store_true'
        });
        this.parser.add_argument('-v', '--verbose', {
            help: 'Select level of verbosity (max: 2)',
            action: 'count',
            default: 0
        });
        this.parser.add_argument('--version', {
            action: 'version',
            version
        });
    }

    /**
     * Parses the cli inputs
     *
     * @returns An object with the parsed parameters
     */
    public parseArgs(): any {
        return this.parser.parse_args();
    }
}
