#!/bin/bash

################################################################################
# AI Impact Tracking Script
#
# Purpose: Track AI's impact on development velocity and quality
# Outputs: JSON and CSV reports with AI contribution metrics
#
# Usage: ./metrics/track-ai-impact.sh [--days N] [--format json|csv|both]
################################################################################

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DAYS=${1:-30}  # Default to last 30 days
OUTPUT_DIR="metrics"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
JSON_OUTPUT="${OUTPUT_DIR}/ai-impact-${TIMESTAMP}.json"
CSV_OUTPUT="${OUTPUT_DIR}/ai-impact-${TIMESTAMP}.csv"

# Ensure output directory exists
mkdir -p "${OUTPUT_DIR}"

echo -e "${BLUE}===================================${NC}"
echo -e "${BLUE}  AI Impact Tracking Report${NC}"
echo -e "${BLUE}===================================${NC}"
echo ""
echo -e "Analyzing commits from the last ${YELLOW}${DAYS}${NC} days..."
echo ""

# Function to check if we're in a git repository
check_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        echo -e "${RED}Error: Not a git repository${NC}"
        exit 1
    fi
}

# Function to extract AI metadata from commit message
extract_ai_metadata() {
    local commit_msg="$1"
    local ai_percentage=0
    local time_saved=0
    local tools_used=""

    # Extract AI Generated percentage
    if echo "$commit_msg" | grep -q "AI Generated:"; then
        ai_percentage=$(echo "$commit_msg" | grep "AI Generated:" | sed 's/.*AI Generated: *//; s/%.*//; s/ .*//; s/[^0-9]//g' | head -1)
        if [ -z "$ai_percentage" ]; then
            ai_percentage=0
        fi
    fi

    # Extract Time Saved
    if echo "$commit_msg" | grep -q "Time Saved:"; then
        time_saved=$(echo "$commit_msg" | grep "Time Saved:" | sed 's/.*Time Saved: *//; s/ hour.*//; s/ minute.*//; s/[^0-9.]//g' | head -1)
        if [ -z "$time_saved" ]; then
            time_saved=0
        fi
    fi

    # Extract Tools Used
    if echo "$commit_msg" | grep -q "Tools Used:"; then
        tools_used=$(echo "$commit_msg" | grep "Tools Used:" | sed 's/.*Tools Used: *//' | head -1 | tr -d '\n')
    fi

    echo "${ai_percentage}|${time_saved}|${tools_used}"
}

# Main analysis
check_git_repo

# Get date range
SINCE_DATE=$(date -v-${DAYS}d +%Y-%m-%d 2>/dev/null || date -d "${DAYS} days ago" +%Y-%m-%d 2>/dev/null || date +%Y-%m-%d)

echo -e "${GREEN}Collecting commit data...${NC}"

# Initialize counters
total_commits=0
ai_commits=0
human_commits=0
total_ai_percentage=0
total_time_saved=0
declare -A tools_count
declare -A ai_commits_by_type

# Collect commit data
while IFS='|' read -r hash date author subject; do
    ((total_commits++))

    # Get full commit message
    commit_msg=$(git log -1 --format=%B "$hash")

    # Extract AI metadata
    IFS='|' read -r ai_pct time_saved tools <<< "$(extract_ai_metadata "$commit_msg")"

    # Determine if AI-assisted
    if [ "$ai_pct" -gt 0 ] || [ -n "$tools" ]; then
        ((ai_commits++))
        total_ai_percentage=$((total_ai_percentage + ai_pct))

        # Parse time saved (handle decimal)
        if [ -n "$time_saved" ]; then
            total_time_saved=$(echo "$total_time_saved + $time_saved" | bc 2>/dev/null || echo "$total_time_saved")
        fi

        # Count tools
        if [ -n "$tools" ]; then
            IFS=',' read -ra TOOL_ARRAY <<< "$tools"
            for tool in "${TOOL_ARRAY[@]}"; do
                tool=$(echo "$tool" | xargs)  # trim whitespace
                if [ -n "$tool" ]; then
                    tools_count["$tool"]=$((${tools_count["$tool"]:-0} + 1))
                fi
            done
        fi

        # Categorize by AI percentage
        if [ "$ai_pct" -ge 75 ]; then
            ai_commits_by_type["75-100%"]=$((${ai_commits_by_type["75-100%"]:-0} + 1))
        elif [ "$ai_pct" -ge 50 ]; then
            ai_commits_by_type["50-75%"]=$((${ai_commits_by_type["50-75%"]:-0} + 1))
        elif [ "$ai_pct" -ge 25 ]; then
            ai_commits_by_type["25-50%"]=$((${ai_commits_by_type["25-50%"]:-0} + 1))
        elif [ "$ai_pct" -gt 0 ]; then
            ai_commits_by_type["1-25%"]=$((${ai_commits_by_type["1-25%"]:-0} + 1))
        fi
    else
        ((human_commits++))
    fi
done < <(git log --since="$SINCE_DATE" --format="%H|%ai|%an|%s" --no-merges)

# Calculate statistics
if [ "$total_commits" -gt 0 ]; then
    ai_commit_percentage=$(echo "scale=2; ($ai_commits * 100) / $total_commits" | bc)
else
    ai_commit_percentage=0
fi

if [ "$ai_commits" -gt 0 ]; then
    avg_ai_percentage=$(echo "scale=2; $total_ai_percentage / $ai_commits" | bc)
else
    avg_ai_percentage=0
fi

# Get code statistics
total_additions=$(git log --since="$SINCE_DATE" --numstat --format="" --no-merges | awk '{add+=$1} END {print add+0}')
total_deletions=$(git log --since="$SINCE_DATE" --numstat --format="" --no-merges | awk '{del+=$2} END {print del+0}')
total_files_changed=$(git log --since="$SINCE_DATE" --numstat --format="" --no-merges | awk '{files++} END {print files+0}')

# Calculate velocity metrics
commits_per_day=$(echo "scale=2; $total_commits / $DAYS" | bc)

# Print summary
echo ""
echo -e "${GREEN}===================================${NC}"
echo -e "${GREEN}  Summary (Last ${DAYS} Days)${NC}"
echo -e "${GREEN}===================================${NC}"
echo ""
echo -e "Total Commits:        ${YELLOW}${total_commits}${NC}"
echo -e "AI-Assisted Commits:  ${YELLOW}${ai_commits}${NC} (${ai_commit_percentage}%)"
echo -e "Human-Only Commits:   ${YELLOW}${human_commits}${NC} ($((100 - ${ai_commit_percentage%.*}))%)"
echo ""
echo -e "${GREEN}AI Impact:${NC}"
echo -e "Average AI %:         ${YELLOW}${avg_ai_percentage}%${NC}"
echo -e "Total Time Saved:     ${YELLOW}${total_time_saved}${NC} hours"
echo ""
echo -e "${GREEN}Code Changes:${NC}"
echo -e "Lines Added:          ${YELLOW}${total_additions}${NC}"
echo -e "Lines Deleted:        ${YELLOW}${total_deletions}${NC}"
echo -e "Files Changed:        ${YELLOW}${total_files_changed}${NC}"
echo ""
echo -e "${GREEN}Velocity:${NC}"
echo -e "Commits/Day:          ${YELLOW}${commits_per_day}${NC}"
echo ""

# Print AI distribution
if [ ${#ai_commits_by_type[@]} -gt 0 ]; then
    echo -e "${GREEN}AI Contribution Distribution:${NC}"
    for range in "75-100%" "50-75%" "25-50%" "1-25%"; do
        count=${ai_commits_by_type[$range]:-0}
        if [ $count -gt 0 ]; then
            echo -e "  ${range}:  ${YELLOW}${count}${NC} commits"
        fi
    done
    echo ""
fi

# Print tools usage
if [ ${#tools_count[@]} -gt 0 ]; then
    echo -e "${GREEN}AI Tools Used:${NC}"
    for tool in "${!tools_count[@]}"; do
        echo -e "  ${tool}:  ${YELLOW}${tools_count[$tool]}${NC} times"
    done
    echo ""
fi

# Generate JSON output
echo -e "${BLUE}Generating JSON report: ${JSON_OUTPUT}${NC}"

cat > "$JSON_OUTPUT" <<EOF
{
  "report_metadata": {
    "generated_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "period_days": ${DAYS},
    "start_date": "${SINCE_DATE}",
    "end_date": "$(date +%Y-%m-%d)"
  },
  "summary": {
    "total_commits": ${total_commits},
    "ai_assisted_commits": ${ai_commits},
    "human_only_commits": ${human_commits},
    "ai_commit_percentage": ${ai_commit_percentage},
    "average_ai_contribution_percentage": ${avg_ai_percentage},
    "total_time_saved_hours": ${total_time_saved}
  },
  "code_changes": {
    "total_additions": ${total_additions},
    "total_deletions": ${total_deletions},
    "total_files_changed": ${total_files_changed},
    "net_lines_changed": $((total_additions - total_deletions))
  },
  "velocity": {
    "commits_per_day": ${commits_per_day}
  },
  "ai_distribution": {
EOF

# Add AI distribution to JSON
first=true
for range in "75-100%" "50-75%" "25-50%" "1-25%"; do
    count=${ai_commits_by_type[$range]:-0}
    if [ "$first" = true ]; then
        first=false
    else
        echo "," >> "$JSON_OUTPUT"
    fi
    echo -n "    \"${range}\": ${count}" >> "$JSON_OUTPUT"
done

cat >> "$JSON_OUTPUT" <<EOF

  },
  "tools_usage": {
EOF

# Add tools usage to JSON
first=true
for tool in "${!tools_count[@]}"; do
    if [ "$first" = true ]; then
        first=false
    else
        echo "," >> "$JSON_OUTPUT"
    fi
    echo -n "    \"${tool}\": ${tools_count[$tool]}" >> "$JSON_OUTPUT"
done

cat >> "$JSON_OUTPUT" <<EOF

  }
}
EOF

# Generate CSV output
echo -e "${BLUE}Generating CSV report: ${CSV_OUTPUT}${NC}"

cat > "$CSV_OUTPUT" <<EOF
Metric,Value
Report Generated,$(date -u +%Y-%m-%dT%H:%M:%SZ)
Period (Days),${DAYS}
Start Date,${SINCE_DATE}
End Date,$(date +%Y-%m-%d)
Total Commits,${total_commits}
AI-Assisted Commits,${ai_commits}
Human-Only Commits,${human_commits}
AI Commit Percentage,${ai_commit_percentage}%
Average AI Contribution,${avg_ai_percentage}%
Total Time Saved (Hours),${total_time_saved}
Lines Added,${total_additions}
Lines Deleted,${total_deletions}
Files Changed,${total_files_changed}
Commits Per Day,${commits_per_day}
EOF

echo ""
echo -e "${GREEN}Reports generated successfully!${NC}"
echo -e "  JSON: ${JSON_OUTPUT}"
echo -e "  CSV:  ${CSV_OUTPUT}"
echo ""
echo -e "${BLUE}===================================${NC}"

exit 0
