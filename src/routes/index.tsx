import { component$, useSignal, useResource$, Resource } from '@builder.io/qwik'
import type { DocumentHead } from '@builder.io/qwik-city'
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

  // TODO: create client on app start and store in store
  let res
  try {
    res = await client.query(
      `SELECT
          to_char(date_trunc('year', datum), 'yyyy')::int AS year
        FROM
          EVENT
        GROUP BY
          year
        ORDER BY
          year ASC`,
    )
  } catch (error) {
    console.error('query error', error.stack)
  }
  client.end()

  return res?.rows
})

export default component$(() => {
  const grouped15to18 = useSignal(true)
  const grouped19to22 = useSignal(false)
  const years = useResource$(async () => await dataFetcher())
  console.log('years', years)

  return (
    <>
      <p class="hyphens-manual text-center px-7 pt-6 pb-6 text-lg">
        Large numbers of migrants and refugees arriving in Europe cross some
        part of the Mediterranean. The purpose of this website is to take a look
        at the most important route, that of the Central Mediterranean, by
        focusing on both maritime and political events.
      </p>
      <div>
        <div class="sm:hidden">
          <label for="tabs" class="sr-only">
            Select a tab
          </label>
          {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
          <select
            id="tabs"
            name="tabs"
            class="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option>2011 - 2014</option>
            <option>2015 - 2018</option>
            <option>2019 - 2022</option>
            <option selected="">2023</option>
          </select>
        </div>
        <div class="hidden sm:block">
          <div class="border-b border-gray-200">
            <nav class="-mb-px flex" aria-label="Tabs">
              {/* Current: "border-indigo-500 text-indigo-600", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
              <a
                href="/monthly-events/2014/"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 w-1/4 border-b-2 py-4 px-1 text-center text-sm font-medium"
              >
                2011 - 2014
              </a>
              <Resource
                value={years}
                onPending={() => <div>Loading...</div>}
                onRejected={(reason) => <div>Error: {reason}</div>}
                onResolved={(years) => {
                  // TODO:
                  return null
                }}
              />
              <a
                href="#"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 w-1/4 border-b-2 py-4 px-1 text-center text-sm font-medium"
              >
                2015 - 2018
              </a>
              <a
                href="#"
                class="border-indigo-500 text-indigo-600 w-1/4 border-b-2 py-4 px-1 text-center text-sm font-medium"
                aria-current="page"
              >
                2019 - 2022
              </a>
              <a
                href="#"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 w-1/4 border-b-2 py-4 px-1 text-center text-sm font-medium"
              >
                2023
              </a>
            </nav>
          </div>
        </div>
      </div>
    </>
  )
})

export const head: DocumentHead = {
  title: 'mediterranean migration',
  meta: [
    {
      name: 'mediterranean migration',
      content:
        'Overview over migration across the the blue borders of the Me­diterrane­an',
    },
  ],
}
