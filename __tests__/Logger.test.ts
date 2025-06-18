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
      log: jest.fn(),
      clear: jest.fn(),
      trace: jest.fn(),
      time: jest.fn(),
      timeEnd: jest.fn(),
      timeLog: jest.fn(),
      count: jest.fn(),
      countReset: jest.fn(),
      group: jest.fn(),
      groupCollapsed: jest.fn(),
      groupEnd: jest.fn(),
      table: jest.fn(),
      assert: jest.fn(),
      dirxml: jest.fn(),
      dir: jest.fn(),
    };

    console.debug = mockConsole.debug;
    console.info = mockConsole.info;
    console.warn = mockConsole.warn;
    console.error = mockConsole.error;
    console.log = mockConsole.log;
    console.clear = mockConsole.clear;
    console.trace = mockConsole.trace;
    console.time = mockConsole.time;
    console.timeEnd = mockConsole.timeEnd;
    console.timeLog = mockConsole.timeLog;
    console.count = mockConsole.count;
    console.countReset = mockConsole.countReset;
    console.group = mockConsole.group;
    console.groupCollapsed = mockConsole.groupCollapsed;
    console.groupEnd = mockConsole.groupEnd;
    console.table = mockConsole.table;
    console.assert = mockConsole.assert;
    console.dirxml = mockConsole.dirxml;
    console.dir = mockConsole.dir;

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
    console.log = originalConsole.log;
    console.clear = originalConsole.clear;
    console.trace = originalConsole.trace;
    console.time = originalConsole.time;
    console.timeEnd = originalConsole.timeEnd;
    console.timeLog = originalConsole.timeLog;
    console.count = originalConsole.count;
    console.countReset = originalConsole.countReset;
    console.group = originalConsole.group;
    console.groupCollapsed = originalConsole.groupCollapsed;
    console.groupEnd = originalConsole.groupEnd;
    console.table = originalConsole.table;
    console.assert = originalConsole.assert;
    console.dirxml = originalConsole.dirxml;
    console.dir = originalConsole.dir;

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

  test('should warn when timer already exists', () => {
    const logger = new Logger();

    logger.time('test-timer');
    logger.time('test-timer');

    expect(mockConsole.warn).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.stringContaining("Timer 'test-timer' already exists")
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
    // 실제 호출된 첫 번째 인수를 가져와서 색상 코드가 포함되어 있는지 확인
    const firstArg = mockConsole.info.mock.calls[0][0];
    expect(firstArg).toContain('\x1b[32m'); // Green color code
    expect(firstArg).toContain('\x1b[0m'); // Reset color code
  });

  // Test for formatMessage with no colors
  test('log level should be formatted without colors when disabled', () => {
    const logger = new Logger({
      format: {
        timestamp: false,
        level: true,
        colors: false,
      },
    });

    logger.info('no color test');

    // Log level without color codes
    expect(mockConsole.info).toHaveBeenCalledWith('[INFO]', 'no color test');
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

  test('should compare log levels correctly', () => {
    const logLevels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];

    for (const minLevel of logLevels) {
      mockConsole.debug.mockClear();
      mockConsole.info.mockClear();
      mockConsole.warn.mockClear();
      mockConsole.error.mockClear();

      const logger = new Logger({
        minLevel,
        enabled: true,
      });

      logger.debug('debug message');
      logger.info('info message');
      logger.warn('warn message');
      logger.error('error message');

      for (const level of logLevels) {
        const methodName = level.toLowerCase();
        const consoleMock = mockConsole[methodName as keyof typeof mockConsole];

        if (logLevels.indexOf(level) >= logLevels.indexOf(minLevel)) {
          expect(consoleMock).toHaveBeenCalled();
        } else {
          expect(consoleMock).not.toHaveBeenCalled();
        }
      }
    }
  });

  test('should log with correct format', () => {
    const logger = new Logger();

    logger.log('log message');

    expect(mockConsole.log).toHaveBeenCalledWith(
      expect.stringContaining('[2025-01-01T00:00:00.000Z]'),
      expect.stringContaining('[INFO]'),
      'log message'
    );
  });

  test('clear method should work correctly', () => {
    const logger = new Logger();

    logger.clear();

    expect(mockConsole.clear).toHaveBeenCalled();

    mockConsole.clear.mockClear();
    logger.setEnabled(false);
    logger.clear();

    expect(mockConsole.clear).not.toHaveBeenCalled();
  });

  test('should trace with correct format', () => {
    const logger = new Logger();
    logger.setLevel(LogLevel.DEBUG);

    logger.trace('trace message');

    expect(mockConsole.trace).toHaveBeenCalledWith(
      expect.stringContaining('[2025-01-01T00:00:00.000Z]'),
      expect.stringContaining('[DEBUG]'),
      'trace message'
    );

    mockConsole.trace.mockClear();
    logger.trace();

    expect(mockConsole.trace).toHaveBeenCalledWith(
      expect.stringContaining('[2025-01-01T00:00:00.000Z]'),
      expect.stringContaining('[DEBUG]'),
      'Trace:'
    );
  });

  test('should time, timeEnd, timeLog work correctly', () => {
    const logger = new Logger();

    logger.time('test-timer');
    expect(mockConsole.time).toHaveBeenCalledWith('test-timer');

    logger.timeLog('test-timer', 'additional info');
    expect(mockConsole.timeLog).toHaveBeenCalledWith('test-timer', 'additional info');

    logger.timeEnd('test-timer');
    expect(mockConsole.timeEnd).toHaveBeenCalledWith('test-timer');

    // 존재하지 않는 타이머에 대한 경고 테스트
    mockConsole.warn.mockClear();
    logger.timeEnd('non-existent-timer');
    expect(mockConsole.warn).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.stringContaining("Timer 'non-existent-timer' does not exist")
    );

    mockConsole.warn.mockClear();
    logger.timeLog('non-existent-timer');
    expect(mockConsole.warn).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.stringContaining("Timer 'non-existent-timer' does not exist")
    );
  });

  test('should count, countReset work correctly', () => {
    const logger = new Logger();

    logger.count();
    expect(mockConsole.count).toHaveBeenCalledWith('default');
    expect(mockConsole.log).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      'default: 1'
    );

    // count 테스트 - 지정된 레이블
    mockConsole.count.mockClear();
    mockConsole.log.mockClear();
    logger.count('test-counter');
    expect(mockConsole.count).toHaveBeenCalledWith('test-counter');
    expect(mockConsole.log).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      'test-counter: 1'
    );

    // 두 번째 호출에서 카운터가 증가해야 함
    mockConsole.count.mockClear();
    mockConsole.log.mockClear();
    logger.count('test-counter');
    expect(mockConsole.count).toHaveBeenCalledWith('test-counter');
    expect(mockConsole.log).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      'test-counter: 2'
    );

    // countReset 테스트
    mockConsole.countReset.mockClear();
    logger.countReset('test-counter');
    expect(mockConsole.countReset).toHaveBeenCalledWith('test-counter');

    // 리셋 후 카운터가 1부터 다시 시작해야 함
    mockConsole.count.mockClear();
    mockConsole.log.mockClear();
    logger.count('test-counter');
    expect(mockConsole.log).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      'test-counter: 1'
    );

    // 존재하지 않는 카운터 리셋 테스트
    mockConsole.warn.mockClear();
    logger.countReset('non-existent-counter');
    expect(mockConsole.warn).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.stringContaining("Counter 'non-existent-counter' does not exist")
    );

    mockConsole.countReset.mockClear();
    logger.setEnabled(false);
    logger.countReset('test-counter');
    expect(mockConsole.countReset).not.toHaveBeenCalled();
  });

  test('should group, groupCollapsed, groupEnd work correctly', () => {
    const logger = new Logger();

    // group test
    logger.group('test-group');
    expect(mockConsole.group).toHaveBeenCalledWith('test-group');

    // group with args test
    mockConsole.group.mockClear();
    logger.group('test-group-with-args', 'arg1', 'arg2');
    expect(mockConsole.group).toHaveBeenCalledWith('test-group-with-args', 'arg1', 'arg2');

    // groupCollapsed test
    logger.groupCollapsed('test-collapsed-group');
    expect(mockConsole.groupCollapsed).toHaveBeenCalledWith('test-collapsed-group');

    // groupCollapsed with args test
    mockConsole.groupCollapsed.mockClear();
    logger.groupCollapsed('test-collapsed-with-args', 'arg1', 'arg2');
    expect(mockConsole.groupCollapsed).toHaveBeenCalledWith(
      'test-collapsed-with-args',
      'arg1',
      'arg2'
    );

    // groupEnd test
    logger.groupEnd();
    expect(mockConsole.groupEnd).toHaveBeenCalled();

    // disabled group test
    mockConsole.group.mockClear();
    mockConsole.groupEnd.mockClear();
    logger.setEnabled(false);

    logger.group('disabled-group');
    logger.groupEnd();

    expect(mockConsole.group).not.toHaveBeenCalled();
    expect(mockConsole.groupEnd).not.toHaveBeenCalled();
  });

  test('should table work correctly', () => {
    const logger = new Logger();
    const testData = { a: 1, b: 2 };

    // 기본 table 테스트
    logger.table(testData);
    expect(mockConsole.table).toHaveBeenCalledWith(testData, undefined);

    // 특정 속성만 표시하는 table 테스트
    mockConsole.table.mockClear();
    const columns = ['a'];
    logger.table(testData, columns);
    expect(mockConsole.table).toHaveBeenCalledWith(testData, columns as string[] | undefined);

    // 로깅이 비활성화된 경우 table이 호출되지 않아야 함
    mockConsole.table.mockClear();
    logger.setEnabled(false);
    logger.table(testData);
    expect(mockConsole.table).not.toHaveBeenCalled();
  });

  test('assert method should work correctly', () => {
    const logger = new Logger();

    // 조건이 false인 경우 메시지 출력
    logger.assert(false, 'assertion failed');
    expect(mockConsole.assert).toHaveBeenCalledWith(false, 'assertion failed');

    // 추가 매개변수를 가진 assert 테스트
    mockConsole.assert.mockClear();
    logger.assert(false, 'assertion failed', 'arg1', 'arg2');
    expect(mockConsole.assert).toHaveBeenCalledWith(false, 'assertion failed', 'arg1', 'arg2');

    // 조건이 true인 경우 메시지 출력하지 않음
    mockConsole.assert.mockClear();
    logger.assert(true, 'should not be displayed');
    expect(mockConsole.assert).toHaveBeenCalledWith(true, 'should not be displayed');

    // 로깅이 비활성화된 경우 assert가 호출되지 않아야 함
    mockConsole.assert.mockClear();
    logger.setEnabled(false);
    logger.assert(false, 'disabled assert');
    expect(mockConsole.assert).not.toHaveBeenCalled();
  });

  test('should work correctly dirxml and dir methods', () => {
    const logger = new Logger();
    const testObj = { a: 1, b: { c: 2 } };

    // dirxml test
    logger.dirxml(testObj);
    expect(mockConsole.dirxml).toHaveBeenCalledWith(testObj);

    // dir test
    logger.dir(testObj);
    expect(mockConsole.dir).toHaveBeenCalledWith(testObj, undefined);

    // dir with options test
    mockConsole.dir.mockClear();
    const options = { depth: 2, colors: true };
    logger.dir(testObj, options);
    expect(mockConsole.dir).toHaveBeenCalledWith(testObj, options);

    // 로깅이 비활성화된 경우 dirxml과 dir이 호출되지 않아야 함
    mockConsole.dirxml.mockClear();
    mockConsole.dir.mockClear();
    logger.setEnabled(false);

    logger.dirxml(testObj);
    logger.dir(testObj);

    expect(mockConsole.dirxml).not.toHaveBeenCalled();
    expect(mockConsole.dir).not.toHaveBeenCalled();
  });
});
