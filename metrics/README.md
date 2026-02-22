# Metrics Directory

This directory contains AI Impact and DORA metrics tracking infrastructure.

## Contents

### Scripts

- **`track-ai-impact.sh`** - Generates AI impact metrics (velocity, time saved, tool usage)
- **`dora-metrics.sh`** - Calculates DORA metrics (deployment freq, lead time, failure rate, MTTR)

### Reports

Generated reports are stored here:
- `ai-impact-YYYYMMDD_HHMMSS.json` - AI metrics in JSON format
- `ai-impact-YYYYMMDD_HHMMSS.csv` - AI metrics in CSV format
- `dora-metrics-YYYYMMDD_HHMMSS.json` - DORA metrics in JSON format
- `dora-report-YYYYMMDD_HHMMSS.md` - DORA metrics in Markdown format
- `dashboard.html` - Interactive HTML dashboard

### Templates

- **`ai-impact-report.md`** - Template for detailed AI impact reports

## Quick Start

### 1. Run AI Impact Metrics

```bash
# Last 30 days (default)
./metrics/track-ai-impact.sh

# Custom period (e.g., 60 days)
./metrics/track-ai-impact.sh 60
```

**Output:**
```
Total Commits:        150
AI-Assisted Commits:  90 (60%)
Average AI %:         65%
Total Time Saved:     120 hours

Lines Added:          15,234
Lines Deleted:        3,456
Files Changed:        234

Commits/Day:          5.0
```

### 2. Run DORA Metrics

```bash
# Last 30 days (default)
./metrics/dora-metrics.sh

# Custom period
./metrics/dora-metrics.sh 60
```

**Output:**
```
Deployment Frequency:  3.2/week (High)
Lead Time:            4.5 days (High)
Change Failure Rate:  12% (Elite)
Time to Restore:      1.8 hours (High)

Overall Performance:  High Performer (3.5/4.0)
```

### 3. View Reports

```bash
# View latest JSON reports
cat metrics/ai-impact-*.json | jq .
cat metrics/dora-metrics-*.json | jq .

# View Markdown report
cat metrics/dora-report-*.md

# Open HTML dashboard
open metrics/dashboard.html
```

## Automated Metrics

Metrics are automatically generated:
- **Daily**: Via GitHub Actions (lightweight collection)
- **Weekly**: Full reports with dashboard updates
- **On-demand**: Manual workflow dispatch

See `.github/workflows/metrics-dashboard.yml` for automation configuration.

## File Formats

### AI Impact JSON

```json
{
  "report_metadata": {
    "generated_at": "2026-02-21T10:00:00Z",
    "period_days": 30
  },
  "summary": {
    "total_commits": 150,
    "ai_assisted_commits": 90,
    "ai_commit_percentage": 60,
    "average_ai_contribution_percentage": 65,
    "total_time_saved_hours": 120
  },
  "code_changes": {
    "total_additions": 15234,
    "total_deletions": 3456
  },
  "velocity": {
    "commits_per_day": 5.0
  }
}
```

### DORA Metrics JSON

```json
{
  "dora_metrics": {
    "deployment_frequency": {
      "per_week": 3.2,
      "performance_level": "High"
    },
    "lead_time_for_changes": {
      "average_days": 4.5,
      "performance_level": "High"
    },
    "change_failure_rate": {
      "failure_rate_percentage": 12,
      "performance_level": "Elite"
    },
    "mean_time_to_restore": {
      "average_hours": 1.8,
      "performance_level": "High"
    }
  },
  "overall_performance": {
    "level": "High Performer",
    "score": 3.5
  }
}
```

## Integration

### Export to Spreadsheet

```bash
# Generate CSV
./metrics/track-ai-impact.sh

# Import ai-impact-*.csv into Excel/Google Sheets
```

### Send to Analytics Platform

```bash
# Example: Send to DataDog
curl -X POST "https://api.datadoghq.com/api/v1/series" \
  -H "Content-Type: application/json" \
  -H "DD-API-KEY: ${DATADOG_API_KEY}" \
  -d @metrics/ai-impact-latest.json
```

### Grafana Dashboard

1. Install JSON data source plugin
2. Point to metrics JSON files
3. Create visualizations

## Troubleshooting

### "Permission denied" when running scripts

```bash
chmod +x metrics/track-ai-impact.sh
chmod +x metrics/dora-metrics.sh
```

### "Not a git repository"

Ensure you're running scripts from the repository root:
```bash
cd /path/to/merchant-portal
./metrics/track-ai-impact.sh
```

### No AI metadata found

Ensure commits use the proper format. See:
- [Commit Template](../.gitmessage)
- [AI Impact Framework](../docs/ai-impact-framework.md)

### Metrics seem incorrect

Verify:
1. Commits have AI metadata in messages
2. Date range is correct
3. Git history is complete (`git fetch --all`)

## Best Practices

### Regular Reporting

- **Weekly**: Quick review of key metrics
- **Monthly**: Detailed analysis and team review
- **Quarterly**: Trend analysis and strategic planning

### Data Quality

- Tag all commits consistently
- Use commit template (`.gitmessage`)
- Fill out PR template completely
- Report AI usage honestly

### Continuous Improvement

1. Measure → Analyze → Improve → Validate
2. Compare metrics period-over-period
3. Correlate AI usage with quality/velocity
4. Share learnings with team

## Documentation

- [AI Impact Framework](../docs/ai-impact-framework.md) - Complete tracking guide
- [DORA Metrics Guide](../docs/dora-metrics-guide.md) - DORA metrics explained
- [PR Template](../.github/PULL_REQUEST_TEMPLATE.md) - How to tag PRs
- [Labels Config](../.github/labels.yml) - GitHub labels reference

## Support

Questions or issues with metrics tracking?
- Check documentation above
- Review example commits in git history
- Open an issue with label `metrics`

---

**Happy Tracking!**
