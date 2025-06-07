import { Logger } from './Logger';
import { LoggerOptions, LogLevel } from '../types';

/**
 * Singleton logger instance for functional API
 */
let defaultLogger = new Logger();

/**
 * Create a new logger instance
 * @param options - Logger configuration options
 * @returns A new Logger instance
 */
export function createLogger(options: Partial<LoggerOptions> = {}): Logger {
  return new Logger(options);
}

/**
 * Configure the default logger
 * @param options - Logger configuration options
 */
export function configure(options: Partial<LoggerOptions>): void {
  defaultLogger.configure(options);
}

/**
 * Set the minimum log level for the default logger
 * @param level - The minimum log level
 */
export function setLevel(level: LogLevel): void {
  defaultLogger.setLevel(level);
}

/**
 * Enable or disable the default logger
 * @param enabled - Whether logging is enabled
 */
export function setEnabled(enabled: boolean): void {
  defaultLogger.setEnabled(enabled);
}

/**
 * Log a debug message using the default logger
 * @param message - The message to log
 * @param args - Additional arguments to log
 */
export function debug(message: unknown, ...args: unknown[]): void {
  defaultLogger.debug(message, ...args);
}

/**
 * Log an info message using the default logger
 * @param message - The message to log
 * @param args - Additional arguments to log
 */
export function info(message: unknown, ...args: unknown[]): void {
  defaultLogger.info(message, ...args);
}

/**
 * Log a warning message using the default logger
 * @param message - The message to log
 * @param args - Additional arguments to log
 */
export function warn(message: unknown, ...args: unknown[]): void {
  defaultLogger.warn(message, ...args);
}

/**
 * Log an error message using the default logger
 * @param message - The message to log
 * @param args - Additional arguments to log
 */
export function error(message: unknown, ...args: unknown[]): void {
  defaultLogger.error(message, ...args);
}

/**
 * Reset the default logger to its initial state
 */
export function resetDefaultLogger(): void {
  defaultLogger = new Logger();
}
