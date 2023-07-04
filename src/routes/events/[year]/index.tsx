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
