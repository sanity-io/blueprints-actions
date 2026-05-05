# Sanity Blueprints Actions

A suite of GitHub Actions for interacting with [Sanity Blueprints](https://www.sanity.io/docs/compute-and-ai/blueprints)
using the [@sanity/runtime-cli](https://www.npmjs.com/package/@sanity/runtime-cli).

## Overview

This action automates working with your Sanity Blueprints by executing a set of `blueprints` commands with your
specified configuration.

**Currently supported commands:**

- [blueprints-actions/deploy](deploy/README.md): Deploy your blueprints to a Sanity project or organization.
- [blueprints-actions/plan](plan/README.md): Shows changes that would be applied on your next deploy.

### Prerequisites

Before using these actions, you must:

1. **Initialize a Blueprint** in your Sanity project:
   ```bash
   npx @sanity/runtime-cli blueprints init
   ```

2. **Create and map your Function** according to
   the [Blueprints documentation](https://www.sanity.io/docs/compute-and-ai/blueprints)

3. **Obtain your Blueprint configuration** (see [Getting Configuration Values](#getting-configuration-values) below)

## Configuration

### Inputs

| Parameter           | Required     | Description                                                                                                          |
|---------------------|--------------|----------------------------------------------------------------------------------------------------------------------|
| `sanity-token`      | **Yes**      | **See Token Permissions below**                                                                                      |
| `stack-id`          | **Yes**      | Blueprint stack ID (e.g., `ST_1234xyz`)                                                                              |
| `project-id`        | Conditional* | Sanity project ID                                                                                                    |
| `organization-id`   | Conditional* | Sanity organization ID                                                                                               |
| `working-directory` | No           | Path to the directory containing your blueprint files (sanity.blueprint.ts, functions/). Defaults to repository root |

### Token Permissions:

| Scope        | Permission            | Capabilities                                                                        | Required input    |
|--------------|-----------------------|-------------------------------------------------------------------------------------|-------------------|
| Organization | `Blueprints Deployer` | All resource types                                                                  | `organization-id` |
| Project      | `Blueprints Deployer` | Project-scoped resources only (document functions, webhooks, datasets, CORS, roles) | `project-id`      |

*Either `project-id` **or** `organization-id` must be provided.

*Deprecated permissions: Tokens with `deployStudio` permissions are still valid. Organization level resources will
require the `Blueprints Deployer` organization level token. All new tokens should use the `Blueprints Deployer` token.

*If you have your blueprint files in a specific directory, specify the `working-directory`*

## Setup

### 1. Create a Sanity API Token

#### Option A (recommended): Using the CLI

Run this in your Sanity project directory

```shell
npx sanity blueprints mint-deploy-token
```

The command will create a robot token with the correct permissions and prompt you to copy it. For non-interactive use:

```shell
npx sanity blueprints mint-deploy-token --print
```

#### Option B: Using the Sanity Management UI

1. Navigate to [manage.sanity.io](https://manage.sanity.io)
2. Select your project or organization
3. Create a token with the permission matching your deployment scope:
    - **Project token**: Navigate to project -> API -> Tokens -> select `Blueprints Deployer` permission
    - **Organization token**: Navigate to organization -> API -> Tokens -> select `Blueprints Deployer` permission
4. Copy the token (you won't be able to see it again)

### 2. Add Token to GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `SANITY_TOKEN`
5. Value: Paste your Sanity API token
6. Click **Add secret**

### 3. Getting Configuration Values

#### Option 1: Using the CLI

Run this command in your Sanity project directory:

```bash
npx @sanity/runtime-cli blueprints config
```

Output:

```
Current configuration:
  Sanity Project: <project_id>
  Deployment ID:  <stack_id>
```

#### Option 2: From Configuration File

Check `.sanity/blueprint.config.json` in your project root:

```json
{
  "projectId": "<project_id>",
  "organizationId": "<organization_id>",
  "blueprintConfigVersion": "...",
  "updatedAt": "..."
}
```

Use these values in your workflow configuration.

## Resources

- [Sanity Blueprints Documentation](https://www.sanity.io/docs/compute-and-ai/blueprints)
- [@sanity/runtime-cli on npm](https://www.npmjs.com/package/@sanity/runtime-cli)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## Support

For issues and questions:

- Check the [Sanity documentation](https://www.sanity.io/docs)
- Visit the [Sanity community](https://www.sanity.io/community)
- Open an issue in this repository

## Contributing

### Tests

See [testing](docs/testing.md) for details.

## License

MIT License. See [LICENSE](LICENSE) for details.
