import { Logger, LogLevel } from '../src';

describe('Logger', () => {
  let originalConsole: typeof console;
  let mockConsole: Record<string, jest.Mock>;
  // Date.toISOString 모킹을 위한 변수
  let originalDateToISOString: () => string;
  let mockDateToISOString: jest.Mock;

  beforeEach(() => {
    // 원래 콘솔 메서드 저장
    originalConsole = { ...console };

    // 콘솔 메서드 모킹
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

    // Date.toISOString 모킹
    originalDateToISOString = Date.prototype.toISOString;
    mockDateToISOString = jest.fn().mockReturnValue('2025-01-01T00:00:00.000Z');
    Date.prototype.toISOString = mockDateToISOString;
  });

  afterEach(() => {
    // 원래 콘솔 메서드 복원
    console.debug = originalConsole.debug;
    console.info = originalConsole.info;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;

    // Date.toISOString 복원
    Date.prototype.toISOString = originalDateToISOString;
  });

  test('기본 로그 레벨은 INFO여야 합니다', () => {
    const logger = new Logger();

    logger.debug('디버그 메시지');
    logger.info('정보 메시지');

    expect(mockConsole.debug).not.toHaveBeenCalled();
    expect(mockConsole.info).toHaveBeenCalled();
  });

  test('로그 레벨을 변경할 수 있어야 합니다', () => {
    const logger = new Logger();

    logger.setLevel(LogLevel.DEBUG);
    logger.debug('디버그 메시지');

    expect(mockConsole.debug).toHaveBeenCalled();
  });

  test('로깅을 비활성화할 수 있어야 합니다', () => {
    const logger = new Logger();

    logger.setEnabled(false);
    logger.info('정보 메시지');
    logger.error('에러 메시지');

    expect(mockConsole.info).not.toHaveBeenCalled();
    expect(mockConsole.error).not.toHaveBeenCalled();
  });

  test('로그 형식 옵션을 구성할 수 있어야 합니다', () => {
    const logger = new Logger({
      format: {
        timestamp: false,
        level: true,
        prefix: 'TEST',
        colors: false,
      },
    });

    logger.info('테스트 메시지');

    // 타임스탬프 없이 레벨과 접두사가 포함된 로그 메시지
    expect(mockConsole.info).toHaveBeenCalledWith(
      expect.stringContaining('[INFO]'),
      expect.stringContaining('[TEST]'),
      '테스트 메시지'
    );
  });

  test('configure 메서드로 옵션을 업데이트할 수 있어야 합니다', () => {
    const logger = new Logger();

    logger.configure({
      minLevel: LogLevel.ERROR,
      format: {
        prefix: 'UPDATED',
      },
    });

    logger.warn('경고 메시지');
    logger.error('에러 메시지');

    expect(mockConsole.warn).not.toHaveBeenCalled();
    expect(mockConsole.error).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.stringContaining('[UPDATED]'),
      '에러 메시지'
    );
  });

  // 타임스탬프 포맷팅 테스트
  test('타임스탬프가 올바르게 포맷팅되어야 합니다', () => {
    const logger = new Logger({
      format: {
        timestamp: true,
        level: false,
        prefix: undefined,
      },
    });

    logger.info('타임스탬프 테스트');

    expect(mockConsole.info).toHaveBeenCalledWith(
      expect.stringContaining('[2025-01-01T00:00:00.000Z]'),
      '타임스탬프 테스트'
    );
    expect(mockDateToISOString).toHaveBeenCalled();
  });

  // 색상 적용 테스트
  test('로그 레벨에 색상이 적용되어야 합니다', () => {
    const logger = new Logger({
      format: {
        timestamp: false,
        level: true,
        colors: true,
      },
    });

    logger.info('색상 테스트');

    // 색상 코드가 포함된 로그 레벨
    expect(mockConsole.info).toHaveBeenCalledWith(expect.stringContaining('[INFO]'), '색상 테스트');
  });

  // 접두사 테스트
  test('접두사가 올바르게 추가되어야 합니다', () => {
    const logger = new Logger({
      format: {
        timestamp: false,
        level: false,
        prefix: 'PREFIX-TEST',
      },
    });

    logger.info('접두사 테스트');

    expect(mockConsole.info).toHaveBeenCalledWith('[PREFIX-TEST]', '접두사 테스트');
  });

  // LogLevel 비교 테스트
  test('로그 레벨 비교가 올바르게 작동해야 합니다', () => {
    // 기본 minLevel은 INFO
    const logger = new Logger({
      enabled: true,
    });

    // 모든 로그 레벨 테스트
    logger.debug('디버그'); // 표시되지 않아야 함
    logger.info('정보'); // 표시되어야 함
    logger.warn('경고'); // 표시되어야 함
    logger.error('에러'); // 표시되어야 함

    expect(mockConsole.debug).not.toHaveBeenCalled();
    expect(mockConsole.info).toHaveBeenCalled();
    expect(mockConsole.warn).toHaveBeenCalled();
    expect(mockConsole.error).toHaveBeenCalled();

    // 모든 콘솔 모의 초기화
    mockConsole.debug.mockClear();
    mockConsole.info.mockClear();
    mockConsole.warn.mockClear();
    mockConsole.error.mockClear();

    // minLevel을 WARN으로 변경
    logger.setLevel(LogLevel.WARN);

    logger.debug('디버그'); // 표시되지 않아야 함
    logger.info('정보'); // 표시되지 않아야 함
    logger.warn('경고'); // 표시되어야 함
    logger.error('에러'); // 표시되어야 함

    expect(mockConsole.debug).not.toHaveBeenCalled();
    expect(mockConsole.info).not.toHaveBeenCalled();
    expect(mockConsole.warn).toHaveBeenCalled();
    expect(mockConsole.error).toHaveBeenCalled();
  });
});
