import {
  createLogger,
  configure,
  setLevel,
  setEnabled,
  log,
  debug,
  info,
  warn,
  error,
  table,
  group,
  groupCollapsed,
  groupEnd,
  resetDefaultLogger,
} from '../src/core/functional';

import { LogLevel } from '../src/types';

describe('Functional API', () => {
  let originalConsole: typeof console;
  let mockConsole: Record<string, jest.Mock>;

  let originalDateToISOString: () => string;
  let mockDateToISOString: jest.Mock;

  beforeEach(() => {
    // Store original console methods
    originalConsole = { ...console };

    // Mock console methods
    mockConsole = {
      log: jest.fn(),
      info: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      table: jest.fn(),
      group: jest.fn(),
      groupCollapsed: jest.fn(),
      groupEnd: jest.fn(),
    };

    console.log = mockConsole.log;
    console.info = mockConsole.info;
    console.debug = mockConsole.debug;
    console.warn = mockConsole.warn;
    console.error = mockConsole.error;
    console.table = mockConsole.table;

    console.group = mockConsole.group;
    console.groupCollapsed = mockConsole.groupCollapsed;
    console.groupEnd = mockConsole.groupEnd;

    // Reset default logger for test isolation
    resetDefaultLogger();

    // Mock Date.toISOString
    originalDateToISOString = Date.prototype.toISOString;
    mockDateToISOString = jest.fn().mockReturnValue('2025-01-01T00:00:00.000Z');
    Date.prototype.toISOString = mockDateToISOString;
  });

  afterEach(() => {
    // Restore original console methods
    console.log = originalConsole.log;
    console.info = originalConsole.info;
    console.debug = originalConsole.debug;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
    console.table = originalConsole.table;

    console.group = originalConsole.group;
    console.groupCollapsed = originalConsole.groupCollapsed;
    console.groupEnd = originalConsole.groupEnd;

    // Restore Date.toISOString
    Date.prototype.toISOString = originalDateToISOString;
  });

  test('basic functional API should work', () => {
    warn('warning message');
    log('log message');
    info('info message');
    error('error message');
    debug('debug message');
    group('group message');
    groupCollapsed('groupCollapsed message');
    groupEnd();

    expect(mockConsole.log).toHaveBeenCalled();
    expect(mockConsole.info).toHaveBeenCalled();
    expect(mockConsole.warn).toHaveBeenCalled();
    expect(mockConsole.error).toHaveBeenCalled();
    expect(mockConsole.debug).not.toHaveBeenCalled(); // Default level is INFO
    expect(mockConsole.group).toHaveBeenCalled();
    expect(mockConsole.groupCollapsed).toHaveBeenCalled();
    expect(mockConsole.groupEnd).toHaveBeenCalled();
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

  test('log function should log a message', () => {
    log('log message');

    expect(mockConsole.log).toHaveBeenCalled();
  });

  test('info function should log an info message', () => {
    info('info message');

    expect(mockConsole.info).toHaveBeenCalled();
  });

  test('warn function should log a warning message', () => {
    warn('warning message');

    expect(mockConsole.warn).toHaveBeenCalled();
  });

  test('error function should log an error message', () => {
    error('error message');

    expect(mockConsole.error).toHaveBeenCalled();
  });

  test('table function should log a table', () => {
    const testData = [
      {
        name: 'John',
        age: 30,
      },
    ];
    table(testData);

    expect(mockConsole.table).toHaveBeenCalledWith(testData, undefined);

    table(testData, ['name']);
    expect(mockConsole.table).toHaveBeenCalledWith(testData, ['name']);
  });

  test('group function should log a group', () => {
    group('group message');
    groupCollapsed('groupCollapsed message');
    groupEnd();

    expect(mockConsole.group).toHaveBeenCalled();
    expect(mockConsole.groupCollapsed).toHaveBeenCalled();
    expect(mockConsole.groupEnd).toHaveBeenCalled();
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
