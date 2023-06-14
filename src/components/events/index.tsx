import { component$, useResource$, Resource } from '@builder.io/qwik'
import { server$ } from '@builder.io/qwik-city'
import { Client } from 'pg'

import EventRow from './eventRow'
import MonthRow from './monthRow'
import StatisticRow from './statisticRow'

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
          *,
          extract(month from datum)::int as month,
          extract(day from datum)::int as day
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
          *,
          extract(month from datum)::int as month,
          extract(day from datum)::int as day
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
  let dateRes
  try {
    dateRes = await client.query(
      `SELECT
          distinct datum,
          extract(month from datum)::int as month,
          extract(day from datum)::int as day,
          (date_trunc('month', datum) + interval '1 month - 1 day')::date as end_of_month,
          (date_trunc('month', datum) + interval '1 month - 1 day')::date = datum::date as is_end_of_month
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
    dates: dateRes?.rows,
  }
})

export default component$(({ activeYear }) => {
  const years = useResource$(async ({ track }) => {
    const year = track(() => activeYear.value)

    return await dataFetcher(year)
  })

  return (
    <Resource
      value={years}
      onPending={() => <div>Loading...</div>}
      onRejected={(reason) => <div>Error: {reason}</div>}
      onResolved={({ migrationEvents, politicEvents, dates }) => {
        // console.log('events, migrationEvents:', migrationEvents[0])
        // console.log('events, politicEvents:', politicEvents[0])
        // console.log('events, dates:', dates[0])

        // comparing equality of dates did not work
        // so need to extract day and month
        const rowsData = dates.map((date) => {
          return {
            date: date.datum,
            day: date.day,
            isEndOfMonth: date.is_end_of_month,
            migrationEvents: migrationEvents.filter(
              (e) => e.month === date.month && e.day === date.day,
            ),
            politicEvents: politicEvents.filter(
              (e) => e.month === date.month && e.day === date.day,
            ),
          }
        })
        // console.log('events, rowsData:', rowsData[0])

        return (
          <div class="relative w-full mb-0 mt-6">
            {/* header */}
            <div class="absolute w-full pb-1.5 font-bold text-2xl break-words sticky top-14 bg-white z-10 border-solid border border-white border-b-slate-200">
              <div class="flex w-full">
                <div class="grow-0 shrink-0 basis-14 pr-4 text-right"></div>
                <div class="grow-0 shrink-0 basis-1/2 pr-2 text-center">
                  Maritime Events
                </div>
                <div class="grow-0 shrink-0 basis-1/2 pr-2 text-center">
                  Political Events
                </div>
              </div>
            </div>
            {/* body */}
            <div class="relative overflow-x-hidden overflow-y-auto">
              {rowsData.map((row, index) => {
                const eventData = {
                  date: row.date,
                  migrationEvents: row.migrationEvents.filter(
                    (event) =>
                      !event.tags || !event.tags.includes('monthlyStatistics'),
                  ),
                  politicEvents: (row?.politicEvents ?? []).filter(
                    (event) =>
                      !event.tags || !event.tags.includes('monthlyStatistics'),
                  ),
                }
                const statsData = {
                  date: row.date,
                  migrationEvents: row.migrationEvents.filter(
                    (event) =>
                      event.tags && event.tags.includes('monthlyStatistics'),
                  ),
                  politicEvents: (row?.politicEvents ?? []).filter(
                    (event) =>
                      event.tags && event.tags.includes('monthlyStatistics'),
                  ),
                }
                const statsExist =
                  statsData.migrationEvents.length > 0 ||
                  statsData.politicEvents.length > 0
                const needsMonthRow = row.isEndOfMonth || index === 0
                const needsMonthlyStatisticsRow = row.isEndOfMonth && statsExist

                return (
                  <>
                    {needsMonthRow && (
                      <MonthRow key={`${row.id}-month-row`} date={row.date} />
                    )}
                    <div key={row.id}>
                      {needsMonthlyStatisticsRow && (
                        <StatisticRow data={statsData} />
                      )}
                      <EventRow
                        key={`${row.date}-event-data`}
                        data={eventData}
                      />
                    </div>
                  </>
                )
              })}
            </div>
          </div>
        )
      }}
    />
  )
})
