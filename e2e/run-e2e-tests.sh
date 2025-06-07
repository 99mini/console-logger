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
cd ..

# CJS 테스트 환경 설정
echo "\n[2/4] CJS 테스트 환경 설정..."
mkdir -p cjs-test
cp cjs-package.json cjs-test/package.json
cp cjs-test.js cjs-test/
cd cjs-test
npm install
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
if [ $ESM_RESULT -eq 0 ] && [ $CJS_RESULT -eq 0 ]; then
  echo "✅ 모든 테스트가 성공적으로 완료되었습니다!"
else
  echo "❌ 테스트 실패!"
  [ $ESM_RESULT -ne 0 ] && echo "   - ESM 테스트 실패"
  [ $CJS_RESULT -ne 0 ] && echo "   - CJS 테스트 실패"
fi

# 원래 디렉토리로 복귀
cd "$CURRENT_DIR"
