import { Logger } from './Logger';
import { LoggerOptions, LogLevel } from '../types';
/**
 * Create a new logger instance
 * @param options - Logger configuration options
 * @returns A new Logger instance
 */
export declare function createLogger(options?: Partial<LoggerOptions>): Logger;
/**
 * Configure the default logger
 * @param options - Logger configuration options
 */
export declare function configure(options: Partial<LoggerOptions>): void;
/**
 * Set the minimum log level for the default logger
 * @param level - The minimum log level
 */
export declare function setLevel(level: LogLevel): void;
/**
 * Enable or disable the default logger
 * @param enabled - Whether logging is enabled
 */
export declare function setEnabled(enabled: boolean): void;
/**
 * Log a debug message using the default logger
 * @param message - The message to log
 * @param args - Additional arguments to log
 */
export declare function debug(message: unknown, ...args: unknown[]): void;
/**
 * Log an info message using the default logger
 * @param message - The message to log
 * @param args - Additional arguments to log
 */
export declare function info(message: unknown, ...args: unknown[]): void;
/**
 * Log a warning message using the default logger
 * @param message - The message to log
 * @param args - Additional arguments to log
 */
export declare function warn(message: unknown, ...args: unknown[]): void;
/**
 * Log an error message using the default logger
 * @param message - The message to log
 * @param args - Additional arguments to log
 */
export declare function error(message: unknown, ...args: unknown[]): void;
/**
 * Reset the default logger to its initial state
 */
export declare function resetDefaultLogger(): void;
