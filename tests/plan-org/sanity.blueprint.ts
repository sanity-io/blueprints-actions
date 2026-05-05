import {
    defineBlueprint, defineDataset,
    defineDocumentFunction,
    defineRobotToken,
    defineRole,
    defineScheduledFunction
} from '@sanity/blueprints'

const PROJECT_ID = process.env.PROJECT_ID
if (!PROJECT_ID) throw new Error('Missing PROJECT_ID environment variable')

export default defineBlueprint({
    blueprintVersion: '2025-10-31',
    values: {projectId: PROJECT_ID},
    resources: [
        defineRole({
            name: 'gha-plan-org-role',
            title: 'GHA Plan Org Role',
            description: 'A custom role for GitHub Actions integration tests',
            appliesToUsers: true,
            appliesToRobots: true,
            permissions: [{
                name: 'sanity-all-documents',
                action: 'mode',
                params: {mode: 'publish', history: true},
            }],
        }),
        defineRobotToken({
            name: 'org-gha-robot',
            resourceType: 'project',
            resourceId: '$.values.projectId',
            memberships: [{
                resourceType: 'project',
                resourceId: '$.values.projectId',
                roleNames: ['editor']
            }]
        }),
        defineDataset({
            name: 'org-test-dataset',
            datasetName: 'org-test-dataset',
            aclMode: 'public',
            project: '$.values.projectId',
        }),
        defineDocumentFunction({
            name: 'integration-plan-test-function',
            project: '$.values.projectId',
            robotToken: '$.resources.org-gha-robot',
            event: {
                on: ["create", "update"],
                filter: "_type == 'post'",
                projection: "{title, body}",
                resource: {
                    type: 'dataset',
                    id: `${PROJECT_ID}.*`
                }
            }
        }),
        defineScheduledFunction({
            name: 'scheduled-test',
            event: {
                expression: '0 9 * * *',
            },
            robotToken: '$.resources.org-gha-robot'
        })
    ],
})