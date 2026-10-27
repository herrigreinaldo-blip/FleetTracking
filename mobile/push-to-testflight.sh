#!/usr/bin/env bash

# ==============================================================================
# Fleet Management - Push to Apple TestFlight / App Store Script
# Builds iOS production release via EAS and submits using App Store Connect API Key & Distribution Certificate
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors
BOLD='\033[1m'
NC='\033[0m'
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'

echo -e "${BOLD}${CYAN}====================================================${NC}"
echo -e "${BOLD}${CYAN}    Fleet Management - Apple App Store / TestFlight ${NC}"
echo -e "${BOLD}${CYAN}====================================================${NC}"

# Check EAS CLI
if ! command -v eas &>/dev/null; then
  echo -e "${RED}❌ Error: 'eas' command not found.${NC}"
  echo -e "Please install EAS CLI with: ${YELLOW}npm install -g eas-cli${NC}"
  exit 1
fi

# Verify credentials exist
if [ ! -f "$SCRIPT_DIR/credentials/AuthKey_VTVNRS996B.p8" ]; then
  echo -e "${RED}❌ Missing App Store Connect API key in $SCRIPT_DIR/credentials/AuthKey_VTVNRS996B.p8${NC}"
  exit 1
fi

echo -e "${GREEN}✔ App Store Connect Key verified: AuthKey_VTVNRS996B.p8${NC}"
if [ -f "$SCRIPT_DIR/credentials/ios_distribution.cer" ]; then
  echo -e "${GREEN}✔ Apple Distribution Certificate verified: credentials/ios_distribution.cer${NC}"
fi

echo -e "\n${BOLD}${CYAN}Select Action:${NC}"
echo -e "1) ${BOLD}Build & Auto-Submit to TestFlight / App Store${NC} (Recommended)"
echo -e "2) Build only (Produce IPA without submitting)"
echo -e "3) Submit latest existing build to App Store Connect"
read -p "Select option [1-3] (Default: 1): " -r CHOICE
CHOICE="${CHOICE:-1}"

case "$CHOICE" in
  1)
    echo -e "\n${GREEN}→ Initiating iOS Production Build with Auto-Submit...${NC}"
    eas build --platform ios --profile production --auto-submit
    ;;
  2)
    echo -e "\n${GREEN}→ Initiating iOS Production Build...${NC}"
    eas build --platform ios --profile production
    ;;
  3)
    echo -e "\n${GREEN}→ Submitting latest build to App Store Connect...${NC}"
    eas submit --platform ios --profile production --latest
    ;;
  *)
    echo -e "${RED}Invalid choice. Exiting.${NC}"
    exit 1
    ;;
esac

echo -e "\n${BOLD}${GREEN}✔ EAS task completed successfully!${NC}"
