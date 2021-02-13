import {Worker} from '../../lib/worker';
import path from 'path';
import * as fs from 'fs';
// import assert from 'assert';


// const fixturesRoot = path.join(__dirname, 'fixtures');
const testRoot = path.join(__dirname, 'app');
// const pkgName = 'package.json';
const bkpName = '.package.json';
//
// const fixtures = {
//     'dev': fs.readFileSync(path.join(fixturesRoot, 'package-dev.json'), 'utf8'),
//     'test': fs.readFileSync(path.join(fixturesRoot, 'package-test.json'), 'utf8'),
//     'base': fs.readFileSync(path.join(fixturesRoot, 'package-base.json'), 'utf8')
// };
//
const checkFileExist = (fileName: string) => {
    const file = fs.readFileSync(path.join(testRoot, 'envs', fileName), 'utf8');
    expect(file).toBeDefined();
};
//
// const checkFixtureMatch = (message: string, fileName: string, matchFile: string) => {
//     it(message, function () {
//         const file = fs.readFileSync(path.join(testRoot, fileName), 'utf8');
//         assert.deepStrictEqual(JSON.parse(matchFile), JSON.parse(file));
//     });
// };


describe('Testing NPB CLI', function () {
    afterEach(() => {
        if (fs.existsSync(path.join(testRoot, 'envs', '.package.json'))) {
            jest.spyOn(process, 'cwd').mockReturnValue(testRoot);
            new Worker().start();
            // fs.unlinkSync(path.join(testRoot, 'env', '.package.json'));
        }
    });

    it('should create dev staged package.json and create a backup of original', () => {
        process.argv.push('test');
        jest.spyOn(process, 'cwd').mockReturnValue(testRoot);

        const worker: Worker = new Worker();
        worker.start();

        checkFileExist(bkpName)
    });

    // checkFileExist('backup package should exist', bkpName);
    // checkFixtureMatch('package.json should be modified', pkgName, fixtures.staging);
});


// describe('#start() second: use backup', function () {
//     beforeEach(() => {
//         // Mock "parseArgs()" from ParsedArgs to return test data
//     });
//     afterEach(() => {
//         fs.unlinkSync(path.join(testRoot, '.package.json'));
//     });
//     //beginExec('base');
//     checkFixtureMatch('package.json should be reset', pkgName, fixtures.base);
// });

