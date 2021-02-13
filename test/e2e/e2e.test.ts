import {Worker} from '../../lib/worker';
import path from 'path';
import * as fs from 'fs';
import assert from 'assert';


const fixturesRoot = path.join(__dirname, 'fixtures');
const testRoot = path.join(__dirname, 'app');
const pkgName = 'package.json';
const bkpName = '.package.json';

const fixtures = {
    'dev': fs.readFileSync(path.join(fixturesRoot, 'package-dev.json'), 'utf8'),
    'test': fs.readFileSync(path.join(fixturesRoot, 'package-test.json'), 'utf8'),
    'base': fs.readFileSync(path.join(fixturesRoot, 'package-base.json'), 'utf8')
};

const checkFileExist = (fileName: string) => {
    const file = fs.readFileSync(path.join(testRoot, 'envs', fileName), 'utf8');
    expect(file).toBeDefined();
};

const checkFixtureMatch = (fileName: string, matchFile: string) => {
    const file = fs.readFileSync(path.join(testRoot, fileName), 'utf8');
    assert.deepStrictEqual(JSON.parse(matchFile), JSON.parse(file));
};

describe('Testing NPB CLI', function () {
    beforeEach(() => {
        process.argv = process.argv.slice(0, 2)
        jest.spyOn(process, 'cwd').mockReturnValue(testRoot);
    })

    afterEach(() => {
        if (fs.existsSync(path.join(testRoot, 'envs', '.package.json'))) {
            fs.copyFileSync(path.join(testRoot, 'envs', '.package.json'), path.join(testRoot, 'package.json'));
            fs.unlinkSync(path.join(testRoot, 'envs', '.package.json'));
        }
    });

    it('should create dev staged package.json and create a backup of original', () => {
        process.argv.push('dev');

        const worker: Worker = new Worker();
        worker.start();

        checkFileExist(bkpName);
        checkFixtureMatch(pkgName, fixtures.dev);
    });

    it('should create test staged package.json and create a backup of original', () => {
        process.argv.push('test');

        const worker: Worker = new Worker();
        worker.start();

        checkFileExist(bkpName);
        checkFixtureMatch(pkgName, fixtures.test);
    });

    it('should delete backup package.json if no environment is set', () => {
        process.argv.push('dev');

        let worker: Worker = new Worker();
        worker.start();

        checkFileExist(bkpName);
        checkFixtureMatch(pkgName, fixtures.dev);

        process.argv = process.argv.slice(0, 2)

        worker = new Worker();
        worker.start();

        if (fs.existsSync(path.join(testRoot, 'envs', bkpName))) {
            fail('backup should be deleted!')
        }
    });
});

