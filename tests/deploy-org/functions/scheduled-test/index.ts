import {scheduledEventHandler} from '@sanity/functions'

export const handler = scheduledEventHandler(({context}) => {

    console.log('Scheduled task executed', {local: context.local})
})