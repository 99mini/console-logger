// CJS 환경에서 console-logger 테스트
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createLogger, debug, info, warn, error, LogLevel } = require('@99mini/console-logger');

console.log('CJS 환경에서 console-logger 테스트 시작');

// 기본 함수형 API 테스트
console.log('\n1. 기본 함수형 API 테스트:');
debug('디버그 메시지 - 기본적으로 표시되지 않아야 함');
info('정보 메시지');
warn('경고 메시지');
error('에러 메시지');

// 로거 인스턴스 생성 테스트
console.log('\n2. 로거 인스턴스 생성 테스트:');
const logger = createLogger({
  minLevel: LogLevel.DEBUG,
  format: {
    timestamp: true,
    level: true,
    color: true,
    prefix: 'CJS-TEST',
  },
});

logger.debug('디버그 메시지 - 표시되어야 함');
logger.info('정보 메시지');
logger.warn('경고 메시지');
logger.error('에러 메시지');
logger.table({
  name: 'John',
  age: 30,
});
logger.table(
  {
    name: 'John',
    age: 30,
  },
  ['name']
);

// 로거 설정 변경 테스트
console.log('\n3. 로거 설정 변경 테스트:');
logger.setLevel(LogLevel.WARN);
logger.debug('디버그 메시지 - 표시되지 않아야 함');
logger.info('정보 메시지 - 표시되지 않아야 함');
logger.warn('경고 메시지 - 표시되어야 함');
logger.error('에러 메시지 - 표시되어야 함');
logger.table({
  name: 'John',
  age: 30,
});
logger.table(
  {
    name: 'John',
    age: 30,
  },
  ['name']
);

// 로거 비활성화 테스트
console.log('\n4. 로거 비활성화 테스트:');
logger.setEnabled(false);
logger.warn('경고 메시지 - 표시되지 않아야 함');
logger.error('에러 메시지 - 표시되지 않아야 함');
logger.table({
  name: 'John',
  age: 30,
});
logger.table(
  {
    name: 'John',
    age: 30,
  },
  ['name']
);

console.log('\nCJS 환경에서 console-logger 테스트 완료');
