import { component$, useResource$, Resource } from '@builder.io/qwik'
import { server$ } from '@builder.io/qwik-city'
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

  return res?.rows?.map((r) => r.year)
})

export default component$(({ activeYear }) => {
  const years = useResource$(async () => await dataFetcher())
  console.log('events', { activeYear: activeYear.value })

  return (
    <Resource
      value={years}
      onPending={() => <div>Loading...</div>}
      onRejected={(reason) => <div>Error: {reason}</div>}
      onResolved={() => {
        console.log('TODO:')
      }}
    />
  )
})
