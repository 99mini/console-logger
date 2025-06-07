# Console Logger

JavaScript와 TypeScript 애플리케이션을 위한 유연한 콘솔 로깅 라이브러리로, 객체지향 및 함수형 프로그래밍 패러다임을 모두 지원합니다.

## 특징

- ESM 및 CommonJS 모듈 모두 지원
- TypeScript 지원 및 완전한 타입 정의
- 다양한 로그 레벨 (DEBUG, INFO, WARN, ERROR)
- 사용자 정의 로그 형식 (타임스탬프, 색상, 접두사)
- 객체지향 및 함수형 API 모두 제공
- 포괄적인 테스트 커버리지

## 설치

```bash
# npm 사용
npm install console-logger

# yarn 사용
yarn add console-logger

# pnpm 사용
pnpm add console-logger
```

## 사용법

### 객체지향 접근 방식

```typescript
import { Logger, LogLevel } from 'console-logger';

// 새 로거 인스턴스 생성
const logger = new Logger({
  minLevel: LogLevel.DEBUG,
  format: {
    timestamp: true,
    level: true,
    prefix: 'APP',
    colors: true,
  }
});

// 로그 메시지 출력
logger.debug('디버그 메시지');
logger.info('정보 메시지');
logger.warn('경고 메시지');
logger.error('에러 메시지', new Error('문제가 발생했습니다'));

// 런타임에 설정 변경
logger.setLevel(LogLevel.WARN);
logger.setEnabled(false);
logger.configure({
  format: {
    prefix: '새-접두사',
  }
});
```

### 함수형 접근 방식

```typescript
import { 
  debug, 
  info, 
  warn, 
  error, 
  setLevel, 
  configure, 
  LogLevel 
} from 'console-logger';

// 기본 로거를 사용하여 메시지 로깅
info('애플리케이션이 시작되었습니다');
warn('더 이상 사용되지 않는 기능이 사용되었습니다');
error('오류가 발생했습니다', new Error('문제가 발생했습니다'));

// 기본 로거 구성
setLevel(LogLevel.DEBUG);
configure({
  format: {
    prefix: '함수-API',
    timestamp: true,
  }
});

debug('이제 디버그 메시지가 표시됩니다');

// 사용자 정의 로거 인스턴스 생성
import { createLogger } from 'console-logger';

const customLogger = createLogger({
  minLevel: LogLevel.ERROR,
  format: {
    prefix: '사용자정의',
  }
});

customLogger.error('이것은 심각한 오류입니다');
```

## API 참조

### Logger 클래스

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

### 함수형 API

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

### 타입

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

## 개발

```bash
# 의존성 설치
pnpm install

# 테스트 실행
pnpm test

# 라이브러리 빌드
pnpm build

# 코드 린트
pnpm lint

# 코드 포맷
pnpm format
```

## 라이센스

MIT
