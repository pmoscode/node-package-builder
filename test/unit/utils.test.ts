jest.mock('fs');
jest.mock('tslog');

import {Utils} from '../../lib/utils';
import fs from 'fs';

describe('Testing Util class', () => {
    const testArgs = {
        environment: 'test',
        env_dir: 'envs',
        dry_run: false,
        backup_name: '.package.json',
        include_environment: false,
        replace: false,
        verbose: 0,
    };

    test('basic bool Tests', () => {
        const utils: Utils = new Utils(testArgs);

        expect(utils.isDryRun()).toBeFalsy();
        expect(utils.isVerboseL1()).toBeFalsy();
        expect(utils.isIncludeEnvironment()).toBeFalsy();
        expect(utils.isReplace()).toBeFalsy();
        expect(utils.isVerboseL2()).toBeFalsy();
        expect(utils.isResetEnvironment()).toBeFalsy();
        expect(utils.getEnvironment()).toBe('test');
    });

    test('loadEnvironmentJson', () => {
        const utils: Utils = new Utils(testArgs);
        const testData = '{}';

        fs.readFileSync = jest.fn().mockReturnValue(testData);

        const result = utils.loadEnvironmentJson();
        expect(fs.readFileSync).toHaveBeenCalled();
        expect(result).toBe(testData);
    });

    test('loadEnvironmentJson fail', () => {
        const utils: Utils = new Utils(testArgs);

        fs.readFileSync = jest.fn().mockImplementation(() => {
            throw new Error();
        });
        const spyon = jest.spyOn(utils as any, 'logError');

        try {
            utils.loadEnvironmentJson();
        } catch (e) {
        }

        expect(fs.readFileSync).toHaveBeenCalled();
        expect(spyon).toHaveBeenCalled();
    });

    test('loadBackupJson', () => {
        const utils: Utils = new Utils(testArgs);
        const testData = '{}';

        fs.readFileSync = jest.fn().mockReturnValue(testData);

        const result = utils.loadBackupJson();
        expect(fs.readFileSync).toHaveBeenCalled();
        expect(result).toBe(testData);
    });

    test('loadBackupJson fail', () => {
        const utils: Utils = new Utils(testArgs);

        fs.readFileSync = jest.fn().mockImplementation(() => {
            throw new Error();
        });
        const spyon = jest.spyOn(utils as any, 'logError');

        try {
            utils.loadBackupJson();
        } catch (e) {
        }

        expect(fs.readFileSync).toHaveBeenCalled();
        expect(spyon).toHaveBeenCalled();
    });

    test('loadPackageJson', () => {
        const utils: Utils = new Utils(testArgs);
        const testData = '{}';

        fs.readFileSync = jest.fn().mockReturnValue(testData);

        const result = utils.loadPackageJson();
        expect(fs.readFileSync).toHaveBeenCalled();
        expect(result).toBe(testData);
    });

    test('loadPackageJson fail', () => {
        const utils: Utils = new Utils(testArgs);

        fs.readFileSync = jest.fn().mockImplementation(() => {
            throw new Error();
        });
        const spyon = jest.spyOn(utils as any, 'logError');

        try {
            utils.loadPackageJson();
        } catch (e) {
        }

        expect(fs.readFileSync).toHaveBeenCalled();
        expect(spyon).toHaveBeenCalled();
    });

    test('backupPackageJson', () => {
        const utils: Utils = new Utils(testArgs);

        fs.copyFileSync = jest.fn();

        utils.backupPackageJson();
        expect(fs.readFileSync).toHaveBeenCalled();
    });

    test('backupPackageJson fail', () => {
        const utils: Utils = new Utils(testArgs);

        fs.copyFileSync = jest.fn().mockImplementation(() => {
            throw new Error();
        });
        const spyon = jest.spyOn(utils as any, 'logError');

        try {
            utils.backupPackageJson();
        } catch (e) {
        }

        expect(fs.readFileSync).toHaveBeenCalled();
        expect(spyon).toHaveBeenCalled();
    });

    test('restoreBackup', () => {
        const utils: Utils = new Utils(testArgs);

        fs.copyFileSync = jest.fn();
        fs.unlinkSync = jest.fn();

        utils.restoreBackup();
        expect(fs.copyFileSync).toHaveBeenCalled();
        expect(fs.unlinkSync).toHaveBeenCalled();
    });

    test('restoreBackup fail', () => {
        const utils: Utils = new Utils(testArgs);

        fs.copyFileSync = jest.fn();
        const spyon = jest.spyOn(utils as any, 'logError');
        fs.unlinkSync = jest.fn().mockImplementation(() => {
            throw new Error();
        });

        try {
            utils.restoreBackup();
        } catch (e) {
        }

        expect(fs.copyFileSync).toHaveBeenCalled();
        expect(fs.unlinkSync).toHaveBeenCalled();
        expect(spyon).toHaveBeenCalled();
    });

    test('fail save new package.json', () => {
        const utils: Utils = new Utils(testArgs);

        fs.writeFileSync = jest.fn(() => {
            throw new Error('Fake mock error');
        });
        const spyon = jest.spyOn(utils as any, 'logError');

        try {
            utils.savePackageJson({});
        } catch (e) {
        }

        expect(fs.writeFileSync).toHaveBeenCalled();
        expect(spyon).toHaveBeenCalled();
    });

    test('verbose parameters', () => {
        const utils: Utils = new Utils(testArgs);

        const spyon = jest.spyOn((utils as any).logger, 'info');
        utils.verboseParameters();

        expect(spyon).toHaveBeenCalledTimes(7);
    });

    test('log error with -vv', () => {
        const testArgsVerbose = {...testArgs}; // JSON.parse(JSON.stringify(testArgs))
        testArgsVerbose.verbose = 2;

        const utils: Utils = new Utils(testArgsVerbose);

        const spyonError = jest.spyOn((utils as any).logger, 'error');
        const spyonDebug = jest.spyOn((utils as any).logger, 'debug');
        (utils as any).logError('Test Error', new Error('TestError'));

        expect(spyonError).toHaveBeenCalledTimes(1);
        expect(spyonDebug).toHaveBeenCalledTimes(2);
    });
});
