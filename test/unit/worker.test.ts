import {Worker} from '../../lib/worker';

describe('Testing Worker class', () => {

    test('getPackageJson should return proper content if backup exists', () => {
        const worker: Worker = new Worker();

        const workerUtil: any = (worker as any).utils;

        const spyOnIsBackupExisting = jest.spyOn(workerUtil, 'isBackupExisting').mockReturnValue(true);
        const spyOnLoadBackupJson = jest.spyOn(workerUtil, 'loadBackupJson').mockReturnValue('{"test": true}');
        const spyOnLoadPackageJson = jest.spyOn(workerUtil, 'loadPackageJson').mockReturnValue('{"test": false}');

        const workerAny = (worker as any);
        const returnObj = workerAny.getPackageJson();

        expect(spyOnIsBackupExisting).toHaveBeenCalled();
        expect(spyOnLoadBackupJson).toHaveBeenCalled();
        expect(returnObj).toStrictEqual({test: true});
        expect(spyOnLoadPackageJson).not.toHaveBeenCalled();
    });

    test('mergeJson should return replaced content if replace flag is set in cli parameters', () => {
        const environmentJson = {
            test: 'one',
            go: 'two'
        }

        const packageJson = {
            fake: 'three',
            bye: 'four'
        }

        const worker: Worker = new Worker();

        const workerUtil: any = (worker as any).utils;

        const spyOnIsReplace = jest.spyOn(workerUtil, 'isReplace').mockReturnValue(true);

        const workerAny = (worker as any);
        const returnObj = workerAny.mergeJson(packageJson, environmentJson);

        expect(spyOnIsReplace).toHaveBeenCalled();
        expect(returnObj).toStrictEqual(environmentJson);
    });

    test('mergeJson should return content eytended by the environment name if "--include-environment" flag is set in cli parameters', () => {
        const environmentJson = {
            test: 'one'
        }

        const packageJson = {
            fake: 'three'
        }

        const result = {
            test: 'one',
            fake: 'three',
            npbEnv: [
                'testing'
            ]
        }

        const worker: Worker = new Worker();

        const workerUtil: any = (worker as any).utils;

        const spyOnIsReplace = jest.spyOn(workerUtil, 'isIncludeEnvironment').mockReturnValue(true);
        const spyOngetEnvironment = jest.spyOn(workerUtil, 'getEnvironment').mockReturnValue('testing');

        const workerAny = (worker as any);
        const returnObj = workerAny.mergeJson(packageJson, environmentJson);

        expect(spyOnIsReplace).toHaveBeenCalled();
        expect(spyOngetEnvironment).toHaveBeenCalled();
        expect(returnObj).toStrictEqual(result);
    });
});
