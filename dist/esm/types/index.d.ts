/**
 * Log level enumeration
 */
export declare enum LogLevel {
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error"
}
/**
 * Log message format options
 */
export interface LogFormatOptions {
    /**
     * Include timestamp in log messages
     */
    timestamp?: boolean;
    /**
     * Include log level in log messages
     */
    level?: boolean;
    /**
     * Custom prefix for log messages
     */
    prefix?: string;
    /**
     * Custom colors for different log levels
     */
    colors?: boolean;
}
/**
 * Logger configuration options
 */
export interface LoggerOptions {
    /**
     * Minimum log level to display
     */
    minLevel?: LogLevel;
    /**
     * Formatting options for log messages
     */
    format?: LogFormatOptions;
    /**
     * Whether to enable logging
     */
    enabled?: boolean;
}
/**
 * Logger interface defining the core logging methods
 */
export interface ILogger {
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
