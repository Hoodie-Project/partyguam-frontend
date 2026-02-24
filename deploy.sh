#!/bin/bash
set -e  # 하나라도 실패하면 즉시 종료

DEPLOY_DIR="/Users/macmini/partyguam/dev-partyguham-frontend"

cd "$DEPLOY_DIR" || { echo "❌ 디렉토리 이동 실패"; exit 1; }

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
echo "🔄 git pull"
git pull origin "$BRANCH"

# 의존성 설치
echo "📦 pnpm install"
pnpm install --frozen-lockfile

# 이전 빌드 제거 (중요)
echo "🧹 .next 삭제"
rm -rf .next

# 빌드
echo "🏗 build"
pnpm build

# 기존 프로세스 삭제
if pm2 describe "$PROCESS_NAME" > /dev/null 2>&1; then
  echo "🛑 PM2 delete"
  pm2 delete "$PROCESS_NAME"
fi

# Next를 직접 실행 (pnpm wrapper 사용 X)
echo "🚀 PM2 start"
pm2 start "node node_modules/next/dist/bin/next start -p $PORT" \
  --name "$PROCESS_NAME" \
  --cwd "$DEPLOY_DIR"

pm2 save

echo "✅ 배포 완료"
