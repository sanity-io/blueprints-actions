import {
    defineBlueprint,
    defineDocumentFunction,
    defineDocumentWebhook,
    defineDataset,
    defineCorsOrigin,
    defineRole,
} from '@sanity/blueprints'

export default defineBlueprint({
    blueprintVersion: '2025-10-31',

    resources: [
        defineDocumentFunction({
            name: 'integration-test',
            event: {
                on: ["create", "update"],
                filter: "_type == 'post'",
                projection: "{title, _id, _type}",
                resource: {
                    type: 'dataset',
                    id: `${process.env.SANITY_PROJECT_ID}.*`
                }
            }
        }),
        defineDocumentWebhook({
            name: 'test-project-based-webhook',
            url: 'https://webhook.site/test-deploy-action',
            on: ['create', 'update'],
            filter: "_type == 'post'",
            projection: '{title, _id}',
            dataset: 'production',
            apiVersion: 'vX',
            project: process.env.SANITY_PROJECT_ID,
            httpMethod: 'POST',
            status: 'enabled',
        }),
        defineDataset({
            name: 'test-project-based-dataset',
            datasetName: 'test-project-based-dataset',
            aclMode: 'public',
            project: process.env.SANITY_PROJECT_ID,
            lifecycle: {
                deletionPolicy: 'allow',
            },
        }),
        defineCorsOrigin({
            name: 'test-project-based-cors',
            origin: 'https://gha-project-based.com',
            allowCredentials: true,
            project: process.env.SANITY_PROJECT_ID,
        }),
        defineRole({
            name: 'custom-project-based-role',
            title: 'Custom Project Role',
            description: 'A role for our tests',
            appliesToUsers: true,
            appliesToRobots: false,
            permissions: [
                {
                    name: 'sanity-all-documents',
                    action: "mode",
                    params: {
                        mode: "publish",
                        history: true
                    }
                },
            ],
        }),
    ],
})
