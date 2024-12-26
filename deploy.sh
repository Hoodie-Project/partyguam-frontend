#!/bin/bash

# 배포 디렉토리 경로 설정
DEPLOY_DIR="/Users/macmini/partyguam/partyguam-frontend"

# PM2 프로세스 이름 설정
PM2_PROCESS_NAME="partyguam-frontend"

# 배포 디렉토리로 이동
cd $DEPLOY_DIR || { echo "❌ 디렉토리 이동 실패: $DEPLOY_DIR"; exit 1; }

echo "🚀 배포 스크립트를 시작합니다..."

# .next, node_modules, pnpm-lock.yaml 삭제
echo "🧹 불필요한 파일 삭제 중..."
rm -rf .next node_modules pnpm-lock.yaml
if [ $? -ne 0 ]; then
  echo "❌ 파일 삭제 실패"; exit 1;
fi

# pnpm install 실행
echo "📦 pnpm install 실행 중..."
pnpm install
if [ $? -ne 0 ]; then
  echo "❌ pnpm install 실패"; exit 1;
fi

# pnpm build 실행
echo "🔨 pnpm build 실행 중..."
pnpm build
if [ $? -ne 0 ]; then
  echo "❌ pnpm build 실패"; exit 1;
fi

# PM2 프로세스 재시작
echo "🔄 PM2 프로세스 재시작 중..."
pm2 delete $PM2_PROCESS_NAME 2>/dev/null
pm2 start pnpm --name "$PM2_PROCESS_NAME" -- start -- -p 3000
if [ $? -ne 0 ]; then
  echo "❌ PM2 프로세스 재시작 실패"; exit 1;
fi

echo "✅ 배포가 완료되었습니다!"

