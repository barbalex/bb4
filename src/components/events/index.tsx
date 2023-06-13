import { component$, useResource$, Resource } from '@builder.io/qwik'
import { server$ } from '@builder.io/qwik-city'
import { Client } from 'pg'
import dayjs from 'dayjs'

import DateRow from './dateRow'

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
  let migrationEventRes
  try {
    migrationEventRes = await client.query(
      `SELECT
          *
        FROM
          EVENT
        where
          datum between '${activeYear}-01-01' and '${activeYear}-12-31'
          and event_type = 'migration'
        ORDER BY
          datum desc, tags_sort asc`,
    )
  } catch (error) {
    console.error('query error', error.stack)
  }
  let politicEventRes
  try {
    politicEventRes = await client.query(
      `SELECT
          *
        FROM
          EVENT
        where
          datum between '${activeYear}-01-01' and '${activeYear}-12-31'
          and event_type = 'politics'
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

  return {
    migrationEvents: migrationEventRes?.rows,
    politicEvents: politicEventRes?.rows,
    datums: datumRes?.rows?.map((r) => r.datum),
  }
})

export default component$(({ activeYear }) => {
  const years = useResource$(async () => await dataFetcher(activeYear.value))

  return (
    <Resource
      value={years}
      onPending={() => <div>Loading...</div>}
      onRejected={(reason) => <div>Error: {reason}</div>}
      onResolved={({ migrationEvents, politicEvents, datums }) => {
        const rowsData = datums.map((datum) => ({
          date: datum,
          migrationEvents: migrationEvents.filter((e) => e.datum === datum),
          politicEvents: politicEvents.filter((e) => e.datum === datum),
        }))
        const rows = []
        for (const [index, row] of rowsData.entries()) {
          const day = dayjs(row.date).format('D')
          const endOfMonth = dayjs(row.date).endOf('month').format('DD')
          const rowForDateRow = {
            date: row.date,
            migrationEvents: row.migrationEvents.filter(
              (event) =>
                !event.tags || !event.tags.includes('monthlyStatistics'),
            ),
            politicsEvents: (row?.politicsEvents ?? []).filter(
              (event) =>
                !event.tags || !event.tags.includes('monthlyStatistics'),
            ),
          }
          const rowForMonthlyStatsRow = {
            date: row.date,
            migrationEvents: row.migrationEvents.filter(
              (event) => event.tags && event.tags.includes('monthlyStatistics'),
            ),
            politicsEvents: (row?.politicsEvents ?? []).filter(
              (event) => event.tags && event.tags.includes('monthlyStatistics'),
            ),
          }
          const rowForMonthlyStatsHasEvents =
            rowForMonthlyStatsRow.migrationEvents.length > 0 ||
            rowForMonthlyStatsRow.politicsEvents.length > 0
          const needsMonthRow = day === endOfMonth || index === 0
          const needsMonthlyStatisticsRow =
            day === endOfMonth && rowForMonthlyStatsHasEvents
          if (needsMonthRow) {
            // rows.push(<MonthRow key={`${index}monthRow`} dateRowObject={row} />)
          }
          if (needsMonthlyStatisticsRow) {
            // rows.push(
            //   <MonthlyStatisticsRow
            //     key={`${index}monthlyStatisticsRow`}
            //     dateRowObject={rowForMonthlyStatsRow}
            //   />,
            // )
          }
          rows.push(<DateRow key={index} data={rowForDateRow} />)
        }

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
              {rows}
            </div>
          </div>
        )
      }}
    />
  )
})
