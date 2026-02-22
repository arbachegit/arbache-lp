#!/bin/bash
set -e

# Rollback script for arbache-lp
# Usage: ./scripts/rollback.sh [sha]

SERVER="root@137.184.159.216"
DEPLOY_PATH="/var/www/arbache-lp"

if [ "$1" = "--list" ] || [ "$1" = "-l" ]; then
    echo "Available releases:"
    ssh $SERVER "ls -lt $DEPLOY_PATH/releases/ | head -10"
    exit 0
fi

if [ -n "$1" ]; then
    TARGET="sha-$1"
else
    # Get previous release
    TARGET=$(ssh $SERVER "ls -t $DEPLOY_PATH/releases/ | sed -n '2p'")
fi

if [ -z "$TARGET" ]; then
    echo "❌ No release to rollback to"
    exit 1
fi

echo "Rolling back to: $TARGET"
ssh $SERVER "ln -sfn $DEPLOY_PATH/releases/$TARGET $DEPLOY_PATH/current"

echo "=== Verification ==="
curl -s http://137.184.159.216/version.json

echo ""
echo "✅ Rollback complete"
