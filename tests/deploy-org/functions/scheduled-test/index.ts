import {scheduledEventHandler} from '@sanity/functions'
import {createClient} from '@sanity/client'

export const handler = scheduledEventHandler(({context}) => {
    const client = createClient({
        apiVersion: '2025-05-01',
        ...context.clientOptions,
    })

    console.log('Scheduled task executed', {local: context.local})
})