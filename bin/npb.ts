#!/usr/bin/env node
/**
 * This is the main entrypoint for the utility app. It instantiates the worker and starts it.
 * @packageDocumentation
 */
import { Worker } from '../lib/worker';
import { getLogger } from '../lib/logger';

const logger = getLogger('npb');

try {
    new Worker().start();
} catch (e) {
    if (e instanceof Error) {
        logger.error(e.message);
    } else {
        logger.error('An unexpected error occurred', e);
    }
    process.exit(1);
}
