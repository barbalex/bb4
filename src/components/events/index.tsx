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
          and (
            tag != 'monthlyStatistics'
            or tag is null
          )
        ORDER BY
          datum desc, tags_sort asc`,
      [`${activeYear}-01-01`, `${activeYear}-12-31`],
    )
  } catch (error) {
    console.error('query error', error.stack)
  }

  let migrationStatRes
  try {
    migrationStatRes = await db.query(
      `SELECT
          *,
          extract(month from datum)::int as month,
          extract(day from datum)::int as day
        FROM
          EVENT
        where
          datum between $1 and $2
          and event_type = 'migration'
          and tag = 'monthlyStatistics'
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
          and (
            tag != 'monthlyStatistics'
            or tag is null
          )
        ORDER BY
          datum desc, tags_sort asc`,
      [`${activeYear}-01-01`, `${activeYear}-12-31`],
    )
  } catch (error) {
    console.error('query error', error.stack)
  }

  let politicStatRes
  try {
    politicStatRes = await db.query(
      `SELECT
          *,
          extract(month from datum)::int as month,
          extract(day from datum)::int as day
        FROM
          EVENT
        where
          datum between $1 and $2
          and event_type = 'politics'
          and tag = 'monthlyStatistics'
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

  // comparing equality of dates did not work
  // so need to extract day and month
  // TODO: do this in PostgreSQL?
  // guess it would need jsonb arrays of rows
  const rowsData = dateRes.rows.map((date) => ({
    date: date.datum,
    day: date.day,
    isEndOfMonth: date.is_end_of_month,
    migrationEvents: migrationEventRes.rows.filter(
      (e) => e.month === date.month && e.day === date.day,
    ),
    migrationStats: migrationStatRes.rows.filter(
      (e) => e.month === date.month && e.day === date.day,
    ),
    politicEvents: politicEventRes.rows.filter(
      (e) => e.month === date.month && e.day === date.day,
    ),
    politicStats: politicStatRes.rows.filter(
      (e) => e.month === date.month && e.day === date.day,
    ),
  }))

  return rowsData
})

export default component$(({ activeYear }) => {
  const data = useResource$(async ({ track }) => {
    const year = track(() => activeYear.value)

    return await dataFetcher(year)
  })

  // console.log('events rendering')

  return (
    <Resource
      value={data}
      onPending={() => <div>Loading...</div>}
      onRejected={(reason) => <div>Error: {reason}</div>}
      onResolved={(rowsData) => {
        // console.log('events, rowsData:', rowsData)

        // DO NOT use a parent div, use a fragment instead
        // div prevents sticky month row
        return rowsData.map((row, index) => (
          <>
            {(row.isEndOfMonth || index === 0) && (
              <MonthRow key={`${row.id}/monthrow`} date={row.date} />
            )}
            {row.isEndOfMonth &&
              (row.migrationStats?.length > 0 ||
                row.politicStats?.length > 0) && (
                <StatisticRow
                  key={`${row.id}/statsrow`}
                  migrationStats={row.migrationStats}
                  politicStats={row.politicStats}
                />
              )}
            <EventRow
              key={`${row.id}/eventhrow`}
              date={row.date}
              migrationEvents={row.migrationEvents}
              politicEvents={row.politicEvents}
            />
          </>
        ))
      }}
    />
  )
})
