import {
    defineBlueprint,
    defineDocumentFunction,
    defineRobotToken,
    defineRole,
    defineScheduledFunction,
    defineDataset
} from '@sanity/blueprints'

const PROJECT_ID = process.env.PROJECT_ID
if (!PROJECT_ID) throw new Error('Missing PROJECT_ID')

export default defineBlueprint({
    blueprintVersion: '2026-04-30',
    values: {projectId: PROJECT_ID},
    resources: [
        defineRobotToken({
            name: 'org-gha-robot',
            resourceType: 'project',
            resourceId: '$.values.projectId',
            memberships: [{
                resourceType: 'project',
                resourceId: '$.values.projectId',
                roleNames: ['editor']
            }],
        }),
        defineDataset({
            name: 'org-test-dataset',
            datasetName: 'org-test-dataset',
            aclMode: 'public',
            project: '$.values.projectId',
        }),
        defineScheduledFunction({
            name: 'scheduled-test',
            event: {
                expression: '0 0 * * *', // every 24 hours
            },
            robotToken: '$.resources.org-gha-robot'
        }),
        defineDocumentFunction({
            name: 'integration-test-org',
            project: '$.values.projectId',
            robotToken: '$.resources.org-gha-robot',
            event: {
                on: ["create", "update"],
                filter: "_type == 'post'",
                projection: "{title, _id, _type}",
                resource: {
                    type: 'dataset',
                    id: `${PROJECT_ID}.*`
                }
            }
        })
    ],
})
