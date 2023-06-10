import { component$, useResource$, Resource } from '@builder.io/qwik'
import { server$, Link, useLocation } from '@builder.io/qwik-city'
import { Client } from 'pg'
import styles from './articles.module.css'

// TODO:
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
        <div class="border-b border-gray-200 px-4 py-6 sm:px-6 lg:pl-8 xl:w-64 xl:shrink-0 xl:border-b-0 xl:border-r xl:pl-6">
          <nav
            class={[styles.scrollspy, 'flex', 'flex-1', 'flex-col']}
            aria-label="Sidebar"
          >
            <ul role="list" class="-mx-2 space-y-1">
              <Resource
                value={articles}
                onPending={() => <div>Loading...</div>}
                onRejected={(reason) => <div>Error: {reason}</div>}
                onResolved={(articles) =>
                  articles.map((a) => (
                    <li key={a.id}>
                      <Link
                        href={`/articles/${a.id}`}
                        // TODO: apply bg-gray-50 only if current article
                        class={`bg-gray-50 ${location.url.pathname === '/articles/'} text-indigo-600 group flex gap-x-3 rounded-md p-2 pl-3 text-sm leading-6 font-semibold`}
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
        <div class="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
          <>Main area</>
        </div>
      </div>
    </div>
  )
})
