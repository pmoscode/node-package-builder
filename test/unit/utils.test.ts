import {mocked} from 'ts-jest/utils';

jest.mock('fs');

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
        verbose: 0
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

        fs.readFileSync = jest.fn();
        mocked(fs.readFileSync).mockReturnValue(testData);

        const result = utils.loadEnvironmentJson();
        expect(fs.readFileSync).toHaveBeenCalled();
        expect(result).toBe(testData);
    });

    test('loadBackupJson', () => {
        const utils: Utils = new Utils(testArgs);
        const testData = '{}';

        fs.readFileSync = jest.fn();
        mocked(fs.readFileSync).mockReturnValue(testData);

        const result = utils.loadBackupJson();
        expect(fs.readFileSync).toHaveBeenCalled();
        expect(result).toBe(testData);
    });

    test('loadPackageJson', () => {
        const utils: Utils = new Utils(testArgs);
        const testData = '{}';

        fs.readFileSync = jest.fn();
        mocked(fs.readFileSync).mockReturnValue(testData);

        const result = utils.loadPackageJson();
        expect(fs.readFileSync).toHaveBeenCalled();
        expect(result).toBe(testData);
    });

    test('backupPackageJson', () => {
        const utils: Utils = new Utils(testArgs);

        fs.copyFileSync = jest.fn();

        utils.backupPackageJson();
        expect(fs.readFileSync).toHaveBeenCalled();
    });

    test('restoreBackup', () => {
        const utils: Utils = new Utils(testArgs);

        fs.copyFileSync = jest.fn();
        fs.unlinkSync = jest.fn();

        utils.restoreBackup();
        expect(fs.copyFileSync).toHaveBeenCalled();
        expect(fs.unlinkSync).toHaveBeenCalled();
    });

    // test('basic save Tests', () => {
    //     const utils: Utils = new Utils(testArgs)
    //
    //     expect(utils.savePackageJson()).toBeFalsy();
    //     expect(utils.backupPackageJson()).toBeFalsy();
    //     expect(utils.restoreBackup()).toBeFalsy();
    //     expect(utils.backupExist()).toBeFalsy();
    // });
});
