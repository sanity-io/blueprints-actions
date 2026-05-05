import {scheduledEventHandler} from '@sanity/functions'

export default scheduledEventHandler(({context}) => {

    console.log('Scheduled task executed', {local: context.local})
})