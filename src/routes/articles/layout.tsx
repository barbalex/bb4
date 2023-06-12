import { component$, useResource$, Resource, Slot } from '@builder.io/qwik'
import { server$, Link, useLocation } from '@builder.io/qwik-city'
import { Client } from 'pg'

// select all articles: id, title, draft
const dataFetcher = server$(async () => {
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

  // TODO: include drafts only if user is logged in
  // TODO: create client on app start and store in store
  let res
  try {
    res = await client.query(
      'select id, title, draft from article order by datum desc',
    )
  } catch (error) {
    console.error('query error', error.stack)
  }
  client.end()

  return res?.rows
})

export default component$(() => {
  const articles = useResource$(async () => await dataFetcher())
  const location = useLocation()

  return (
    <div class="flex min-h-full flex-col">
      <div class="flex-1 xl:flex">
        <div class="px-2 py-0 xl:w-64 xl:shrink-0">
          <nav class="sticky top-24 flex  flex-1 flex-col" aria-label="Sidebar">
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
                        } font-bold flex p-2 pl-3 text-sm leading-6 hover:font-extrabold hover:bg-slate-100`}
                      >
                        {a.title}
                      </Link>
                    </li>
                  ))
                }
              />
            </ul>
          </nav>
        </div>
        <div class="px-2 py-2 xl:flex-1">
          <Slot />
        </div>
      </div>
    </div>
  )
})
