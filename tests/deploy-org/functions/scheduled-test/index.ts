import {scheduledEventHandler} from '@sanity/functions'
import {createClient} from '@sanity/client'

const projectId = process.env.PROJECT_ID
if (!projectId) {
    throw new Error('Missing SANITY_PROJECT_ID environment variable')
}

export const handler = scheduledEventHandler(({context}) => {
    const client = createClient({
        apiVersion: '2025-05-01',
        projectId,
        ...context.clientOptions,
    })

    console.log('Scheduled task executed', {local: context.local})
})