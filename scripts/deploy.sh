#!/bin/bash
set -e

# Deploy script for arbache-lp
# Usage: ./scripts/deploy.sh

SERVER="root@137.184.159.216"
DEPLOY_PATH="/var/www/arbache-lp"
KEEP_RELEASES=5

echo "=== Building ==="
npm run build

SHA=$(git rev-parse --short HEAD)
echo "Deploying SHA: $SHA"

# Generate version.json
echo "{\"sha\": \"$SHA\", \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\", \"project\": \"arbache-lp\"}" > out/version.json

echo "=== Deploying ==="
rsync -avz --delete out/ $SERVER:$DEPLOY_PATH/releases/sha-$SHA/

echo "=== Switching symlink ==="
ssh $SERVER "ln -sfn $DEPLOY_PATH/releases/sha-$SHA $DEPLOY_PATH/current"

echo "=== Cleaning old releases ==="
ssh $SERVER "cd $DEPLOY_PATH/releases && ls -t | tail -n +$((KEEP_RELEASES + 1)) | xargs -r rm -rf"

echo "=== Verification ==="
curl -s http://137.184.159.216/version.json

echo ""
echo "✅ Deploy complete: http://137.184.159.216"
