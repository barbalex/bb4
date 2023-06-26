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
    res = await db.query(
      'select id, draft, content from article where id = $1',
      [id],
    )
  } catch (error) {
    console.error('query error', error.stack)
  }

  // console.log('article, dataFetcher, res:', res)
  const article = res?.rows[0]

  return {
    id: article?.id,
    draft: article?.draft,
    content: article?.content?.toString('utf-8'),
  }
})

const draftSetter = server$(async function ({ value, id }) {
  try {
    await db.query('update article set draft = $1 where id = $2', [value, id])
  } catch (error) {
    console.error('query error', error.stack)
  }
})

export default component$(() => {
  const location = useLocation()
  const data = useResource$(async ({ track }) => {
    const id = track(() => location.params.article_id)

    return await dataFetcher(id)
  })
  const store = useContext(CTX)

  return (
    <Resource
      value={data}
      onPending={() => <div>Loading...</div>}
      onRejected={(reason) => <div>Error: {reason}</div>}
      onResolved={(data) => {
        console.log('article, onResolved, data:', data)
        if (store.editing) return <Editing article={data.content} />

        return (
          <>
            <div class="absolute top-0 right-0">
              <button
                type="button"
                class="rounded-full shadow-sm hover:ring-1 hover:ring-inset hover:ring-gray-300 p-1 text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-800"
                data-title="unpublish_or_publish"
                aria-label="unpublish_or_publish"
                onClick$={() => {
                  draftSetter({
                    value: !data.draft,
                    id: location.params.article_id,
                  })
                }}
              >
                <svg
                  class="block h-6 w-6"
                  fill={data.draft ? 'red' : 'green'}
                  viewBox={data.draft ? '0 0 512 512' : '0 0 448 512'}
                >
                  {data.draft ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M367.2 412.5L99.5 144.8C77.1 176.1 64 214.5 64 256c0 106 86 192 192 192c41.5 0 79.9-13.1 111.2-35.5zm45.3-45.3C434.9 335.9 448 297.5 448 256c0-106-86-192-192-192c-41.5 0-79.9 13.1-111.2 35.5L412.5 367.2zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m427.63 91.441c12.5 12.5 23.108 46.41 10.968 59.259l-239.05 253.01c-19.423 20.557-61.405 18.876-79.201-0.99708l-111.05-124.01c-11.793-13.169-4.5234-54.736 7.9766-67.236s48.753-15.491 61.253-2.9912l85.957 92.338 205.98-217.85c17.089-9.7881 45.464-2.6082 57.165 8.4752z"
                    />
                  )}
                </svg>
              </button>
            </div>
            <div class="articles" dangerouslySetInnerHTML={data.content}></div>
          </>
        )
      }}
    />
  )
})
