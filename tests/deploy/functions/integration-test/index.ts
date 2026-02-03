import {documentEventHandler} from '@sanity/functions'
import {createClient} from '@sanity/client'
import chalk from 'chalk'

const PAGE_URL_QUERY = `*[_type == "page" && _id == $id] {
  _type,
  _id,
  title,
  slug,
  site,
}`;

export const handler = documentEventHandler(async ({context, event}) => {
    const time = new Date().toLocaleTimeString()
    const client = createClient({apiVersion: '2024-01-01', ...context.clientOptions})
    const data = event.data
    const documents = client.fetch(PAGE_URL_QUERY, {id: data._id})
    console.log(documents)
    console.log(`👋 Your Sanity Function was called at ${time}`)
})