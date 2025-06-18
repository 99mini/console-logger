# Console Logger

A flexible console logging library for JavaScript and TypeScript applications that supports both object-oriented and functional programming paradigms.

## Features

- Support for both ESM and CommonJS modules
- TypeScript support with full type definitions
- Multiple log levels (DEBUG, INFO, WARN, ERROR)
- Customizable log formatting (timestamps, colors, prefixes)
- Both object-oriented and functional API
- Comprehensive test coverage

## Installation

```bash
# Using npm
npm install @99mini/console-logger

# Using yarn
yarn add @99mini/console-logger

# Using pnpm
pnpm add @99mini/console-logger
```

## Usage

### Object-Oriented Approach

```typescript
import { Logger, LogLevel } from '@99mini/console-logger';

// Create a new logger instance
const logger = new Logger({
  minLevel: LogLevel.DEBUG,
  format: {
    timestamp: true,
    level: true,
    prefix: 'APP',
    colors: true,
  },
});

// Log messages
logger.debug('Debug message');
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message', new Error('Something went wrong'));

// Change configuration at runtime
logger.setLevel(LogLevel.WARN);
logger.setEnabled(false);
logger.configure({
  format: {
    prefix: 'NEW-PREFIX',
  },
});
```

### Functional Approach

```typescript
import { debug, info, warn, error, setLevel, configure, LogLevel } from '@99mini/console-logger';

// Log messages using the default logger
info('Application started');
warn('Deprecated feature used');
error('Error occurred', new Error('Something went wrong'));

// Configure the default logger
setLevel(LogLevel.DEBUG);
configure({
  format: {
    prefix: 'FUNC-API',
    timestamp: true,
  },
});

debug('Debug message now visible');

// Create a custom logger instance
import { createLogger } from '@99mini/console-logger';

const customLogger = createLogger({
  minLevel: LogLevel.ERROR,
  format: {
    prefix: 'CUSTOM',
  },
});

customLogger.error('This is a critical error');
```

## API Reference

### Logger Class

```typescript
class Logger {
  constructor(options?: Partial<LoggerOptions>);

  debug(message: unknown, ...args: unknown[]): void;
  info(message: unknown, ...args: unknown[]): void;
  warn(message: unknown, ...args: unknown[]): void;
  error(message: unknown, ...args: unknown[]): void;

  setLevel(level: LogLevel): void;
  setEnabled(enabled: boolean): void;
  configure(options: Partial<LoggerOptions>): void;
}
```

### Functional API

```typescript
function createLogger(options?: Partial<LoggerOptions>): Logger;
function configure(options: Partial<LoggerOptions>): void;
function setLevel(level: LogLevel): void;
function setEnabled(enabled: boolean): void;

function debug(message: unknown, ...args: unknown[]): void;
function info(message: unknown, ...args: unknown[]): void;
function warn(message: unknown, ...args: unknown[]): void;
function error(message: unknown, ...args: unknown[]): void;

function resetDefaultLogger(): void;
```

### Types

```typescript
enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

interface LogFormatOptions {
  timestamp?: boolean;
  level?: boolean;
  prefix?: string;
  colors?: boolean;
}

interface LoggerOptions {
  minLevel?: LogLevel;
  format?: LogFormatOptions;
  enabled?: boolean;
}
```

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Build the library
pnpm build

# Lint the code
pnpm lint

# Format the code
pnpm format
```

## License

MIT
