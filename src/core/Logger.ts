import { ILogger, LoggerOptions, LogLevel } from '../types';

/**
 * Default logger options
 */
const DEFAULT_OPTIONS: LoggerOptions = {
  minLevel: LogLevel.INFO,
  format: {
    timestamp: true,
    level: true,
    colors: true,
  },
  enabled: true,
};

/**
 * ANSI color codes for different log levels
 */
const COLORS = {
  [LogLevel.DEBUG]: '\x1b[36m', // Cyan
  [LogLevel.INFO]: '\x1b[32m', // Green
  [LogLevel.WARN]: '\x1b[33m', // Yellow
  [LogLevel.ERROR]: '\x1b[31m', // Red
  reset: '\x1b[0m',
};

/**
 * Core Logger implementation
 */
export class Logger implements ILogger {
  private options: LoggerOptions;

  /**
   * Create a new Logger instance
   * @param options - Logger configuration options
   */
  constructor(options: Partial<LoggerOptions> = {}) {
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options,
      format: {
        ...DEFAULT_OPTIONS.format,
        ...options.format,
      },
    };
  }

  /**
   * Format a log message according to the current options
   * @param level - Log level
   * @param message - The message to log
   * @param args - Additional arguments to log
   * @returns Formatted message parts
   */
  private formatMessage(level: LogLevel, message: unknown, ...args: unknown[]): unknown[] {
    const parts: unknown[] = [];
    const { format } = this.options;

    // Add timestamp if enabled
    if (format?.timestamp) {
      const timestamp = new Date().toISOString();
      parts.push(`[${timestamp}]`);
    }

    // Add log level if enabled
    if (format?.level) {
      const levelStr = `[${level.toUpperCase()}]`;

      // Apply colors if enabled
      if (format?.colors) {
        parts.push(`${COLORS[level]}${levelStr}${COLORS.reset}`);
      } else {
        parts.push(levelStr);
      }
    }

    // Add prefix if specified
    if (format?.prefix) {
      parts.push(`[${format.prefix}]`);
    }

    // Add the main message
    parts.push(message);

    // Return formatted parts and additional args
    return [...parts, ...args];
  }

  /**
   * Check if a log level should be displayed based on the minimum level
   * @param level - Log level to check
   * @returns Whether the log level should be displayed
   */
  private shouldLog(level: LogLevel): boolean {
    if (!this.options.enabled) {
      return false;
    }

    const levels = Object.values(LogLevel);
    const minLevelIndex = levels.indexOf(this.options.minLevel || LogLevel.INFO);
    const currentLevelIndex = levels.indexOf(level);

    return currentLevelIndex >= minLevelIndex;
  }

  /**
   * Log a debug message
   * @param message - The message to log
   * @param args - Additional arguments to log
   */
  public debug(message: unknown, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(...this.formatMessage(LogLevel.DEBUG, message, ...args));
    }
  }

  /**
   * Log an info message
   * @param message - The message to log
   * @param args - Additional arguments to log
   */
  public info(message: unknown, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(...this.formatMessage(LogLevel.INFO, message, ...args));
    }
  }

  /**
   * Log a warning message
   * @param message - The message to log
   * @param args - Additional arguments to log
   */
  public warn(message: unknown, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(...this.formatMessage(LogLevel.WARN, message, ...args));
    }
  }

  /**
   * Log an error message
   * @param message - The message to log
   * @param args - Additional arguments to log
   */
  public error(message: unknown, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(...this.formatMessage(LogLevel.ERROR, message, ...args));
    }
  }

  /**
   * Set the minimum log level
   * @param level - The minimum log level
   */
  public setLevel(level: LogLevel): void {
    this.options.minLevel = level;
  }

  /**
   * Enable or disable logging
   * @param enabled - Whether logging is enabled
   */
  public setEnabled(enabled: boolean): void {
    this.options.enabled = enabled;
  }

  /**
   * Update logger options
   * @param options - New logger options
   */
  public configure(options: Partial<LoggerOptions>): void {
    this.options = {
      ...this.options,
      ...options,
      format: {
        ...this.options.format,
        ...options.format,
      },
    };
  }
}
