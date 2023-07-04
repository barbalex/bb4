import { component$ } from '@builder.io/qwik'
import { routeLoader$ } from '@builder.io/qwik-city'

import Years from './years'
import EventHeader from './header'
import Events from './list'
import * as db from '~/db'

export const useYears = routeLoader$(async function () {
  let res
  try {
    res = await db.query(
      `SELECT
          to_char(date_trunc('year', datum), 'yyyy')::int AS year
        FROM
          EVENT
        where datum is not null
        GROUP BY
          year
        ORDER BY
          year ASC`,
    )
  } catch (error) {
    console.error('query error', error.stack)
  }

  return res?.rows?.map((r) => r.year)
})

// select all articles: id, title, draft
export const useEvents = routeLoader$(async function (requestEvent) {
  const activeYear = requestEvent.params.year
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
  // need last_of_month, not end_of_month
  // reason: there may be no event on the last day of the month
  // DANGER
  // select distinct datum gives multiple month/day rows!!!!
  try {
    dateRes = await db.query(
      `SELECT distinct on (extract(month from datum)::int, extract(day from datum)::int)
          datum,
          extract(month from datum)::int as month,
          extract(day from datum)::int as day,
          (date_trunc('month', datum) + interval '1 month - 1 day')::date as end_of_month,
          row_number() over (partition by extract(month from datum)::int order by extract(month from datum)::int, extract(day from datum)::int desc)::int = 1 as is_last_of_month
        FROM
          EVENT
        where
          datum between $1 and $2
        ORDER BY
        extract(month from datum)::int desc, extract(day from datum)::int desc`,
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
    month: date.month,
    day: date.day,
    isLastOfMonth: date.is_last_of_month,
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
  // console.log('rowsData:', rowsData)

  return rowsData
})

export default component$(() => {
  return (
    <>
      <p class="hyphens-manual text-center px-7 pt-6 pb-6 font-medium text-lg sm:text-xl">
        Large numbers of migrants and refugees arriving in Europe cross some
        part of the Mediterranean. The purpose of this website is to take a look
        at the most important route, that of the Central Mediterranean, by
        focusing on both maritime and political events.
      </p>
      <Years />
      <div class="event-grid">
        <EventHeader />
        <div class="event-list">
          <Events />
        </div>
      </div>
    </>
  )
})
