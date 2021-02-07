// jest.config.ts
import type {Config} from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
    verbose: true,
    collectCoverage: true,
    testPathIgnorePatterns: [
        "<rootDir>/dist"
    ],
    testMatch: [
        "**/test/**/*.[jt]s?(x)",
        "**/?(*.)+(spec|test).[tj]s?(x)"
    ],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
};
export default config;
