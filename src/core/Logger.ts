import { ILogger, LoggerOptions, LogLevel } from '../types';

/**
 * Timer storage for time, timeEnd, timeLog methods
 */
interface TimerInfo {
  start: number;
  label: string;
}

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
  private timers: Map<string, TimerInfo>;
  private counters: Map<string, number>;
  private groupDepth: number;

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
    this.timers = new Map<string, TimerInfo>();
    this.counters = new Map<string, number>();
    this.groupDepth = 0;
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
   * Log a message with no specific level
   * @param message - The message to log
   * @param args - Additional arguments to log
   */
  public log(message: unknown, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.log(...this.formatMessage(LogLevel.INFO, message, ...args));
    }
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

  /**
   * Clear the console
   */
  public clear(): void {
    if (this.options.enabled) {
      console.clear();
    }
  }

  /**
   * Print a stack trace to the console
   * @param message - Optional message to print
   * @param args - Additional arguments to log
   */
  public trace(message?: unknown, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.trace(...this.formatMessage(LogLevel.DEBUG, message || 'Trace:', ...args));
    }
  }

  /**
   * Start a new timer under the given label
   * @param label - The timer label
   */
  public time(label: string): void {
    if (this.options.enabled) {
      if (this.timers.has(label)) {
        this.warn(`Timer '${label}' already exists`);
        return;
      }

      this.timers.set(label, {
        start: performance.now(),
        label,
      });
      console.time(label);
    }
  }

  /**
   * Stop a timer and log the elapsed time
   * @param label - The timer label
   */
  public timeEnd(label: string): void {
    if (this.options.enabled) {
      if (!this.timers.has(label)) {
        this.warn(`Timer '${label}' does not exist`);
        return;
      }

      const timer = this.timers.get(label);
      if (!timer) return;

      const elapsed = performance.now() - timer.start;
      this.log(`${label}: ${elapsed.toFixed(3)}ms`);
      this.timers.delete(label);
      console.timeEnd(label);
    }
  }

  /**
   * Log the elapsed time of a timer without stopping it
   * @param label - The timer label
   */
  public timeLog(label: string, ...args: unknown[]): void {
    if (this.options.enabled) {
      if (!this.timers.has(label)) {
        this.warn(`Timer '${label}' does not exist`);
        return;
      }

      const timer = this.timers.get(label);
      if (!timer) return;

      const elapsed = performance.now() - timer.start;
      this.log(`${label}: ${elapsed.toFixed(3)}ms`, ...args);
      console.timeLog(label, ...args);
    }
  }

  /**
   * Create a new counter with the given label
   * @param label - The counter label
   */
  public count(label = 'default'): void {
    if (this.options.enabled) {
      const currentCount = this.counters.get(label) || 0;
      const newCount = currentCount + 1;
      this.counters.set(label, newCount);

      this.log(`${label}: ${newCount}`);
      console.count(label);
    }
  }

  /**
   * Reset a counter
   * @param label - The counter label
   */
  public countReset(label = 'default'): void {
    if (this.options.enabled) {
      if (!this.counters.has(label)) {
        this.warn(`Counter '${label}' does not exist`);
        return;
      }

      this.counters.set(label, 0);
      console.countReset(label);
    }
  }

  /**
   * Start a group of console messages
   * @param label - The group label
   * @param args - Additional arguments
   */
  public group(label?: unknown, ...args: unknown[]): void {
    if (this.options.enabled) {
      this.groupDepth++;
      console.group(label, ...args);
    }
  }

  /**
   * Start a collapsed group of console messages
   * @param label - The group label
   * @param args - Additional arguments
   */
  public groupCollapsed(label?: unknown, ...args: unknown[]): void {
    if (this.options.enabled) {
      this.groupDepth++;
      console.groupCollapsed(label, ...args);
    }
  }

  /**
   * End the current group
   */
  public groupEnd(): void {
    if (this.options.enabled && this.groupDepth > 0) {
      this.groupDepth--;
      console.groupEnd();
    }
  }

  /**
   * Print a table of the given data
   * @param tabularData - The data to display in a table
   * @param properties - Optional array of properties to include
   */
  public table(tabularData: unknown, properties?: readonly string[]): void {
    if (this.options.enabled) {
      console.table(tabularData, properties as string[] | undefined);
    }
  }

  /**
   * Assert that a condition is true
   * @param condition - The condition to assert
   * @param message - The message to log if the assertion fails
   * @param args - Additional arguments
   */
  public assert(condition?: boolean, message?: string, ...args: unknown[]): void {
    if (this.options.enabled) {
      console.assert(condition, message, ...args);
    }
  }

  /**
   * Display an XML/HTML element in the console
   * @param value - The element to display
   */
  public dirxml(value: unknown): void {
    if (this.options.enabled) {
      console.dirxml(value);
    }
  }

  /**
   * Display an object in the console
   * @param obj - The object to display
   * @param options - Display options
   */
  public dir(obj: unknown, options?: object): void {
    if (this.options.enabled) {
      console.dir(obj, options);
    }
  }
}
