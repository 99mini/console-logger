#!/bin/bash

# e2e 테스트 실행 스크립트
echo "console-logger e2e 테스트 시작"
echo "=============================="

# 현재 디렉토리 저장
CURRENT_DIR=$(pwd)

# 테스트 디렉토리로 이동
cd "$(dirname "$0")"

# ESM 테스트 환경 설정
echo "\n[1/4] ESM 테스트 환경 설정..."
mkdir -p esm-test
cp esm-package.json esm-test/package.json
cp esm-test.js esm-test/
cd esm-test
npm install

# 패키지 버전 확인
ESM_VERSION=$(npm list @99mini/console-logger | grep @99mini/console-logger | sed 's/.*@//g')
echo "\n테스트 패키지 버전: $ESM_VERSION"
cd ..

# CJS 테스트 환경 설정
echo "\n[2/4] CJS 테스트 환경 설정..."
mkdir -p cjs-test
cp cjs-package.json cjs-test/package.json
cp cjs-test.js cjs-test/
cd cjs-test
npm install

# 패키지 버전 확인
CJS_VERSION=$(npm list @99mini/console-logger | grep @99mini/console-logger | sed 's/.*@//g')
echo "\n테스트 패키지 버전: $CJS_VERSION"
cd ..

# ESM 테스트 실행
echo "\n[3/4] ESM 테스트 실행..."
cd esm-test
node esm-test.js
ESM_RESULT=$?
cd ..

# CJS 테스트 실행
echo "\n[4/4] CJS 테스트 실행..."
cd cjs-test
node cjs-test.js
CJS_RESULT=$?
cd ..

# 결과 출력
echo "\n=============================="
echo "e2e 테스트 결과:"
echo "\n테스트한 패키지 버전: $ESM_VERSION"

if [ $ESM_RESULT -eq 0 ] && [ $CJS_RESULT -eq 0 ]; then
  echo "✅ 모든 테스트가 성공적으로 완료되었습니다!"
  echo "   - ESM 환경: 성공"
  echo "   - CJS 환경: 성공"
else
  echo "❌ 테스트 실패!"
  if [ $ESM_RESULT -ne 0 ]; then
    echo "   - ESM 테스트 실패"
  else
    echo "   - ESM 테스트 성공"
  fi
  if [ $CJS_RESULT -ne 0 ]; then
    echo "   - CJS 테스트 실패"
  else
    echo "   - CJS 테스트 성공"
  fi
fi

# 테스트 폴더 정리
echo "\n[정리] 테스트 폴더 제거 중..."
rm -rf esm-test
rm -rf cjs-test
echo "테스트 폴더가 제거되었습니다."

# 원래 디렉토리로 복귀
cd "$CURRENT_DIR"
