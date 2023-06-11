import { component$, useResource$, Resource } from '@builder.io/qwik'
import { useLocation, server$ } from '@builder.io/qwik-city'
import { Client } from 'pg'

import { styles } from './styles.css'

// select all publications: id, title, draft
const dataFetcher = server$(async (id) => {
  const isDev = process.env.NODE_ENV === 'development'
  const options = {
    connectionString: isDev
      ? process.env.PG_CONNECTIONSTRING_DEV
      : process.env.PG_CONNECTIONSTRING_PROD,
  }
  const client = new Client(options)
  try {
    await client.connect()
  } catch (error) {
    console.error('connection error', error.stack)
  }

  // TODO: create client on app start and store in store
  let res
  try {
    res = await client.query('select content from publication where id = $1', [
      id,
    ])
  } catch (error) {
    console.error('query error', error.stack)
  }
  client.end()

  // console.log('publication, dataFetcher, res:', res)
  const content = res?.rows[0]?.content
  if (!content) return null
  const publicationDecoded = content?.toString('utf-8')

  return publicationDecoded
})

export default component$(() => {
  const location = useLocation()
  const publication = useResource$(async ({ track }) => {
    const id = track(() => location.params.publication_id)

    return await dataFetcher(id)
  })

  return (
    <Resource
      value={publication}
      onPending={() => <div>Loading...</div>}
      onRejected={(reason) => <div>Error: {reason}</div>}
      onResolved={(publication) => (
        <div class={styles} dangerouslySetInnerHTML={publication}></div>
      )}
    />
  )
})
