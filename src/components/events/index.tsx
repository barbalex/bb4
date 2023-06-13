import { component$, useResource$, Resource } from '@builder.io/qwik'
import { server$ } from '@builder.io/qwik-city'
import { Client } from 'pg'

// select all articles: id, title, draft
const dataFetcher = server$(async (activeYear) => {
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
  let eventRes
  try {
    eventRes = await client.query(
      `SELECT
          *
        FROM
          EVENT
        where
          datum between '${activeYear}-01-01' and '${activeYear}-12-31'
        ORDER BY
          datum desc, tags_sort asc`,
    )
  } catch (error) {
    console.error('query error', error.stack)
  }
  let datumRes
  try {
    datumRes = await client.query(
      `SELECT
          distinct datum
        FROM
          EVENT
        where
          datum between '${activeYear}-01-01' and '${activeYear}-12-31'
        ORDER BY
          datum desc`,
    )
  } catch (error) {
    console.error('query error', error.stack)
  }

  client.end()

  return { events: eventRes?.rows, datums: datumRes?.rows?.map((r) => r.datum) }
})

export default component$(({ activeYear }) => {
  const years = useResource$(async () => await dataFetcher(activeYear.value))
  console.log('events', { activeYear: activeYear.value })

  return (
    <Resource
      value={years}
      onPending={() => <div>Loading...</div>}
      onRejected={(reason) => <div>Error: {reason}</div>}
      onResolved={({ events, datums }) => {
        console.log('events', { events, datums })

        return (
          <div class="relative w-full mb-0 mt-12">
            {/* header */}
            <div class="absolute w-full -top-10 font-bold text-2xl break-words">
              <div class="flex w-full">
                <div class="grow-0 w-15 pr-4 text-right">day</div>
                <div class="grow w-auto pr-2 text-center">Maritime Events</div>
                <div class="grow w-auto pr-2 text-center">Political Events</div>
              </div>
            </div>
            {/* body */}
            <div class="overflow-x-hidden overflow-y-auto bg-indigo-50">
              body
            </div>
          </div>
        )
      }}
    />
  )
})
