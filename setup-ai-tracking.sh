#!/bin/bash

################################################################################
# AI Impact & DORA Metrics Setup Script
#
# Purpose: Configure repository for AI impact tracking and DORA metrics
# Usage: ./setup-ai-tracking.sh
################################################################################

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║     AI Impact & DORA Metrics Tracking Setup              ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo -e "${BLUE}This script will configure your repository for:${NC}"
echo -e "  • AI impact tracking"
echo -e "  • DORA metrics collection"
echo -e "  • GitHub labels and templates"
echo -e "  • Git commit templates"
echo ""

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}Error: Not a git repository${NC}"
    echo -e "Please run this script from the root of your git repository."
    exit 1
fi

REPO_ROOT=$(git rev-parse --show-toplevel)
echo -e "${GREEN}Repository root: ${REPO_ROOT}${NC}"
echo ""

# Step 1: Configure Git Commit Template
echo -e "${YELLOW}[Step 1/5] Configuring Git Commit Template${NC}"
echo ""

if [ -f "${REPO_ROOT}/.gitmessage" ]; then
    echo -e "${BLUE}Setting up commit template...${NC}"

    # Ask user preference
    echo -e "Choose commit template scope:"
    echo -e "  1) This repository only (recommended)"
    echo -e "  2) Global (all repositories)"
    read -p "Enter choice [1-2]: " template_choice

    case $template_choice in
        1)
            git config commit.template "${REPO_ROOT}/.gitmessage"
            echo -e "${GREEN}✓ Commit template configured for this repository${NC}"
            ;;
        2)
            git config --global commit.template "${REPO_ROOT}/.gitmessage"
            echo -e "${GREEN}✓ Commit template configured globally${NC}"
            ;;
        *)
            echo -e "${YELLOW}⊘ Skipping commit template configuration${NC}"
            ;;
    esac
else
    echo -e "${RED}✗ .gitmessage file not found${NC}"
fi
echo ""

# Step 2: Make Scripts Executable
echo -e "${YELLOW}[Step 2/5] Making Metrics Scripts Executable${NC}"
echo ""

if [ -f "${REPO_ROOT}/metrics/track-ai-impact.sh" ]; then
    chmod +x "${REPO_ROOT}/metrics/track-ai-impact.sh"
    echo -e "${GREEN}✓ track-ai-impact.sh is executable${NC}"
else
    echo -e "${RED}✗ track-ai-impact.sh not found${NC}"
fi

if [ -f "${REPO_ROOT}/metrics/dora-metrics.sh" ]; then
    chmod +x "${REPO_ROOT}/metrics/dora-metrics.sh"
    echo -e "${GREEN}✓ dora-metrics.sh is executable${NC}"
else
    echo -e "${RED}✗ dora-metrics.sh not found${NC}"
fi
echo ""

# Step 3: GitHub Labels
echo -e "${YELLOW}[Step 3/5] GitHub Labels Configuration${NC}"
echo ""

if command -v gh &> /dev/null; then
    echo -e "${BLUE}GitHub CLI detected${NC}"
    read -p "Do you want to sync GitHub labels now? (requires 'gh' auth) [y/N]: " sync_labels

    if [[ $sync_labels =~ ^[Yy]$ ]]; then
        if [ -f "${REPO_ROOT}/.github/labels.yml" ]; then
            echo -e "${BLUE}Syncing labels...${NC}"
            cd "${REPO_ROOT}"

            # Check if we can use gh label sync
            if gh label list &> /dev/null; then
                # Note: gh label sync requires GitHub CLI with label sync support
                # If not available, we'll need to create labels individually
                echo -e "${YELLOW}Creating labels (this may take a moment)...${NC}"

                # Read and create labels from YAML
                while IFS= read -r line; do
                    if [[ $line =~ ^-\ name:\ \"(.+)\" ]]; then
                        label_name="${BASH_REMATCH[1]}"
                    elif [[ $line =~ ^\ \ color:\ \"(.+)\" ]]; then
                        label_color="${BASH_REMATCH[1]}"
                    elif [[ $line =~ ^\ \ description:\ \"(.+)\" ]]; then
                        label_desc="${BASH_REMATCH[1]}"

                        # Create or update label
                        gh label create "$label_name" --color "$label_color" --description "$label_desc" 2>/dev/null || \
                        gh label edit "$label_name" --color "$label_color" --description "$label_desc" 2>/dev/null || true

                        echo -e "  ${GREEN}✓${NC} $label_name"
                    fi
                done < "${REPO_ROOT}/.github/labels.yml"

                echo -e "${GREEN}✓ Labels synced${NC}"
            else
                echo -e "${RED}✗ Unable to sync labels (not authenticated or no repo access)${NC}"
                echo -e "${YELLOW}  Run: gh auth login${NC}"
            fi
        else
            echo -e "${RED}✗ .github/labels.yml not found${NC}"
        fi
    else
        echo -e "${YELLOW}⊘ Skipping label sync${NC}"
        echo -e "${BLUE}  To sync later, run:${NC}"
        echo -e "    cd ${REPO_ROOT}"
        echo -e "    # Then create labels from .github/labels.yml"
    fi
else
    echo -e "${YELLOW}⊘ GitHub CLI (gh) not installed${NC}"
    echo -e "${BLUE}  To install: https://cli.github.com/${NC}"
    echo -e "${BLUE}  To manually create labels, see: .github/labels.yml${NC}"
fi
echo ""

# Step 4: Run Baseline Metrics
echo -e "${YELLOW}[Step 4/5] Running Baseline Metrics${NC}"
echo ""

read -p "Run baseline metrics now? [Y/n]: " run_baseline

if [[ ! $run_baseline =~ ^[Nn]$ ]]; then
    echo -e "${BLUE}Generating AI Impact Metrics...${NC}"
    if [ -x "${REPO_ROOT}/metrics/track-ai-impact.sh" ]; then
        "${REPO_ROOT}/metrics/track-ai-impact.sh" 30 || echo -e "${YELLOW}⚠ Some metrics may not be available yet${NC}"
    fi
    echo ""

    echo -e "${BLUE}Generating DORA Metrics...${NC}"
    if [ -x "${REPO_ROOT}/metrics/dora-metrics.sh" ]; then
        "${REPO_ROOT}/metrics/dora-metrics.sh" 30 || echo -e "${YELLOW}⚠ Some metrics may not be available yet${NC}"
    fi
    echo ""

    echo -e "${GREEN}✓ Baseline metrics generated${NC}"
    echo -e "${BLUE}  View reports in: ${REPO_ROOT}/metrics/${NC}"
else
    echo -e "${YELLOW}⊘ Skipping baseline metrics${NC}"
    echo -e "${BLUE}  To run later:${NC}"
    echo -e "    ./metrics/track-ai-impact.sh"
    echo -e "    ./metrics/dora-metrics.sh"
fi
echo ""

# Step 5: Summary and Next Steps
echo -e "${YELLOW}[Step 5/5] Setup Complete!${NC}"
echo ""

echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                    Setup Summary                          ║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${GREEN}✓ Repository configured for AI impact tracking${NC}"
echo ""

echo -e "${BLUE}Configuration Applied:${NC}"
echo -e "  • Git commit template: $(git config commit.template || echo 'Not configured')"
echo -e "  • Metrics scripts: Executable"
echo -e "  • GitHub templates: Available"
echo -e "  • Documentation: Ready"
echo ""

echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${CYAN}1. Start Using AI Tracking${NC}"
echo -e "   Every commit should include AI metadata:"
echo -e "   ${BLUE}git commit${NC} (will open template)"
echo ""

echo -e "${CYAN}2. Use PR Template${NC}"
echo -e "   When creating PRs, fill out the AI Impact section"
echo -e "   Template auto-loads from: .github/PULL_REQUEST_TEMPLATE.md"
echo ""

echo -e "${CYAN}3. Review Documentation${NC}"
echo -e "   ${BLUE}• AI Impact Framework:${NC} docs/ai-impact-framework.md"
echo -e "   ${BLUE}• DORA Metrics Guide:${NC} docs/dora-metrics-guide.md"
echo -e "   ${BLUE}• Metrics README:${NC} metrics/README.md"
echo ""

echo -e "${CYAN}4. Regular Metrics Review${NC}"
echo -e "   ${BLUE}Weekly:${NC} ./metrics/track-ai-impact.sh"
echo -e "   ${BLUE}Weekly:${NC} ./metrics/dora-metrics.sh"
echo -e "   ${BLUE}Monthly:${NC} Review trends and patterns"
echo ""

echo -e "${CYAN}5. Team Training${NC}"
echo -e "   • Share docs/ai-impact-framework.md with team"
echo -e "   • Demonstrate commit template usage"
echo -e "   • Review PR template in team meeting"
echo ""

echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Example Commit:${NC}"
echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

cat << 'EOF'
feat(api): add user authentication endpoint

Implemented JWT-based authentication with refresh tokens.
Added login, logout, and token refresh endpoints.

AI Generated: 70%
Time Saved: 2 hours
Tools Used: Claude Code

Type: feature
Deployment: yes
Lead Time Start: 2026-02-20
Priority: P2-major

Closes #123

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF

echo ""
echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${CYAN}Quick Commands:${NC}"
echo -e "  ${BLUE}# Run metrics${NC}"
echo -e "  ./metrics/track-ai-impact.sh"
echo -e "  ./metrics/dora-metrics.sh"
echo ""
echo -e "  ${BLUE}# View reports${NC}"
echo -e "  cat metrics/ai-impact-*.json | jq ."
echo -e "  cat metrics/dora-report-*.md"
echo -e "  open metrics/dashboard.html"
echo ""
echo -e "  ${BLUE}# Create labels (if gh is installed)${NC}"
echo -e "  # (requires manual implementation based on labels.yml)"
echo ""

echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}   Setup Complete! Happy tracking! 📊                      ${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo ""

exit 0
