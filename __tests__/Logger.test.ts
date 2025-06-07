import { Logger, LogLevel } from '../src';

describe('Logger', () => {
  let originalConsole: typeof console;
  let mockConsole: Record<string, jest.Mock>;
  // Variables for mocking Date.toISOString
  let originalDateToISOString: () => string;
  let mockDateToISOString: jest.Mock;

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

    // Mock Date.toISOString
    originalDateToISOString = Date.prototype.toISOString;
    mockDateToISOString = jest.fn().mockReturnValue('2025-01-01T00:00:00.000Z');
    Date.prototype.toISOString = mockDateToISOString;
  });

  afterEach(() => {
    // Restore original console methods
    console.debug = originalConsole.debug;
    console.info = originalConsole.info;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;

    // Restore Date.toISOString
    Date.prototype.toISOString = originalDateToISOString;
  });

  test('default log level should be INFO', () => {
    const logger = new Logger();

    logger.debug('debug message');
    logger.info('info message');

    expect(mockConsole.debug).not.toHaveBeenCalled();
    expect(mockConsole.info).toHaveBeenCalled();
  });

  test('should be able to change log level', () => {
    const logger = new Logger();

    logger.setLevel(LogLevel.DEBUG);
    logger.debug('debug message');

    expect(mockConsole.debug).toHaveBeenCalled();
  });

  test('should be able to disable logging', () => {
    const logger = new Logger();

    logger.setEnabled(false);
    logger.info('info message');
    logger.error('error message');

    expect(mockConsole.info).not.toHaveBeenCalled();
    expect(mockConsole.error).not.toHaveBeenCalled();
  });

  test('should be able to configure log format options', () => {
    const logger = new Logger({
      format: {
        timestamp: false,
        level: true,
        prefix: 'TEST',
        colors: false,
      },
    });

    logger.info('test message');

    // Log message with level and prefix but no timestamp
    expect(mockConsole.info).toHaveBeenCalledWith(
      expect.stringContaining('[INFO]'),
      expect.stringContaining('[TEST]'),
      'test message'
    );
  });

  test('should be able to update options with configure method', () => {
    const logger = new Logger();

    logger.configure({
      minLevel: LogLevel.ERROR,
      format: {
        prefix: 'UPDATED',
      },
    });

    logger.warn('warning message');
    logger.error('error message');

    expect(mockConsole.warn).not.toHaveBeenCalled();
    expect(mockConsole.error).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.stringContaining('[UPDATED]'),
      'error message'
    );
  });

  // Timestamp formatting test
  test('timestamp should be correctly formatted', () => {
    const logger = new Logger({
      format: {
        timestamp: true,
        level: false,
        prefix: undefined,
      },
    });

    logger.info('timestamp test');

    expect(mockConsole.info).toHaveBeenCalledWith(
      expect.stringContaining('[2025-01-01T00:00:00.000Z]'),
      'timestamp test'
    );
    expect(mockDateToISOString).toHaveBeenCalled();
  });

  // Color application test
  test('log level should have colors applied', () => {
    const logger = new Logger({
      format: {
        timestamp: false,
        level: true,
        colors: true,
      },
    });

    logger.info('color test');

    // Log level with color codes
    expect(mockConsole.info).toHaveBeenCalledWith(expect.stringContaining('[INFO]'), 'color test');
  });

  // Prefix test
  test('prefix should be correctly added', () => {
    const logger = new Logger({
      format: {
        timestamp: false,
        level: false,
        prefix: 'PREFIX-TEST',
      },
    });

    logger.info('prefix test');

    expect(mockConsole.info).toHaveBeenCalledWith('[PREFIX-TEST]', 'prefix test');
  });

  // LogLevel comparison test
  test('log level comparison should work correctly', () => {
    // Default minLevel is INFO
    const logger = new Logger({
      enabled: true,
    });

    // Test all log levels
    logger.debug('debug'); // Should not be displayed
    logger.info('info'); // Should be displayed
    logger.warn('warn'); // Should be displayed
    logger.error('error'); // Should be displayed

    expect(mockConsole.debug).not.toHaveBeenCalled();
    expect(mockConsole.info).toHaveBeenCalled();
    expect(mockConsole.warn).toHaveBeenCalled();
    expect(mockConsole.error).toHaveBeenCalled();

    // Clear all console mocks
    mockConsole.debug.mockClear();
    mockConsole.info.mockClear();
    mockConsole.warn.mockClear();
    mockConsole.error.mockClear();

    // Change minLevel to WARN
    logger.setLevel(LogLevel.WARN);

    logger.debug('debug'); // Should not be displayed
    logger.info('info'); // Should not be displayed
    logger.warn('warn'); // Should be displayed
    logger.error('error'); // Should be displayed

    expect(mockConsole.debug).not.toHaveBeenCalled();
    expect(mockConsole.info).not.toHaveBeenCalled();
    expect(mockConsole.warn).toHaveBeenCalled();
    expect(mockConsole.error).toHaveBeenCalled();
  });
});
