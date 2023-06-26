import {
  component$,
  useResource$,
  Resource,
  Slot,
  useContext,
  useSignal,
} from '@builder.io/qwik'
import { server$, Link, useLocation } from '@builder.io/qwik-city'

import { CTX } from '~/root'
import * as db from '../../db'

// select all articles: id, title, draft
const dataFetcher = server$(async function (isLoggedIn) {
  // include drafts only if user is logged in
  let res
  try {
    res = await db.query(
      `select id, title, draft from article ${
        isLoggedIn ? '' : 'where draft is false'
      } order by datum desc`,
    )
  } catch (error) {
    console.error('query error', error.stack)
  }

  return res?.rows
})
const deleter = server$(async function (id) {
  try {
    await db.query(
      `delete from article
      where id = $1`,
      [id],
    )
  } catch (error) {
    console.error('query error', error.stack)
  }

  return true
})

export default component$(() => {
  const refetcher = useSignal(0)
  const store = useContext(CTX)
  const isLoggedIn = !!store.user

  const articles = useResource$(async ({ track }) => {
    track(() => refetcher.value)
    track(() => store.articlesRefetcher)

    return await dataFetcher(isLoggedIn)
  })
  const location = useLocation()

  return (
    <div class="flex min-h-full flex-col">
      <div class="flex-1 min-[820px]:flex">
        <div class="px-2 py-0 min-[820px]:w-36 lg:w-52 xl:w-64 min-[820px]:shrink-0">
          <nav class="sticky top-16 flex  flex-1 flex-col" aria-label="Sidebar">
            <ul role="list" class="-mx-2 mt-3 mb-3 first:mt-0 border-collapse">
              <li class="bg-[url(../../../oceanDark.jpg)] font-bold flex p-2 pl-3 text-sm text-white leading-6 border-collapse rounded-t-md">
                Articles
              </li>
              <Resource
                value={articles}
                onPending={() => <div>Loading...</div>}
                onRejected={(reason) => <div>Error: {reason}</div>}
                onResolved={(articles) =>
                  articles.map((a) => (
                    <li
                      key={a.id}
                      class="border border-slate-200 last:rounded-b-md"
                    >
                      <Link
                        href={`/articles/${a.id}`}
                        class={`${
                          location.params.article_id === a.id
                            ? 'font-extrabold bg-slate-100'
                            : ''
                        } font-bold flex p-2 pl-3 text-sm text-inherit hover:no-underline leading-6 hover:font-extrabold hover:bg-slate-100`}
                      >
                        {a.title || '(kein Titel)'}
                      </Link>
                    </li>
                  ))
                }
              />
            </ul>
          </nav>
        </div>
        <div class="px-2 pb-2 md:flex-1 relative">
          <div class="absolute top-0 right-0">
            <button
              type="button"
              class="rounded-full shadow-sm hover:ring-1 hover:ring-inset hover:ring-gray-300 p-1 text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-800"
              data-title="delete"
              aria-label="delete"
              onClick$={async () => {
                // TODO: confirm
                await deleter(location.params.article_id)
                refetcher.value++
              }}
            >
              <svg class="block h-6 w-6" fill="red" viewBox="0 0 384 512">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m376.64 126.88c14.953-16.082 4.9818-40.702-9.9708-56.784-14.953-16.082-43.224-29.542-58.177-13.461l-113.5 127.12-110.63-123.01c-14.953-16.082-52.198-8.6035-67.15 7.4781-14.953 16.082-23.428 52.667-8.4752 68.749l116.11 123.01-116.49 124.63c-14.953 16.082-7.973 43.195 6.9796 59.277 14.953 16.082 44.221 26.052 59.174 9.9708l119.98-125.63 112.62 123.01c14.953 16.082 46.215 9.6006 61.168-6.481 14.953-16.082 19.938-46.186 4.9854-62.268l-112.62-125z"
                />
              </svg>
            </button>
          </div>
          <Slot />
        </div>
      </div>
    </div>
  )
})
