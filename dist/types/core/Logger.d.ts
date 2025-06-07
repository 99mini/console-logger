import { ILogger, LoggerOptions, LogLevel } from '../types';
/**
 * Core Logger implementation
 */
export declare class Logger implements ILogger {
    private options;
    /**
     * Create a new Logger instance
     * @param options - Logger configuration options
     */
    constructor(options?: Partial<LoggerOptions>);
    /**
     * Format a log message according to the current options
     * @param level - Log level
     * @param message - The message to log
     * @param args - Additional arguments to log
     * @returns Formatted message parts
     */
    private formatMessage;
    /**
     * Check if a log level should be displayed based on the minimum level
     * @param level - Log level to check
     * @returns Whether the log level should be displayed
     */
    private shouldLog;
    /**
     * Log a debug message
     * @param message - The message to log
     * @param args - Additional arguments to log
     */
    debug(message: unknown, ...args: unknown[]): void;
    /**
     * Log an info message
     * @param message - The message to log
     * @param args - Additional arguments to log
     */
    info(message: unknown, ...args: unknown[]): void;
    /**
     * Log a warning message
     * @param message - The message to log
     * @param args - Additional arguments to log
     */
    warn(message: unknown, ...args: unknown[]): void;
    /**
     * Log an error message
     * @param message - The message to log
     * @param args - Additional arguments to log
     */
    error(message: unknown, ...args: unknown[]): void;
    /**
     * Set the minimum log level
     * @param level - The minimum log level
     */
    setLevel(level: LogLevel): void;
    /**
     * Enable or disable logging
     * @param enabled - Whether logging is enabled
     */
    setEnabled(enabled: boolean): void;
    /**
     * Update logger options
     * @param options - New logger options
     */
    configure(options: Partial<LoggerOptions>): void;
}
