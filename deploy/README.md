# Deploy Action

## Description

A GitHub Action that deploys your Sanity Blueprints to a specified Sanity project or organization using
the [@sanity/runtime-cli](https://www.npmjs.com/package/@sanity/runtime-cli).

## Inputs

See the [main documentation](../README.md#inputs) for all available inputs.

## Setup

For initial setup and configuration, see the [main README](../README.md#setup).

## Usage

Add this action to your GitHub Actions workflow file (e.g., `.github/workflows/deploy.yml`):

```yaml
name: Deploy Sanity Blueprints

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v6

      - name: Install dependencies
        run: npm ci  # or pnpm/yarn

      - name: Deploy blueprints
        # x-release-please-start-major
        uses: sanity-io/blueprints-actions/deploy@deploy-v3
        # x-release-please-end
        with:
          sanity-token: ${{ secrets.SANITY_TOKEN }}
          stack-id: ${{ secrets.SANITY_STACK_ID }}
          organization-id: ${{ secrets.SANITY_ORGANIZATION_ID }}
```

**Deprecated** project-level token usage:

```yaml
- name: Deploy blueprints
  # x-release-please-start-major
  uses: sanity-io/blueprints-actions/deploy@deploy-v3
  # x-release-please-end
  with:
    sanity-token: ${{ secrets.SANITY_TOKEN }}
    stack-id: ${{ secrets.SANITY_STACK_ID }}
    project-id: ${{ secrets.SANITY_PROJECT_ID }}
```

If you have your blueprint files in a specific directory, specify the `working-directory` input:

```yaml

- name: Deploy blueprints
  # x-release-please-start-major
  uses: sanity-io/blueprints-actions/deploy@deploy-v3
  # x-release-please-end
  with:
    sanity-token: ${{ secrets.SANITY_TOKEN }}
    stack-id: ${{ secrets.SANITY_STACK_ID }}
    organization-id: ${{ secrets.SANITY_ORGANIZATION_ID }}
    working-directory: './dir/to/blueprint/files'
```

### Outputs

| Output              | Description              |
|---------------------|--------------------------|
| `deployment-status` | Status of the deployment |