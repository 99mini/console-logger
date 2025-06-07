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
  LogLevel 
} from '../src';

describe('함수형 API', () => {
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
    
    // 테스트 간 독립성을 위해 기본 로거 초기화
    resetDefaultLogger();
  });

  afterEach(() => {
    // 원래 콘솔 메서드 복원
    console.debug = originalConsole.debug;
    console.info = originalConsole.info;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
  });

  test('기본 함수형 API가 작동해야 합니다', () => {
    info('정보 메시지');
    warn('경고 메시지');
    error('에러 메시지');
    debug('디버그 메시지');
    
    expect(mockConsole.info).toHaveBeenCalled();
    expect(mockConsole.warn).toHaveBeenCalled();
    expect(mockConsole.error).toHaveBeenCalled();
    expect(mockConsole.debug).not.toHaveBeenCalled(); // 기본 레벨은 INFO
  });

  test('setLevel 함수가 로그 레벨을 변경해야 합니다', () => {
    setLevel(LogLevel.DEBUG);
    debug('디버그 메시지');
    
    expect(mockConsole.debug).toHaveBeenCalled();
  });

  test('setEnabled 함수가 로깅을 비활성화해야 합니다', () => {
    setEnabled(false);
    info('정보 메시지');
    
    expect(mockConsole.info).not.toHaveBeenCalled();
  });

  test('configure 함수가 로거 옵션을 업데이트해야 합니다', () => {
    configure({
      minLevel: LogLevel.ERROR,
      format: {
        prefix: 'TEST-FUNC',
      }
    });
    
    warn('경고 메시지');
    error('에러 메시지');
    
    expect(mockConsole.warn).not.toHaveBeenCalled();
    expect(mockConsole.error).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.stringContaining('[TEST-FUNC]'),
      '에러 메시지'
    );
  });

  test('createLogger 함수가 새 로거 인스턴스를 생성해야 합니다', () => {
    const customLogger = createLogger({
      minLevel: LogLevel.DEBUG,
      format: {
        prefix: 'CUSTOM',
      }
    });
    
    customLogger.debug('커스텀 디버그 메시지');
    
    expect(mockConsole.debug).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.stringContaining('[CUSTOM]'),
      '커스텀 디버그 메시지'
    );
    
    // 기본 로거는 영향을 받지 않아야 함
    debug('기본 디버그 메시지');
    expect(mockConsole.debug).toHaveBeenCalledTimes(1); // 여전히 한 번만 호출됨
  });
  
  // createLogger 함수의 기본 옵션 테스트 (14번 라인 커버리지)
  test('createLogger 함수는 옵션 없이도 호출할 수 있어야 합니다', () => {
    // 옵션 없이 createLogger 호출
    const defaultLogger = createLogger();
    
    // 기본 로거는 INFO 레벨부터 로깅
    defaultLogger.debug('보이지 않는 메시지');
    defaultLogger.info('보이는 메시지');
    
    expect(mockConsole.debug).not.toHaveBeenCalled();
    expect(mockConsole.info).toHaveBeenCalled();
  });
});
