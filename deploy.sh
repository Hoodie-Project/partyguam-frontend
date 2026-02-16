#!/bin/bash

DEPLOY_DIR="/Users/macmini/partyguam/partyguam-frontend"

cd $DEPLOY_DIR || { echo "❌ 디렉토리 이동 실패"; exit 1; }

echo "🚀 배포 시작"

# 현재 브랜치 확인
BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "📌 현재 브랜치: $BRANCH"

# 브랜치별 설정
if [ "$BRANCH" = "main" ]; then
  PORT=3000
  PROCESS_NAME="partyguam-main"
  ENV="production"
elif [ "$BRANCH" = "dev" ]; then
  PORT=4000
  PROCESS_NAME="partyguam-dev"
  ENV="development"
else
  echo "❌ main 또는 dev 브랜치에서만 배포 가능"
  exit 1
fi

echo "⚙ 포트: $PORT"
echo "⚙ 프로세스: $PROCESS_NAME"

# 최신 코드 pull
git pull origin $BRANCH || { echo "❌ git pull 실패"; exit 1; }

# 의존성 설치 (lock 유지)
pnpm install --frozen-lockfile || { echo "❌ pnpm install 실패"; exit 1; }

# 빌드
pnpm build || { echo "❌ build 실패"; exit 1; }

# PM2 재시작 (무중단 reload)
pm2 describe $PROCESS_NAME > /dev/null

if [ $? -eq 0 ]; then
  echo "🔄 PM2 reload"
  pm2 reload $PROCESS_NAME --update-env
else
  echo "🚀 PM2 start"
  PORT=$PORT NEXT_PUBLIC_ENV=$ENV pm2 start pnpm --name $PROCESS_NAME -- start -- -p $PORT
fi

echo "✅ 배포 완료"
