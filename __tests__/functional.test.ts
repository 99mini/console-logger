import {
  createLogger,
  configure,
  setLevel,
  setEnabled,
  debug,
  info,
  warn,
  error,
  resetDefaultLogger,
  LogLevel,
} from '../src';

describe('Functional API', () => {
  let originalConsole: typeof console;
  let mockConsole: Record<string, jest.Mock>;

  beforeEach(() => {
    // Store original console methods
    originalConsole = { ...console };

    // Mock console methods
    mockConsole = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };

    console.debug = mockConsole.debug;
    console.info = mockConsole.info;
    console.warn = mockConsole.warn;
    console.error = mockConsole.error;

    // Reset default logger for test isolation
    resetDefaultLogger();
  });

  afterEach(() => {
    // Restore original console methods
    console.debug = originalConsole.debug;
    console.info = originalConsole.info;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
  });

  test('basic functional API should work', () => {
    info('info message');
    warn('warning message');
    error('error message');
    debug('debug message');

    expect(mockConsole.info).toHaveBeenCalled();
    expect(mockConsole.warn).toHaveBeenCalled();
    expect(mockConsole.error).toHaveBeenCalled();
    expect(mockConsole.debug).not.toHaveBeenCalled(); // Default level is INFO
  });

  test('setLevel function should change log level', () => {
    setLevel(LogLevel.DEBUG);
    debug('debug message');

    expect(mockConsole.debug).toHaveBeenCalled();
  });

  test('setEnabled function should disable logging', () => {
    setEnabled(false);
    info('info message');

    expect(mockConsole.info).not.toHaveBeenCalled();
  });

  test('configure function should update logger options', () => {
    configure({
      minLevel: LogLevel.ERROR,
      format: {
        prefix: 'TEST-FUNC',
      },
    });

    warn('warning message');
    error('error message');

    expect(mockConsole.warn).not.toHaveBeenCalled();
    expect(mockConsole.error).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.stringContaining('[TEST-FUNC]'),
      'error message'
    );
  });

  test('createLogger function should create a new logger instance', () => {
    const customLogger = createLogger({
      minLevel: LogLevel.DEBUG,
      format: {
        prefix: 'CUSTOM',
      },
    });

    customLogger.debug('custom debug message');

    expect(mockConsole.debug).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.stringContaining('[CUSTOM]'),
      'custom debug message'
    );

    // Default logger should not be affected
    debug('default debug message');
    expect(mockConsole.debug).toHaveBeenCalledTimes(1); // Still only called once
  });

  // Test for createLogger default options (line 14 coverage)
  test('createLogger function should be callable without options', () => {
    // Call createLogger without options
    const defaultLogger = createLogger();

    // Default logger logs from INFO level
    defaultLogger.debug('invisible message');
    defaultLogger.info('visible message');

    expect(mockConsole.debug).not.toHaveBeenCalled();
    expect(mockConsole.info).toHaveBeenCalled();
  });
});
