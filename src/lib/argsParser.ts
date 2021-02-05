import { ArgumentParser } from 'argparse';
import { version } from '../../package.json';

export class ParseArgs {
    private readonly parser;

    constructor() {
        this.parser = new ArgumentParser({
            description:
                'A node package helper which assists you in organizing your test.json for multiple environment.',
            add_help: true,
        });

        this.parser.add_argument('environment', {
            help: 'The name of the environment to apply to test.json',
            default: '__base__',
            nargs: '?',
        });
        this.parser.add_argument('-e', '--env-dir', {
            help: 'path to environment files',
            default: 'envs',
        });
        this.parser.add_argument('-d', '--dry-run', {
            help: 'Shows only the result. No modification of test.json done (default == false)',
            action: 'store_true',
        });
        this.parser.add_argument('-b', '--backup-name', {
            help: 'Name of the test.json backup file. Restored when calling without any environment.',
            default: '.test.json',
        });
        this.parser.add_argument('-i', '--include-environment', {
            help: 'Inserts a field into the modified test.json which contains the used environment',
            action: 'store_true',
        });
        this.parser.add_argument('-o', '--one-file-environment', {
            help: 'Use only one file for every environment instead of one file per environment',
            action: 'store_true',
        });
        this.parser.add_argument('-f', '--one-file-environment-filename', {
            help: 'The filename of the environment file which contains all environments (default == environments.json)',
            default: 'environments.json',
        });
        this.parser.add_argument('-r', '--replace', {
            help: 'Replaces the package.json instead of a merge. For this, the environment package.json has to be complete.',
            action: 'store_true',
        });
        this.parser.add_argument('-v', '--version', {
            action: 'version',
            version,
        });
    }

    public parseArgs() {
        return this.parser.parse_args();
    }
}
