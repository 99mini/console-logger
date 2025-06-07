import { Logger, LogLevel } from '../src';

describe('Logger', () => {
  let originalConsole: typeof console;
  let mockConsole: Record<string, jest.Mock>;

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
  });

  afterEach(() => {
    // 원래 콘솔 메서드 복원
    console.debug = originalConsole.debug;
    console.info = originalConsole.info;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
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
      }
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
      }
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
});
