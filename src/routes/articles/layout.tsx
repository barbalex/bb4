import { component$, Slot } from '@builder.io/qwik'
import { routeLoader$, Link, useLocation } from '@builder.io/qwik-city'

import * as db from '../../db'

// select all published articles: id, title
export const useArticles = routeLoader$(async function () {
  let res
  try {
    res = await db.query(
      `select id, title from article where draft is false order by datum desc`,
    )
  } catch (error) {
    console.error('query error', error.stack)
  }

  return res?.rows ?? []
})

export default component$(() => {
  const location = useLocation()
  const articles = useArticles()

  return (
    <div class="flex min-h-full flex-col">
      <div class="flex-1 min-[820px]:flex">
        <div class="px-2 py-0 min-[820px]:w-36 lg:w-52 xl:w-64 min-[820px]:shrink-0">
          <nav class="sticky top-16 flex  flex-1 flex-col" aria-label="Sidebar">
            <ul
              role="list"
              class="-mx-2 mt-3 mb-3 first:mt-0 border-collapse draft-parent"
            >
              <li class="bg-[url('/oceanDark_4.webp')] font-bold  flex p-2 pl-3 text-sm text-white text-shadowed leading-6 border-collapse rounded-t-md">
                Articles
              </li>
              {articles.value.map((a) => (
                <li
                  key={a.id}
                  class="border border-slate-200 last:rounded-b-md dark:border-gray-700"
                >
                  <Link
                    href={`/articles/${a.id}`}
                    class={`${
                      location.params.article_id === a.id
                        ? 'font-extrabold content-item-selected'
                        : ''
                    } font-bold flex p-2 pl-3 text-sm text-inherit hover:no-underline leading-6 hover:font-extrabold content-item-hovered dark:text-gray-200`}
                  >
                    {a.title || '(kein Titel)'}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div class="px-2 pb-2 md:flex-1 relative">
          <Slot />
        </div>
      </div>
    </div>
  )
})
