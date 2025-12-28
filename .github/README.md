# GitHub Repository Configuration

This directory contains GitHub-specific configuration files for the BlackMoss & Herbs platform.

## Contents

### Workflows
- `workflows/ci.yml` - Continuous Integration workflow (lint, type-check, build)
- `workflows/deploy-production.yml` - Production deployment workflow
- `workflows/lint.yml` - Linting workflow
- `workflows/type-check.yml` - Type checking workflow

### Templates
- `ISSUE_TEMPLATE/bug_report.md` - Bug report template
- `ISSUE_TEMPLATE/feature_request.md` - Feature request template
- `PULL_REQUEST_TEMPLATE.md` - Pull request template

## Workflow Details

### CI Workflow
Runs on every push and pull request to main/develop branches:
- Linting (ESLint)
- Type checking (TypeScript)
- Build verification

### Deployment Workflow
Runs on tags and manual triggers:
- Builds Docker images
- Runs security scans (Trivy)
- Deploys to production/staging

### Lint Workflow
Standalone linting workflow for code quality checks.

### Type Check Workflow
Standalone type checking workflow for TypeScript validation.

## Usage

These workflows run automatically on:
- Push to `main` or `develop` branches
- Pull requests targeting `main` or `develop`
- Manual workflow dispatch (where configured)

## Customization

To customize workflows:
1. Edit the respective `.yml` file
2. Commit and push changes
3. Workflows will run automatically on next trigger
