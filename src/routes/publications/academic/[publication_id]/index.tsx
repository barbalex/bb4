import { component$, useResource$, Resource } from '@builder.io/qwik'
import { useLocation, server$ } from '@builder.io/qwik-city'

import * as db from '../../../../db'

// select all publications: id, title, draft
const dataFetcher = server$(async function (id) {
  let res
  try {
    res = await db.query('select content from publication where id = $1', [id])
  } catch (error) {
    console.error('query error', error.stack)
  }

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
        <div class="publications" dangerouslySetInnerHTML={publication}></div>
      )}
    />
  )
})
