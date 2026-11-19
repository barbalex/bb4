import { component$ } from '@builder.io/qwik'
import { routeLoader$ } from '@builder.io/qwik-city'

import * as db from '~/db'

// select all articles: id, title, draft
export const useArticle = routeLoader$(async function (requestEvent) {
  const id = requestEvent.params.article_id
  let res
  try {
    res = await db.query(
      'select id, title, datum, draft, content from article where id = $1',
      [id],
    )
  } catch (error) {
    console.error('query error', error.stack)
  }

  const article = res?.rows[0]

  return {
    id: article?.id,
    title: article?.title,
    datum: article?.datum,
    draft: article?.draft,
    content: article?.content?.toString('utf-8'),
  }
})

// static build: one page per published article
export const onStaticGenerate = async () => {
  let res
  try {
    res = await db.query(`select id from article where draft is false`)
  } catch (error) {
    console.error('query error', error.stack)
  }

  return {
    params: (res?.rows ?? []).map((r) => ({ article_id: r.id })),
  }
}

export default component$(() => {
  const article = useArticle()

  return (
    <div
      class="articles"
      dangerouslySetInnerHTML={
        article.value.content ?? '(no content has been created yet)'
      }
    />
  )
})
