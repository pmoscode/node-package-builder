#!/usr/bin/env node
import { Worker } from '../lib/worker';

try {
    new Worker().start();
} catch (e) {}
