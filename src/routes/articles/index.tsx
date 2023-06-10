import { component$, useTask$ } from '@builder.io/qwik'
import { server$ } from '@builder.io/qwik-city'
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

  // TODO: drafts only if user is logged in
  let res
  try {
    res = await client.query(
      'select id, title, draft from article order by datum desc',
    )
  } catch (error) {
    console.error('query error', error.stack)
  }
  console.log('articles from server:', res?.rows)
  client.end()

  return res?.rows
})

export default component$(() => {
  const articles = useTask$(async () => await dataFetcher())
  console.log('articles from client:', articles)

  return (
    <div class="flex min-h-full flex-col">
      <div class="flex-1 xl:flex">
        <div class="border-b border-gray-200 px-4 py-6 sm:px-6 lg:pl-8 xl:w-64 xl:shrink-0 xl:border-b-0 xl:border-r xl:pl-6">
          <nav
            class={[styles.scrollspy, 'flex', 'flex-1', 'flex-col']}
            aria-label="Sidebar"
          >
            <ul role="list" class="-mx-2 space-y-1">
              <li>
                <a
                  href="#"
                  class="bg-gray-50 text-indigo-600 group flex gap-x-3 rounded-md p-2 pl-3 text-sm leading-6 font-semibold"
                >
                  Dashboard
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div class="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">Main area</div>
      </div>
    </div>
  )
})
