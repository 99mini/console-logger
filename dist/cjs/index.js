'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Log level enumeration
 */
exports.LogLevel = void 0;
(function (LogLevel) {
    LogLevel["DEBUG"] = "debug";
    LogLevel["INFO"] = "info";
    LogLevel["WARN"] = "warn";
    LogLevel["ERROR"] = "error";
})(exports.LogLevel || (exports.LogLevel = {}));

/**
 * Default logger options
 */
const DEFAULT_OPTIONS = {
    minLevel: exports.LogLevel.INFO,
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
    [exports.LogLevel.DEBUG]: '\x1b[36m',
    [exports.LogLevel.INFO]: '\x1b[32m',
    [exports.LogLevel.WARN]: '\x1b[33m',
    [exports.LogLevel.ERROR]: '\x1b[31m',
    reset: '\x1b[0m',
};
/**
 * Core Logger implementation
 */
class Logger {
    /**
     * Create a new Logger instance
     * @param options - Logger configuration options
     */
    constructor(options = {}) {
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
    formatMessage(level, message, ...args) {
        const parts = [];
        const { format } = this.options;
        // Add timestamp if enabled
        if (format === null || format === void 0 ? void 0 : format.timestamp) {
            const timestamp = new Date().toISOString();
            parts.push(`[${timestamp}]`);
        }
        // Add log level if enabled
        if (format === null || format === void 0 ? void 0 : format.level) {
            const levelStr = `[${level.toUpperCase()}]`;
            // Apply colors if enabled
            if (format === null || format === void 0 ? void 0 : format.colors) {
                parts.push(`${COLORS[level]}${levelStr}${COLORS.reset}`);
            }
            else {
                parts.push(levelStr);
            }
        }
        // Add prefix if specified
        if (format === null || format === void 0 ? void 0 : format.prefix) {
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
    shouldLog(level) {
        if (!this.options.enabled) {
            return false;
        }
        const levels = Object.values(exports.LogLevel);
        const minLevelIndex = levels.indexOf(this.options.minLevel || exports.LogLevel.INFO);
        const currentLevelIndex = levels.indexOf(level);
        return currentLevelIndex >= minLevelIndex;
    }
    /**
     * Log a debug message
     * @param message - The message to log
     * @param args - Additional arguments to log
     */
    debug(message, ...args) {
        if (this.shouldLog(exports.LogLevel.DEBUG)) {
            console.debug(...this.formatMessage(exports.LogLevel.DEBUG, message, ...args));
        }
    }
    /**
     * Log an info message
     * @param message - The message to log
     * @param args - Additional arguments to log
     */
    info(message, ...args) {
        if (this.shouldLog(exports.LogLevel.INFO)) {
            console.info(...this.formatMessage(exports.LogLevel.INFO, message, ...args));
        }
    }
    /**
     * Log a warning message
     * @param message - The message to log
     * @param args - Additional arguments to log
     */
    warn(message, ...args) {
        if (this.shouldLog(exports.LogLevel.WARN)) {
            console.warn(...this.formatMessage(exports.LogLevel.WARN, message, ...args));
        }
    }
    /**
     * Log an error message
     * @param message - The message to log
     * @param args - Additional arguments to log
     */
    error(message, ...args) {
        if (this.shouldLog(exports.LogLevel.ERROR)) {
            console.error(...this.formatMessage(exports.LogLevel.ERROR, message, ...args));
        }
    }
    /**
     * Set the minimum log level
     * @param level - The minimum log level
     */
    setLevel(level) {
        this.options.minLevel = level;
    }
    /**
     * Enable or disable logging
     * @param enabled - Whether logging is enabled
     */
    setEnabled(enabled) {
        this.options.enabled = enabled;
    }
    /**
     * Update logger options
     * @param options - New logger options
     */
    configure(options) {
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

/**
 * Singleton logger instance for functional API
 */
let defaultLogger = new Logger();
/**
 * Create a new logger instance
 * @param options - Logger configuration options
 * @returns A new Logger instance
 */
function createLogger(options = {}) {
    return new Logger(options);
}
/**
 * Configure the default logger
 * @param options - Logger configuration options
 */
function configure(options) {
    defaultLogger.configure(options);
}
/**
 * Set the minimum log level for the default logger
 * @param level - The minimum log level
 */
function setLevel(level) {
    defaultLogger.setLevel(level);
}
/**
 * Enable or disable the default logger
 * @param enabled - Whether logging is enabled
 */
function setEnabled(enabled) {
    defaultLogger.setEnabled(enabled);
}
/**
 * Log a debug message using the default logger
 * @param message - The message to log
 * @param args - Additional arguments to log
 */
function debug(message, ...args) {
    defaultLogger.debug(message, ...args);
}
/**
 * Log an info message using the default logger
 * @param message - The message to log
 * @param args - Additional arguments to log
 */
function info(message, ...args) {
    defaultLogger.info(message, ...args);
}
/**
 * Log a warning message using the default logger
 * @param message - The message to log
 * @param args - Additional arguments to log
 */
function warn(message, ...args) {
    defaultLogger.warn(message, ...args);
}
/**
 * Log an error message using the default logger
 * @param message - The message to log
 * @param args - Additional arguments to log
 */
function error(message, ...args) {
    defaultLogger.error(message, ...args);
}
/**
 * Reset the default logger to its initial state
 */
function resetDefaultLogger() {
    defaultLogger = new Logger();
}

exports.Logger = Logger;
exports.configure = configure;
exports.createLogger = createLogger;
exports.debug = debug;
exports.error = error;
exports.info = info;
exports.resetDefaultLogger = resetDefaultLogger;
exports.setEnabled = setEnabled;
exports.setLevel = setLevel;
exports.warn = warn;
//# sourceMappingURL=index.js.map
