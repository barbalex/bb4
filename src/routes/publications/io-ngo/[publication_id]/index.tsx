import {
  component$,
  useResource$,
  Resource,
  useContext,
  useSignal,
} from '@builder.io/qwik'
import { useLocation, server$ } from '@builder.io/qwik-city'

import * as db from '~/db'
import { CTX } from '~/root'
import Editing from '../../editing'

// select all publications: id, title, draft
const dataFetcher = server$(async function (id) {
  let res
  try {
    res = await db.query(
      'select id, title, category, sort, content from publication where id = $1',
      [id],
    )
  } catch (error) {
    console.error('query error', error.stack)
  }

  // console.log('publication, dataFetcher, res:', res)
  const pub = res?.rows[0]

  return {
    id: pub.id,
    title: pub.title,
    category: pub.category,
    sort: pub.sort,
    content: pub?.content?.toString('utf-8'),
  }
})

export default component$(() => {
  const refetcher = useSignal(0)
  const location = useLocation()
  const data = useResource$(async ({ track }) => {
    const id = track(() => location.params.publication_id)
    track(() => refetcher.value)

    return await dataFetcher(id)
  })
  const store = useContext(CTX)

  return (
    <Resource
      value={data}
      onPending={() => <div>Loading...</div>}
      onRejected={(reason) => {
        console.log('publication, dataFetcher, reason:', reason)
        return <div>Error: {reason}</div>
      }}
      onResolved={(data) => {
        console.log('publication, dataFetcher, data:', data)
        return store.editing ? (
          <Editing
            data={data}
            refetcher={refetcher}
          />
        ) : (
          <div
            class="publications"
            dangerouslySetInnerHTML={
              data?.content ?? '(no content has been created yet)'
            }
          />
        )
      }}
    />
  )
})
