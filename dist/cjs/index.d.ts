/**
 * Console Logger - A flexible console logging library
 *
 * Supports both object-oriented and functional programming paradigms
 */
export * from './types';
export { Logger } from './core/Logger';
export { createLogger, configure, setLevel, setEnabled, debug, info, warn, error, resetDefaultLogger, } from './core/functional';
