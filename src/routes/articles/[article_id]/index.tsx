import {
  component$,
  useResource$,
  Resource,
  noSerialize,
} from '@builder.io/qwik'
import { useLocation, server$ } from '@builder.io/qwik-city'
import { Client } from 'pg'

import hex2a from '~/utils/hex2a'

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

  return noSerialize(res?.rows[0]?.content)
})

export default component$(() => {
  const location = useLocation()
  const id = location.params.article_id
  console.log('article, id:', id)
  const article = useResource$(async () => await dataFetcher(id))
  // console.log('article:', article)
  // TODO:
  // error due to buffer not being serializable
  // can it only be queried client side?

  return (
    <>
      <div>article id: {id}</div>

      <Resource
        value={article}
        onPending={() => <div>Loading...</div>}
        onRejected={(reason) => <div>Error: {reason}</div>}
        onResolved={(article) => {
          console.log('article resolved:', article)
          // if (!article) return <div>Article not found</div>
          const articleDecoded = hex2a(article)
          console.log('article decoded:', articleDecoded)
          const createMarkup = () => ({ __html: articleDecoded })
          const markup = createMarkup()
          // console.log('article, markup:', markup)

          return <div dangerouslySetInnerHTML={markup}></div>
        }}
      />
    </>
  )
})
