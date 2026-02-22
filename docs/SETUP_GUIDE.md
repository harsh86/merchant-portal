# AI Impact & DORA Metrics - Setup Guide

Complete guide to getting started with AI impact tracking and DORA metrics in this repository.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Detailed Setup](#detailed-setup)
3. [Configuration](#configuration)
4. [Usage Guide](#usage-guide)
5. [Team Onboarding](#team-onboarding)
6. [Troubleshooting](#troubleshooting)

---

## Quick Start

### One-Command Setup

```bash
# Run the automated setup script
./setup-ai-tracking.sh
```

This will:
- Configure git commit template
- Make metrics scripts executable
- Optionally sync GitHub labels
- Generate baseline metrics
- Display next steps

### Manual Setup (3 Minutes)

```bash
# 1. Configure commit template
git config commit.template .gitmessage

# 2. Make scripts executable
chmod +x metrics/track-ai-impact.sh
chmod +x metrics/dora-metrics.sh

# 3. Run baseline metrics
./metrics/track-ai-impact.sh
./metrics/dora-metrics.sh

# 4. Review documentation
cat docs/ai-impact-framework.md
```

---

## Detailed Setup

### Step 1: Git Configuration

#### Configure Commit Template

**Repository-specific (recommended):**
```bash
git config commit.template .gitmessage
```

**Global (all repositories):**
```bash
git config --global commit.template /path/to/merchant-portal/.gitmessage
```

**Verify configuration:**
```bash
git config commit.template
# Should output: .gitmessage (or full path if global)
```

#### Test Commit Template

```bash
git commit
# Should open your editor with the template pre-filled
```

### Step 2: GitHub Configuration

#### Apply Labels

**Option 1: Using GitHub CLI**

```bash
# Install GitHub CLI if needed
# macOS: brew install gh
# Other: https://cli.github.com/

# Authenticate
gh auth login

# Navigate to repository
cd /path/to/merchant-portal

# Create labels from configuration
# Note: You'll need to create labels individually or use a script
# See .github/labels.yml for the complete list
```

**Option 2: Manual via GitHub Web**

1. Go to repository on GitHub
2. Navigate to Issues → Labels
3. Create labels from `.github/labels.yml`
   - 53 labels total
   - Categories: AI Impact, DORA, Type, Priority, Quality, Velocity, etc.

#### Verify Templates

**Pull Request Template:**
- Create a new PR
- Should auto-load from `.github/PULL_REQUEST_TEMPLATE.md`

**Issue Templates:**
- Go to Issues → New Issue
- Should see "Bug Report" and "Feature Request" templates

### Step 3: Enable GitHub Actions

#### Verify Workflows

Check that workflows are present:
```bash
ls -la .github/workflows/
# Should show:
# - ai-metrics.yml
# - metrics-dashboard.yml
```

#### Workflow Permissions

Ensure GitHub Actions has permissions:
1. Go to Settings → Actions → General
2. Set "Workflow permissions" to "Read and write permissions"
3. Check "Allow GitHub Actions to create and approve pull requests"

#### Test Workflow

```bash
# Trigger manual workflow run
gh workflow run metrics-dashboard.yml
```

### Step 4: Verify Installation

#### Check Files

```bash
# GitHub Configuration
ls -la .github/
# Should show:
# - ISSUE_TEMPLATE/ (with 2 templates)
# - workflows/ (with 2 workflows)
# - PULL_REQUEST_TEMPLATE.md
# - labels.yml

# Metrics Infrastructure
ls -la metrics/
# Should show:
# - track-ai-impact.sh (executable)
# - dora-metrics.sh (executable)
# - ai-impact-report.md (template)
# - README.md

# Documentation
ls -la docs/
# Should include:
# - ai-impact-framework.md
# - dora-metrics-guide.md
# - SETUP_GUIDE.md (this file)

# Root Configuration
ls -la .gitmessage .gitattributes setup-ai-tracking.sh
```

#### Test Scripts

```bash
# Test AI impact script
./metrics/track-ai-impact.sh 7
# Should output metrics for last 7 days

# Test DORA metrics script
./metrics/dora-metrics.sh 7
# Should output DORA metrics for last 7 days
```

---

## Configuration

### Customize Commit Template

Edit `.gitmessage` to match your team's preferences:

```bash
# Open in editor
code .gitmessage  # or vim, nano, etc.

# Customize fields as needed
# Keep AI Impact and DORA sections for tracking
```

### Customize PR Template

Edit `.github/PULL_REQUEST_TEMPLATE.md`:

```bash
code .github/PULL_REQUEST_TEMPLATE.md

# Add/remove sections based on your workflow
# Keep AI Impact and DORA sections for metrics
```

### Customize Labels

Edit `.github/labels.yml`:

```bash
code .github/labels.yml

# Add custom labels
# Modify colors and descriptions
# Keep AI and DORA labels for tracking
```

### Configure Workflows

#### Metrics Collection Frequency

Edit `.github/workflows/metrics-dashboard.yml`:

```yaml
# Change schedule (default: weekly Monday 9 AM)
on:
  schedule:
    - cron: '0 9 * * 1'  # Modify as needed
```

#### Enable Notifications

Uncomment Slack notification section in `metrics-dashboard.yml`:

```yaml
- name: Send Slack Notification
  if: true  # Change from 'false' to 'true'
  run: |
    # Configure SLACK_WEBHOOK secret in GitHub
```

---

## Usage Guide

### For Developers

#### Making a Commit

```bash
# 1. Stage your changes
git add .

# 2. Commit (template will open)
git commit

# 3. Fill in the template
# - Add commit message
# - Fill AI Impact section (required)
# - Fill DORA Metrics section (required)
# - Save and close editor
```

**Example commit message:**

```
feat(api): add pagination to transactions endpoint

Implemented cursor-based pagination for better performance
with large datasets. Added limit and cursor query parameters.

AI Generated: 60%
Time Saved: 1.5 hours
Tools Used: Claude Code, GitHub Copilot

Type: feature
Deployment: yes
Lead Time Start: 2026-02-20
Priority: P2-major

Closes #45

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

#### Creating a Pull Request

1. **Create PR on GitHub**
2. **Template auto-loads** - fill all sections
3. **Required sections:**
   - Summary
   - AI Impact Assessment (check boxes, fill numbers)
   - Type of Change
   - DORA Metrics
   - Testing Checklist
   - Quality Metrics
4. **Submit PR** - GitHub Actions will auto-apply labels

#### Creating an Issue

1. **Go to Issues → New Issue**
2. **Choose template:**
   - Bug Report (for bugs/incidents)
   - Feature Request (for new features)
3. **Fill all sections** - especially AI and DORA fields
4. **Submit** - manually apply appropriate labels

### For Team Leads

#### Weekly Metrics Review

```bash
# Generate weekly reports
./metrics/track-ai-impact.sh 7
./metrics/dora-metrics.sh 7

# Review JSON/CSV outputs
cat metrics/ai-impact-*.json | jq .
cat metrics/dora-metrics-*.json | jq .

# Or view markdown report
cat metrics/dora-report-*.md
```

#### Monthly Reporting

```bash
# Generate 30-day metrics
./metrics/track-ai-impact.sh 30
./metrics/dora-metrics.sh 30

# Use ai-impact-report.md template for detailed analysis
cp metrics/ai-impact-report.md metrics/monthly-report-2026-02.md

# Fill in template with data from JSON/CSV reports
# Share with stakeholders
```

#### Dashboard Access

```bash
# Open HTML dashboard
open metrics/dashboard.html

# Or if deployed to GitHub Pages
# https://[org].github.io/merchant-portal/metrics/dashboard.html
```

### For DevOps/Admins

#### Monitor GitHub Actions

```bash
# View workflow runs
gh run list --workflow=metrics-dashboard.yml

# View specific run
gh run view <run-id>

# Download artifacts
gh run download <run-id>
```

#### Export Metrics

```bash
# Export to external system
curl -X POST https://your-analytics.com/api/metrics \
  -H "Content-Type: application/json" \
  -d @metrics/ai-impact-latest.json
```

---

## Team Onboarding

### New Team Member Checklist

- [ ] Clone repository
- [ ] Run `./setup-ai-tracking.sh`
- [ ] Read `docs/ai-impact-framework.md`
- [ ] Review example commits with AI tracking
- [ ] Practice creating a commit with template
- [ ] Review PR template
- [ ] Understand DORA metrics (read `docs/dora-metrics-guide.md`)

### Training Session Agenda (30 minutes)

**Part 1: Why Track AI Impact? (5 min)**
- Business value of tracking
- Team benefits
- Quality improvements

**Part 2: How to Track (15 min)**
- Commit template walkthrough
- PR template demo
- Issue template demo
- Label usage

**Part 3: Metrics & Reporting (5 min)**
- How metrics are calculated
- How to run reports
- Dashboard overview

**Part 4: Q&A (5 min)**
- Questions and answers
- Common scenarios

### Training Materials

**Slides:** Create presentation from:
- `docs/ai-impact-framework.md`
- `docs/dora-metrics-guide.md`

**Demo Video:** Record:
1. Making a commit with template
2. Creating a PR with template
3. Running metrics scripts
4. Viewing reports

**Cheat Sheet:** Create quick reference:
- Commit template format
- PR template sections
- Common labels
- Metrics commands

---

## Troubleshooting

### Commit Template Not Working

**Problem:** Template doesn't appear when running `git commit`

**Solutions:**
```bash
# Check configuration
git config commit.template
# Should output path to .gitmessage

# Re-configure if missing
git config commit.template .gitmessage

# Verify file exists
ls -la .gitmessage
```

### Scripts Not Executable

**Problem:** Permission denied when running scripts

**Solution:**
```bash
chmod +x metrics/track-ai-impact.sh
chmod +x metrics/dora-metrics.sh
chmod +x setup-ai-tracking.sh
```

### No Metrics Generated

**Problem:** Scripts run but show no/minimal data

**Possible causes:**

1. **No commits with AI metadata**
   - Solution: Commits need AI tracking fields
   - Check commit messages include "AI Generated:" etc.

2. **Short time period**
   - Solution: Use longer period
   - `./metrics/track-ai-impact.sh 90`

3. **Not in git repository**
   - Solution: Run from repository root
   - `cd /path/to/merchant-portal`

### GitHub Actions Not Running

**Problem:** Workflows don't execute

**Solutions:**

1. **Check workflow files exist**
   ```bash
   ls -la .github/workflows/
   ```

2. **Verify YAML syntax**
   ```bash
   # Use online YAML validator or
   yamllint .github/workflows/ai-metrics.yml
   ```

3. **Check permissions**
   - Settings → Actions → General
   - Enable "Read and write permissions"

4. **View workflow runs**
   ```bash
   gh run list
   ```

### Labels Not Applying

**Problem:** PR labels don't auto-apply

**Solutions:**

1. **Check PR template filled correctly**
   - Use `[x]` not `[X]` or `[ x]`
   - Ensure exact text matches

2. **Check workflow logs**
   ```bash
   gh run view --log
   ```

3. **Manually apply labels**
   - PR → Labels → Select from list

### Dashboard Not Loading

**Problem:** HTML dashboard shows no data

**Solutions:**

1. **Ensure metrics generated**
   ```bash
   ls -la metrics/*.json
   ```

2. **Check JSON format**
   ```bash
   cat metrics/ai-impact-*.json | jq .
   # Should display valid JSON
   ```

3. **Open with web server** (not file://)
   ```bash
   # Option 1: Python
   python3 -m http.server 8000
   # Then open http://localhost:8000/metrics/dashboard.html

   # Option 2: Node.js
   npx http-server
   ```

### Script Date Parsing Issues

**Problem:** Scripts fail on macOS vs Linux date commands

**Solution:**
```bash
# Scripts use both GNU and BSD date formats
# Should work on macOS and Linux
# If issues persist, install GNU date on macOS:
brew install coreutils
# Use gdate instead of date
```

---

## Advanced Configuration

### Custom Metrics Collection

Create custom script in `metrics/`:

```bash
#!/bin/bash
# metrics/custom-metrics.sh

# Your custom metrics logic
# Follow pattern from track-ai-impact.sh
```

### Integration with External Tools

#### DataDog Integration

```bash
# Add to metrics-dashboard.yml workflow
- name: Send to DataDog
  run: |
    curl -X POST "https://api.datadoghq.com/api/v1/series" \
      -H "DD-API-KEY: ${{ secrets.DATADOG_API_KEY }}" \
      -d @metrics/ai-impact-latest.json
```

#### Grafana Dashboard

1. Install JSON data source plugin
2. Configure to read from metrics/ directory
3. Create visualizations
4. Import dashboard template (create your own)

#### JIRA Integration

Add JIRA issue keys to commits/PRs:
```
feat: implement feature

AI Generated: 50%
...

JIRA: PROJ-123
```

Track in JIRA custom fields.

---

## Support & Resources

### Documentation

- [AI Impact Framework](./ai-impact-framework.md) - Complete tracking guide
- [DORA Metrics Guide](./dora-metrics-guide.md) - DORA metrics explained
- [Metrics README](../metrics/README.md) - Scripts documentation

### Getting Help

1. Check documentation above
2. Review example commits in repository
3. Open issue with `metrics` label
4. Ask in team chat/Slack

### Contributing

Improvements to metrics infrastructure:
1. Propose changes via PR
2. Update documentation
3. Test thoroughly
4. Share learnings with team

---

**Setup complete? Start tracking AI impact today!**
