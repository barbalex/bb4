import { component$, useResource$, Resource } from '@builder.io/qwik'
import { useLocation, server$ } from '@builder.io/qwik-city'
import { Client } from 'pg'

// select all articles: id, title, draft
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
    res = await client.query('select content from article where id = $1', [id])
  } catch (error) {
    console.error('query error', error.stack)
  }
  client.end()

  console.log('article, dataFetcher, res:', res)

  return res?.rows[0]
})

export default component$(() => {
  const location = useLocation()
  const id = location.params.article_id
  console.log('article, id:', id)
  const article = useResource$(async () => await dataFetcher(id))
  console.log('article', article)

  return (
    <>
      <div>article id: {id}</div>

      <Resource
        value={article}
        onPending={() => <div>Loading...</div>}
        onRejected={(reason) => <div>Error: {reason}</div>}
        onResolved={(article) => {
          console.log('article', article)
          return JSON.stringify(article, null, 2)
        }}
      />
    </>
  )
})
