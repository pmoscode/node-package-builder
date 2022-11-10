#!/usr/bin/env node
/**
 * This is the main entrypoint for the utility app. It instantiates the worker and starts it.
 * @packageDocumentation
 */
import { Worker } from '../lib/worker';


try {
    new Worker().start();
} catch (e) {}
