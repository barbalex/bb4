import { component$, useResource$, Resource, Slot } from '@builder.io/qwik'
import { server$, Link, useLocation } from '@builder.io/qwik-city'
import { Client } from 'pg'

// select all publications: id, title, draft
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
      'select id, title, category, draft from publication order by sort',
    )
  } catch (error) {
    console.error('query error', error.stack)
  }
  client.end()

  return res?.rows
})

export default component$(() => {
  const publications = useResource$(async () => await dataFetcher())
  const location = useLocation()

  return (
    <div class="flex min-h-full flex-col">
      <div class="flex-1 xl:flex">
        <div class="border-b border-gray-200 px-4 py-6 sm:px-6 lg:pl-8 xl:w-64 xl:shrink-0 xl:border-b-0 xl:border-r xl:pl-6">
          <nav class="sticky top-24 flex  flex-1 flex-col" aria-label="Sidebar">
            <ul role="list" class="-mx-2 space-y-1">
              <Resource
                value={publications}
                onPending={() => <div>Loading...</div>}
                onRejected={(reason) => <div>Error: {reason}</div>}
                onResolved={(publications) =>
                  publications.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/publications/${p.id}`}
                        class={`${
                          location.params.publication_id === p.id
                            ? 'font-extrabold'
                            : 'opacity-80'
                        } text-white font-bold group flex gap-x-3 rounded-md p-2 pl-3 text-sm leading-6 bg-[url(../../../oceanDark.jpg)] hover:opacity-100 hover:font-extrabold`}
                      >
                        {p.title}
                      </Link>
                    </li>
                  ))
                }
              />
            </ul>
          </nav>
        </div>
        <div class="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
          <Slot />
        </div>
      </div>
    </div>
  )
})
