import { component$, useContext } from '@builder.io/qwik'
import { useLocation, server$, useNavigate } from '@builder.io/qwik-city'

import * as db from '~/db'
import { CTX } from '~/root'
import Editing from './editing'

const draftSetter = server$(async function ({ value, id }) {
  try {
    await db.query('update publication set draft = $1 where id = $2', [
      value,
      id,
    ])
  } catch (error) {
    console.error('query error', error.stack)
  }
  return true
})

export default component$(({ publication }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const store = useContext(CTX)

  return (
    <>
      {!!store.user && (
        <div class="absolute top-0 right-10">
          {publication.value.draft ? (
            <button
              type="button"
              class="rounded-full shadow-sm hover:ring-1 hover:ring-inset hover:ring-gray-300 p-1 text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-800"
              data-title="publish"
              aria-label="publish"
              onClick$={async () => {
                await draftSetter({
                  value: false,
                  id: location.params.publication_id,
                })
                navigate()
                store.publicationsRefetcher++
              }}
            >
              <svg class="block h-6 w-6" fill="red" viewBox="0 0 512 512">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M367.2 412.5L99.5 144.8C77.1 176.1 64 214.5 64 256c0 106 86 192 192 192c41.5 0 79.9-13.1 111.2-35.5zm45.3-45.3C434.9 335.9 448 297.5 448 256c0-106-86-192-192-192c-41.5 0-79.9 13.1-111.2 35.5L412.5 367.2zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"
                />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              class="rounded-full shadow-sm hover:ring-1 hover:ring-inset hover:ring-gray-300 p-1 text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-800"
              data-title="unpublish"
              aria-label="unpublish"
              onClick$={async () => {
                await draftSetter({
                  value: true,
                  id: location.params.publication_id,
                })
                navigate()
                store.publicationsRefetcher++
              }}
            >
              <svg class="block h-6 w-6" fill="green" viewBox="0 0 448 512">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m427.63 91.441c12.5 12.5 23.108 46.41 10.968 59.259l-239.05 253.01c-19.423 20.557-61.405 18.876-79.201-0.99708l-111.05-124.01c-11.793-13.169-4.5234-54.736 7.9766-67.236s48.753-15.491 61.253-2.9912l85.957 92.338 205.98-217.85c17.089-9.7881 45.464-2.6082 57.165 8.4752z"
                />
              </svg>
            </button>
          )}
        </div>
      )}
      {store.editing ? (
        <Editing data={publication} />
      ) : (
        <div
          class="publications"
          dangerouslySetInnerHTML={
            publication.value?.content ?? '(no content has been created yet)'
          }
        />
      )}
    </>
  )
})
