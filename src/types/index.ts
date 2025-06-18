/**
 * Log level enumeration
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
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
   * Log a message with no level
   * @param message - The message to log
   * @param args - Additional arguments to log
   */
  log(message: unknown, ...args: unknown[]): void;
  
  /**
   * Clear the console
   */
  clear(): void;
  
  /**
   * Print a stack trace to the console
   * @param message - Optional message to print
   * @param args - Additional arguments to log
   */
  trace(message?: unknown, ...args: unknown[]): void;
  
  /**
   * Start a new timer under the given label
   * @param label - The timer label
   */
  time(label: string): void;
  
  /**
   * Stop a timer and log the elapsed time
   * @param label - The timer label
   */
  timeEnd(label: string): void;
  
  /**
   * Log the elapsed time of a timer without stopping it
   * @param label - The timer label
   */
  timeLog(label: string, ...args: unknown[]): void;
  
  /**
   * Create a new counter with the given label
   * @param label - The counter label
   */
  count(label?: string): void;
  
  /**
   * Reset a counter
   * @param label - The counter label
   */
  countReset(label?: string): void;
  
  /**
   * Start a group of console messages
   * @param label - The group label
   * @param args - Additional arguments
   */
  group(label?: unknown, ...args: unknown[]): void;
  
  /**
   * Start a collapsed group of console messages
   * @param label - The group label
   * @param args - Additional arguments
   */
  groupCollapsed(label?: unknown, ...args: unknown[]): void;
  
  /**
   * End the current group
   */
  groupEnd(): void;
  
  /**
   * Print a table of the given data
   * @param tabularData - The data to display in a table
   * @param properties - Optional array of properties to include
   */
  table(tabularData: unknown, properties?: ReadonlyArray<string>): void;
  
  /**
   * Assert that a condition is true
   * @param condition - The condition to assert
   * @param message - The message to log if the assertion fails
   * @param args - Additional arguments
   */
  assert(condition?: boolean, message?: string, ...args: unknown[]): void;
  
  /**
   * Print a formatted string to the console
   * @param format - The format string
   * @param args - Values to use in the format string
   */
  dirxml(value: unknown): void;
  
  /**
   * Display an object in the console
   * @param obj - The object to display
   * @param options - Display options
   */
  dir(obj: unknown, options?: object): void;

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
