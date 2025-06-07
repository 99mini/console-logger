/**
 * Console Logger - A flexible console logging library
 *
 * Supports both object-oriented and functional programming paradigms
 */

// Export types
export * from './types';

// Export core Logger class
export { Logger } from './core/Logger';

// Export functional API
export {
  createLogger,
  configure,
  setLevel,
  setEnabled,
  debug,
  info,
  warn,
  error,
  resetDefaultLogger,
} from './core/functional';
