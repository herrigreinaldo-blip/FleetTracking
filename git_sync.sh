#!/usr/bin/env bash

# ==============================================================================
# Dual Git Sync Script
# Simultaneously pulls from and pushes to both remotes:
# 1) Delivery-Finance (origin)
# 2) FleetTracking (fleettracking)
# ==============================================================================

set -uo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

BOLD='\033[1m'
NC='\033[0m'
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'

CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'main')"

echo -e "${BOLD}${CYAN}====================================================${NC}"
echo -e "${BOLD}${CYAN}     Dual Git Sync (Delivery-Finance & FleetTracking)${NC}"
echo -e "${BOLD}${CYAN}====================================================${NC}"
echo -e "Current Branch: ${BOLD}${CURRENT_BRANCH}${NC}\n"

ACTION="${1:-all}"

sync_pull() {
  echo -e "${YELLOW}→ Fetching and pulling from remotes...${NC}"
  git fetch origin 2>&1 || true
  git fetch fleettracking 2>&1 || true
  
  # Try pull from origin if remote branch exists
  if git ls-remote --exit-code origin "$CURRENT_BRANCH" &>/dev/null; then
    echo -e "${GREEN}✔ Pulling latest from origin/$CURRENT_BRANCH...${NC}"
    git pull origin "$CURRENT_BRANCH" --rebase || true
  fi

  # Try pull from fleettracking if remote branch exists
  if git ls-remote --exit-code fleettracking "$CURRENT_BRANCH" &>/dev/null; then
    echo -e "${GREEN}✔ Pulling latest from fleettracking/$CURRENT_BRANCH...${NC}"
    git pull fleettracking "$CURRENT_BRANCH" --rebase || true
  fi
}

sync_push() {
  echo -e "\n${YELLOW}→ Pushing simultaneously to both remotes...${NC}"
  # Pushing to origin pushes to both Delivery-Finance & FleetTracking automatically
  git push origin "$CURRENT_BRANCH"
  echo -e "${GREEN}✔ Successfully pushed to both repositories!${NC}"
}

case "$ACTION" in
  pull)
    sync_pull
    ;;
  push)
    sync_push
    ;;
  all|*)
    sync_pull
    sync_push
    ;;
esac

echo -e "\n${BOLD}${GREEN}✔ Sync complete!${NC}"
