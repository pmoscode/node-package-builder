// jest.config.ts
import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
    verbose: true,
    collectCoverage: true,
    reporters: ['default', 'jest-junit'],
    testPathIgnorePatterns: ['<rootDir>/dist'],
    testMatch: ['**/test/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
    // tslog v5 ships as ESM-only (no CJS build). Since ts-jest compiles our
    // own code to CommonJS, node_modules/tslog needs to be transpiled to
    // CommonJS too, otherwise `require('tslog')` blows up on `import`.
    transformIgnorePatterns: ['/node_modules/(?!tslog/)'],
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
        '/node_modules/tslog/.+\\.js$': [
            'babel-jest',
            {
                configFile: false,
                presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
                plugins: ['babel-plugin-transform-import-meta'],
            },
        ],
    },
};
export default config;
