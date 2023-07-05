import { component$ } from '@builder.io/qwik'
import { routeLoader$ } from '@builder.io/qwik-city'

import * as db from '~/db'

// select all publications: id, title, draft
export const usePublication = routeLoader$(async function (requestEvent) {
  const id = requestEvent.params.publication_id
  let res
  try {
    res = await db.query(
      'select id, title, category, sort, content, draft from publication where id = $1',
      [id],
    )
  } catch (error) {
    console.error('query error', error.stack)
  }

  const pub = res?.rows[0]

  return {
    id: pub.id,
    title: pub.title,
    category: pub.category,
    sort: pub.sort,
    draft: pub.draft,
    content: pub?.content?.toString('utf-8'),
  }
})

import Publication from '../../publication'

export default component$(() => {
  const publication = usePublication()

  return <Publication publication={publication} />
})
