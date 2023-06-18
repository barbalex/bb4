import { component$, useResource$, Resource } from '@builder.io/qwik'
import { server$ } from '@builder.io/qwik-city'

import EventRow from './eventRow'
import MonthRow from './monthRow'
import StatisticRow from './statisticRow'
import * as db from '../../db'

// select all articles: id, title, draft
const dataFetcher = server$(async function (activeYear) {
  let migrationEventRes
  try {
    migrationEventRes = await db.query(
      `SELECT
          *,
          extract(month from datum)::int as month,
          extract(day from datum)::int as day
        FROM
          EVENT
        where
          datum between $1 and $2
          and event_type = 'migration'
        ORDER BY
          datum desc, tags_sort asc`,
      [`${activeYear}-01-01`, `${activeYear}-12-31`],
    )
  } catch (error) {
    console.error('query error', error.stack)
  }
  let politicEventRes
  try {
    politicEventRes = await db.query(
      `SELECT
          *,
          extract(month from datum)::int as month,
          extract(day from datum)::int as day
        FROM
          EVENT
        where
          datum between $1 and $2
          and event_type = 'politics'
        ORDER BY
          datum desc, tags_sort asc`,
      [`${activeYear}-01-01`, `${activeYear}-12-31`],
    )
  } catch (error) {
    console.error('query error', error.stack)
  }
  let dateRes
  try {
    dateRes = await db.query(
      `SELECT
          distinct datum,
          extract(month from datum)::int as month,
          extract(day from datum)::int as day,
          (date_trunc('month', datum) + interval '1 month - 1 day')::date as end_of_month,
          (date_trunc('month', datum) + interval '1 month - 1 day')::date = datum::date as is_end_of_month
        FROM
          EVENT
        where
          datum between $1 and $2
        ORDER BY
          datum desc`,
      [`${activeYear}-01-01`, `${activeYear}-12-31`],
    )
  } catch (error) {
    console.error('query error', error.stack)
  }

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
          <>
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
                <div key={row.id}>
                  {needsMonthRow && <MonthRow date={row.date} />}
                  {needsMonthlyStatisticsRow && (
                    <StatisticRow data={statsData} />
                  )}
                  <EventRow data={eventData} />
                </div>
              )
            })}
          </>
        )
      }}
    />
  )
})
