import {
  component$,
  useResource$,
  Resource,
  useContext,
} from '@builder.io/qwik'
import { useLocation, server$ } from '@builder.io/qwik-city'

import * as db from '~/db'
import { CTX } from '~/root'
import Editing from './editing'

// select all articles: id, title, draft
const dataFetcher = server$(async function (id) {
  let res
  try {
    res = await db.query('select content from article where id = $1', [id])
  } catch (error) {
    console.error('query error', error.stack)
  }

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
  const store = useContext(CTX)

  return (
    <Resource
      value={article}
      onPending={() => <div>Loading...</div>}
      onRejected={(reason) => <div>Error: {reason}</div>}
      onResolved={(article) => {
        if (store.editing) return <Editing article={article} />

        return <div class="articles" dangerouslySetInnerHTML={article}></div>
      }}
    />
  )
})
