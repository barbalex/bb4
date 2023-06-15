import { component$, useResource$, Resource } from '@builder.io/qwik'
import { useLocation, server$ } from '@builder.io/qwik-city'
import { Client } from 'pg'

import { styles } from './styles.css'

// select all articles: id, title, draft
const dataFetcher = server$(async function (id) {
  const isDev = this.env.get('NODE_ENV') === 'development'
  const options = {
    connectionString: isDev
      ? this.env.get('PG_CONNECTIONSTRING_DEV')
      : this.env.get('PG_CONNECTIONSTRING_PROD'),
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
    res = await client.query('select content from article where id = $1', [id])
  } catch (error) {
    console.error('query error', error.stack)
  }
  client.end()

  // console.log('article, dataFetcher, res:', res)
  const content = res?.rows[0]?.content
  if (!content) return null
  const articleDecoded = content?.toString('utf-8')

  return articleDecoded
})

export default component$(() => {
  const location = useLocation()
  const article = useResource$(async ({ track }) => {
    const id = track(() => location.params.article_id)

    return await dataFetcher(id)
  })

  return (
    <Resource
      value={article}
      onPending={() => <div>Loading...</div>}
      onRejected={(reason) => <div>Error: {reason}</div>}
      onResolved={(article) => (
        <div class={styles} dangerouslySetInnerHTML={article}></div>
      )}
    />
  )
})
