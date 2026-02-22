# AI Impact Tracking Framework

## Table of Contents

1. [Overview](#overview)
2. [Why Track AI Impact](#why-track-ai-impact)
3. [Metrics Definitions](#metrics-definitions)
4. [How to Tag Commits](#how-to-tag-commits)
5. [How to Tag Pull Requests](#how-to-tag-pull-requests)
6. [How to Tag Issues](#how-to-tag-issues)
7. [Interpreting the Metrics](#interpreting-the-metrics)
8. [Dashboard Setup](#dashboard-setup)
9. [Integration with Issue Trackers](#integration-with-issue-trackers)
10. [Examples](#examples)
11. [Best Practices](#best-practices)
12. [FAQs](#faqs)

---

## Overview

This framework enables systematic tracking of AI's impact on our software development lifecycle (SDLC). By measuring AI contributions alongside traditional metrics, we can:

- Quantify productivity gains from AI tools
- Identify where AI provides the most value
- Make data-driven decisions about AI adoption
- Demonstrate ROI of AI investments
- Optimize our development workflows

---

## Why Track AI Impact

### Business Value

1. **ROI Measurement**: Demonstrate the return on investment in AI tools
2. **Resource Planning**: Understand where AI reduces human effort
3. **Skill Development**: Identify areas where team needs training vs. AI assistance
4. **Tool Selection**: Compare effectiveness of different AI tools

### Team Value

1. **Velocity Insights**: See how AI accelerates delivery
2. **Quality Improvements**: Track if AI-assisted code has fewer bugs
3. **Learning**: Understand which tasks benefit most from AI
4. **Recognition**: Properly credit both human and AI contributions

### Technical Value

1. **Code Quality**: Correlate AI usage with code quality metrics
2. **Test Coverage**: Track if AI improves testing practices
3. **Documentation**: Measure AI's impact on documentation completeness
4. **Debt Reduction**: Understand if AI helps reduce technical debt

---

## Metrics Definitions

### Velocity Metrics

#### 1. Commits per Day
**Definition:** Number of commits made per day, segmented by AI contribution level.

**Why it matters:** Higher commit frequency can indicate faster iteration cycles.

**Formula:**
```
Commits per Day = Total Commits / Number of Days
```

#### 2. Lines Changed per Commit
**Definition:** Average number of lines added/deleted per commit.

**Why it matters:** AI-assisted commits may have more lines changed if AI generates more complete solutions.

**Formula:**
```
Avg Lines per Commit = (Total Additions + Total Deletions) / Total Commits
```

#### 3. Time Saved (Self-Reported)
**Definition:** Developer-estimated time saved using AI tools.

**Why it matters:** Direct measure of productivity gain.

**Formula:**
```
Total Time Saved = Sum of all "Time Saved" fields in commit messages
```

#### 4. AI Contribution Percentage
**Definition:** Percentage of code written with AI assistance.

**Why it matters:** Shows adoption rate and dependency on AI.

**Formula:**
```
AI Contribution % = (AI-Assisted Commits / Total Commits) × 100
```

### Quality Metrics

#### 1. Defect Density
**Definition:** Bugs per 1000 lines of code, segmented by AI contribution.

**Why it matters:** Indicates if AI-generated code has different quality characteristics.

**Formula:**
```
Defect Density = (Number of Bugs / Total Lines of Code) × 1000
```

#### 2. Test Coverage Delta
**Definition:** Change in test coverage for AI-assisted vs. human-only code.

**Why it matters:** Shows if AI improves testing practices.

**Measurement:** Compare coverage % before and after AI-assisted changes.

#### 3. Code Review Cycles
**Definition:** Number of review iterations before merge.

**Why it matters:** Fewer cycles may indicate higher quality initial submissions.

**Measurement:** Count PR review iterations before approval.

#### 4. Time to Fix (Bug Lifetime)
**Definition:** Time from bug report to fix deployment.

**Why it matters:** AI may accelerate debugging and fixing.

**Formula:**
```
Time to Fix = Fix Deployment Time - Bug Report Time
```

---

## How to Tag Commits

### Configure Git Commit Template

```bash
# Set commit template globally
git config --global commit.template .gitmessage

# Or per repository
git config commit.template .gitmessage
```

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

AI Generated: [0-100%] or [X/Y lines]
Time Saved: [X hours/minutes]
Tools Used: [Claude Code, GitHub Copilot, etc.]

Type: [feature|bugfix|hotfix|refactor|docs|test]
Deployment: [yes|no]
Lead Time Start: [YYYY-MM-DD or #issue]
Priority: [P1-critical|P2-major|P3-minor]

Closes #123

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

### Required Fields

1. **AI Generated**: Percentage (0-100%) or fraction (e.g., "150/200 lines")
2. **Time Saved**: Estimated time saved (e.g., "2 hours", "30 minutes")
3. **Tools Used**: List of AI tools (e.g., "Claude Code, GitHub Copilot")

### Optional Fields

- **Type**: Categorize the change
- **Deployment**: Whether this triggers a deployment
- **Lead Time Start**: For DORA metrics tracking
- **Priority**: For urgency tracking

---

## How to Tag Pull Requests

### Using the PR Template

When creating a PR, the template (`.github/PULL_REQUEST_TEMPLATE.md`) will guide you through:

#### 1. AI Impact Assessment

Check the appropriate AI contribution level:
- [ ] 100% AI-Generated
- [ ] 75%+ AI-Generated
- [ ] 50%+ AI-Generated
- [ ] 25%+ AI-Generated
- [ ] AI-Assisted
- [ ] Human-Only

Fill in:
- Lines changed (AI-generated / total)
- Estimated time saved
- AI tools used
- Which tasks AI helped with

#### 2. Type of Change

Check all that apply:
- [ ] Feature
- [ ] Bug Fix
- [ ] Refactor
- [ ] Documentation
- [ ] Tests
- [ ] Infrastructure
- [ ] Security Fix

#### 3. DORA Metrics

- Indicate if this triggers deployment
- Link to related issue (#)
- Specify lead time information
- Set priority level
- Indicate complexity/velocity

#### 4. Quality Metrics

- Test coverage impact
- Linting/type checking status
- Quality labels (tech debt, security, performance)

### Labels Applied Automatically

The GitHub Actions workflow (`ai-metrics.yml`) will automatically apply labels based on your PR description:

- `ai:100-generated`, `ai:75-generated`, etc.
- `type:feature`, `type:bugfix`, etc.
- `dora:deployment`, `dora:hotfix`, etc.
- `P1:critical`, `P2:major`, `P3:minor`
- `velocity:quick-win`, `velocity:medium`, etc.

---

## How to Tag Issues

### Bug Reports

Use `.github/ISSUE_TEMPLATE/bug_report.md`:

1. **Severity**: P1 (Critical), P2 (Major), P3 (Minor)
2. **Incident Classification**: Is this a production incident?
3. **DORA Metrics**: Track incident timeline
4. **AI Assistance**: Will AI help with the fix?

### Feature Requests

Use `.github/ISSUE_TEMPLATE/feature_request.md`:

1. **AI Assistance Planning**: Expected AI contribution level
2. **Effort Estimation**: With and without AI
3. **Lead Time Tracking**: Timeline fields
4. **Quality Metrics**: Expected impact on code quality

---

## Interpreting the Metrics

### Running the Scripts

```bash
# AI Impact Metrics (last 30 days)
./metrics/track-ai-impact.sh

# DORA Metrics (last 30 days)
./metrics/dora-metrics.sh

# Custom time period (60 days)
./metrics/track-ai-impact.sh 60
./metrics/dora-metrics.sh 60
```

### Understanding the Output

#### AI Impact Report

**Summary Section:**
- **Total Commits**: Overall activity level
- **AI-Assisted Commits**: Number and percentage using AI
- **Average AI %**: How much of AI-assisted work is AI-generated
- **Total Time Saved**: Cumulative time savings

**AI Distribution:**
- Shows breakdown of AI contribution levels (75-100%, 50-75%, etc.)
- Higher percentages may indicate:
  - Boilerplate/scaffolding work (good use case)
  - Complex algorithms (review carefully)
  - Documentation (excellent use case)

**Tools Usage:**
- Which AI tools are most used
- Consider standardizing on most effective tools

**Velocity:**
- Commits per day should increase with AI
- Compare to baseline before AI adoption

#### DORA Metrics Report

See [dora-metrics-guide.md](./dora-metrics-guide.md) for detailed interpretation.

### Red Flags to Watch For

1. **Very High AI Percentage (>80%) + Low Test Coverage**
   - AI generated code without proper testing
   - **Action**: Require test coverage for AI-generated code

2. **High Time Saved Claims + High Bug Rate**
   - AI may be generating buggy code quickly
   - **Action**: Review AI-generated code more carefully

3. **Low AI Usage + Low Velocity**
   - Team may not be adopting AI tools
   - **Action**: Provide training and support

4. **Inconsistent Tagging**
   - Some developers not tracking AI usage
   - **Action**: Reinforce tagging requirements

### Success Indicators

1. **Increasing AI % + Stable Quality**
   - Team effectively leveraging AI
   - No quality degradation

2. **Higher Deployment Frequency + Lower Lead Time**
   - AI accelerating delivery
   - DORA metrics improving

3. **Time Saved Correlation with Velocity**
   - Self-reported savings match actual output
   - Developers accurately estimating AI impact

4. **AI Higher on Boilerplate, Lower on Complex Logic**
   - AI used appropriately for right tasks

---

## Dashboard Setup

### Option 1: GitHub Pages Dashboard

The `metrics-dashboard.yml` workflow can publish metrics to GitHub Pages:

```yaml
# In .github/workflows/metrics-dashboard.yml
# Automatically generates static HTML dashboard
```

**Access:** `https://[your-org].github.io/[repo]/metrics/`

### Option 2: External Dashboard Tools

#### Grafana + JSON Data Source

1. Install JSON data source plugin
2. Point to metrics JSON files
3. Create dashboards with:
   - AI contribution trends over time
   - DORA metrics visualization
   - Tool usage comparison
   - Velocity trends

#### DataDog / New Relic

Send metrics from GitHub Actions to your monitoring platform:

```yaml
# In ai-metrics.yml workflow
- name: Send to DataDog
  run: |
    curl -X POST "https://api.datadoghq.com/api/v1/series" \
      -H "Content-Type: application/json" \
      -H "DD-API-KEY: ${{ secrets.DATADOG_API_KEY }}" \
      -d @metrics/ai-impact-latest.json
```

#### Google Sheets / Excel

1. Export CSV files from metrics scripts
2. Import into spreadsheet
3. Create pivot tables and charts
4. Share with stakeholders

### Option 3: Custom Dashboard

Build a simple web dashboard:

```javascript
// Fetch metrics JSON
fetch('metrics/ai-impact-latest.json')
  .then(res => res.json())
  .then(data => {
    // Render charts with Chart.js, D3.js, etc.
    createAITrendChart(data);
    createToolsUsageChart(data);
  });
```

---

## Integration with Issue Trackers

### JIRA Integration

Link GitHub issues to JIRA:

```markdown
<!-- In PR description -->
Closes #123
JIRA: PROJ-456
```

Track AI impact in JIRA custom fields:
- AI Contribution %
- Time Saved
- Tools Used

### Linear Integration

Use Linear's GitHub integration:
- Auto-link PRs to Linear issues
- Sync labels and status
- Track lead time automatically

### Azure DevOps Integration

Link commits to work items:

```bash
git commit -m "fix(auth): resolve login issue

AI Generated: 40%
Time Saved: 1 hour
Tools Used: Claude Code

Fixes AB#12345"
```

### Custom Integration

Use GitHub webhooks to send data to your system:

```javascript
// Webhook handler
app.post('/github-webhook', (req, res) => {
  if (req.body.action === 'closed' && req.body.pull_request.merged) {
    const pr = req.body.pull_request;
    // Extract AI metrics from PR body
    // Send to your tracking system
  }
});
```

---

## Examples

### Example 1: 100% AI-Generated Feature

**Scenario:** AI generates complete CRUD API endpoints.

**Commit Message:**
```
feat(api): add merchant CRUD endpoints

Generated complete REST API for merchant management including:
- GET /api/merchants (list with pagination)
- GET /api/merchants/:id (get by ID)
- POST /api/merchants (create)
- PUT /api/merchants/:id (update)
- DELETE /api/merchants/:id (delete)

All endpoints include input validation, error handling, and tests.

AI Generated: 95%
Time Saved: 3 hours
Tools Used: Claude Code

Type: feature
Deployment: yes
Lead Time Start: 2026-02-18
Priority: P2-major

Closes #67

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

**PR Labels:** `ai:100-generated`, `type:feature`, `dora:deployment`, `velocity:medium`

---

### Example 2: AI-Assisted Bug Fix

**Scenario:** Developer identifies bug, AI helps write fix.

**Commit Message:**
```
fix(auth): prevent token refresh race condition

Fixed race condition where concurrent requests could cause token
refresh to fail, resulting in user being logged out unexpectedly.

Root cause: Multiple components requesting refresh simultaneously.
Solution: Implemented mutex lock on refresh operation.

AI Generated: 30%
Time Saved: 45 minutes
Tools Used: Claude Code (debugging), GitHub Copilot (code completion)

Type: bugfix
Deployment: yes
Lead Time Start: #89
Priority: P1-critical

Closes #89

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

**PR Labels:** `ai:25-generated`, `type:bugfix`, `P1:critical`, `dora:deployment`

---

### Example 3: Human-Only Complex Refactor

**Scenario:** Senior developer refactors critical authentication logic.

**Commit Message:**
```
refactor(auth): redesign authentication flow

Completely redesigned authentication flow to support multiple
auth providers (OAuth, SAML, magic link). Maintains backward
compatibility with existing session management.

This required deep understanding of security implications and
careful migration strategy, which AI cannot properly assess.

AI Generated: 0%
Time Saved: 0
Tools Used: None

Type: refactor
Deployment: yes
Lead Time Start: 2026-02-10
Priority: P2-major

Closes #54
```

**PR Labels:** `human-only`, `type:refactor`, `velocity:complex`

---

### Example 4: AI-Assisted Documentation

**Scenario:** AI generates documentation from code.

**Commit Message:**
```
docs(api): add comprehensive API documentation

Generated complete API documentation including:
- Endpoint descriptions
- Request/response examples
- Error codes and handling
- Authentication requirements
- Rate limiting details

Manually reviewed and enhanced with architectural context.

AI Generated: 85%
Time Saved: 4 hours
Tools Used: Claude Code

Type: docs
Deployment: no
Lead Time Start: 2026-02-19
Priority: P3-minor

Closes #72

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

**PR Labels:** `ai:75-generated`, `type:docs`, `velocity:quick-win`

---

## Best Practices

### Do's

✅ **Be Honest**: Report AI usage accurately
✅ **Review AI Code**: Always review and test AI-generated code
✅ **Tag Consistently**: Use the same format for all commits
✅ **Track Time**: Note actual time saved, not theoretical maximum
✅ **Use Templates**: Fill out PR and issue templates completely
✅ **Credit AI**: Use Co-Authored-By for AI contributions
✅ **Update Regularly**: Run metrics scripts regularly (weekly/monthly)

### Don'ts

❌ **Don't Inflate Numbers**: Don't exaggerate AI contribution or time saved
❌ **Don't Skip Review**: Don't merge AI code without human review
❌ **Don't Ignore Quality**: High AI % doesn't excuse low quality
❌ **Don't Forget Tests**: AI-generated code needs tests too
❌ **Don't Auto-Commit**: Always review before committing AI output
❌ **Don't Compare Unfairly**: Different tasks have different AI suitability

### When to Use AI

**Great Use Cases:**
- Boilerplate code generation
- Test case generation
- Documentation writing
- Code formatting and style fixes
- Routine CRUD operations
- Data transformation scripts
- Configuration files
- Migration scripts

**Use With Caution:**
- Security-critical code
- Authentication/authorization logic
- Complex business logic
- Performance-critical sections
- Data validation rules
- Error handling strategies

**Avoid AI For:**
- Architecture decisions
- Security design
- Privacy compliance
- Critical algorithm selection
- Production incident response (human judgment needed)

---

## FAQs

### Q: What if I forget to tag a commit?

**A:** You can amend the commit message if it hasn't been pushed:

```bash
git commit --amend
# Edit message to add AI metadata
git push --force-with-lease
```

For pushed commits, add a note in the PR description.

### Q: How do I measure AI percentage for code review?

**A:** If AI suggests changes during code review:
- If you accept AI suggestions as-is: Count as AI-generated
- If you modify AI suggestions: Count as AI-assisted (estimate %)
- If you reject AI suggestions: Don't count

### Q: Should I track AI for commit messages?

**A:** Yes! If AI helps write commit messages, note it:

```
AI Generated: 20% (AI wrote commit message, human wrote code)
```

### Q: What if multiple developers work on one change?

**A:** Use `Co-Authored-By` for all contributors (human and AI):

```
Co-Authored-By: Jane Doe <jane@example.com>
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

Track AI % based on total contribution.

### Q: How to handle pair programming with AI?

**A:** Treat it like traditional pair programming:
- If AI writes and human reviews/edits: 50-70% AI
- If human writes and AI suggests improvements: 20-40% AI
- Report actual collaboration level

### Q: Should we track failed AI attempts?

**A:** Yes! Track time spent on AI attempts that didn't work:

```
AI Generated: 10%
Time Saved: -30 minutes (AI attempt failed, rewrote manually)
Tools Used: [Tool Name] (unsuccessful)
```

This helps identify where AI doesn't work well.

### Q: How often should we run metrics?

**A:**
- **Daily**: Automated GitHub Actions (lightweight)
- **Weekly**: Team review of metrics
- **Monthly**: Detailed analysis and reporting
- **Quarterly**: Trend analysis and ROI calculation

### Q: What's a good AI contribution target?

**A:** There's no universal target. Consider:
- **30-50%** is reasonable for most teams starting with AI
- **60-70%** indicates strong AI adoption
- **>80%** may indicate over-reliance (review quality carefully)
- Focus on **value delivered**, not just AI %

### Q: How do I share metrics with stakeholders?

**A:**
1. Generate markdown reports: `./metrics/dora-metrics.sh`
2. Export to CSV for spreadsheets
3. Create visualizations in dashboard
4. Include in sprint reviews/retrospectives
5. Add to quarterly business reviews

---

## Next Steps

1. **Configure Git**: Set up commit template
   ```bash
   git config commit.template .gitmessage
   ```

2. **Apply Labels**: Import GitHub labels
   ```bash
   gh label sync -f .github/labels.yml
   ```

3. **Run Baseline**: Get current metrics
   ```bash
   ./metrics/track-ai-impact.sh
   ./metrics/dora-metrics.sh
   ```

4. **Team Training**: Review this guide with team

5. **Start Tracking**: Begin using templates for all commits/PRs

6. **Review Weekly**: Check metrics in team meetings

7. **Iterate**: Refine process based on learnings

---

## Resources

- [DORA Metrics Guide](./dora-metrics-guide.md)
- [GitHub Labels Configuration](../.github/labels.yml)
- [PR Template](../.github/PULL_REQUEST_TEMPLATE.md)
- [Commit Message Template](../.gitmessage)
- [AI Metrics Script](../metrics/track-ai-impact.sh)
- [DORA Metrics Script](../metrics/dora-metrics.sh)

---

**Questions or Suggestions?**

Open an issue or reach out to the development team.
