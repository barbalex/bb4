import { component$ } from '@builder.io/qwik'
import { routeLoader$ } from '@builder.io/qwik-city'

import Years from './years'
import EventHeader from './header'
import List from './list'
import * as db from '~/db'

export const useYears: () => Readonly<Signal<number[]>> = routeLoader$(
  async function () {
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

    const years = res?.rows?.map((r) => r.year)
    // need to add 2011-2014 to the list
    const yearsToUse = [...new Set([...[2011, 2012, 2013, 2014], ...years])]

    return yearsToUse
  },
)

// select all articles: id, title, draft
export const useEvents = routeLoader$(async function (requestEvent) {
  const activeYear = requestEvent.params.year
  let migrationEventRes
  try {
    migrationEventRes = await db.query(
      `SELECT
          id,
          datum,
          title,
          links,
          event_type,
          tag,
          date_part('MONTH', datum) as month,
          date_part('DAY', datum) as day
        FROM
          EVENT
        where
          date_part('YEAR', datum) = $1
          and event_type = 'migration'
          and (
            tag != 'monthlyStatistics'
            or tag is null
          )
        ORDER BY
          datum desc, tags_sort asc`,
      [activeYear],
    )
  } catch (error) {
    console.error('query error', error.stack)
  }

  let migrationStatRes
  try {
    migrationStatRes = await db.query(
      `SELECT
          *,
          date_part('MONTH', datum) as month,
          date_part('DAY', datum) as day
        FROM
          EVENT
        where
          date_part('YEAR', datum) = $1
          and event_type = 'migration'
          and tag = 'monthlyStatistics'
        ORDER BY
          datum desc, tags_sort asc`,
      [activeYear],
    )
  } catch (error) {
    console.error('query error', error.stack)
  }

  let politicEventRes
  try {
    politicEventRes = await db.query(
      `SELECT
          *,
          date_part('MONTH', datum) as month,
          date_part('DAY', datum) as day
        FROM
          EVENT
        where
          date_part('YEAR', datum) = $1
          and event_type = 'politics'
          and (
            tag != 'monthlyStatistics'
            or tag is null
          )
        ORDER BY
          datum desc, tags_sort asc`,
      [activeYear],
    )
  } catch (error) {
    console.error('query error', error.stack)
  }

  let politicStatRes
  try {
    politicStatRes = await db.query(
      `SELECT
          *,
          date_part('MONTH', datum) as month,
          date_part('DAY', datum) as day
        FROM
          EVENT
        where
          date_part('YEAR', datum) = $1
          and event_type = 'politics'
          and tag = 'monthlyStatistics'
        ORDER BY
          datum desc, tags_sort asc`,
      [activeYear],
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
      `SELECT distinct on (date_part('MONTH', datum), date_part('DAY', datum))
          datum,
          date_part('MONTH', datum) as month,
          date_part('DAY', datum) as day,
          (date_trunc('month', datum) + interval '1 month - 1 day')::date = datum as is_end_of_month,
          row_number() over (partition by date_part('MONTH', datum) order by date_part('MONTH', datum), date_part('DAY', datum) desc)::int = 1 as is_last_of_month
        from event
        where
          date_part('YEAR', datum) = $1
        ORDER BY
          date_part('MONTH', datum) desc,
          date_part('DAY', datum) desc,
          -- need to ensure the rn 1 is choosen by distinct on
          row_number() over (partition by date_part('MONTH', datum) order by date_part('MONTH', datum), date_part('DAY', datum) desc)::int asc`,
      [activeYear],
    )
  } catch (error) {
    console.error('query error', error.stack)
  }
  // console.log(
  //   'july events',
  //   dateRes.rows.filter((row) => [8, 7].includes(row.month)),
  // )

  // comparing equality of dates did not work
  // so need to extract day and month
  // TODO: do this in PostgreSQL?
  // guess it would need jsonb arrays of rows
  const rowsData = dateRes.rows.map((date) => ({
    date: date.datum,
    month: date.month,
    day: date.day,
    isLastOfMonth: date.is_last_of_month,
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
          <List />
        </div>
      </div>
    </>
  )
})
