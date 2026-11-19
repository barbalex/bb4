import type { RequestEvent } from '@builder.io/qwik-city'

import * as db from '~/db'

export const onGet = async ({ redirect }: RequestEvent) => {
  // redirect to the latest year that has data (not the current year:
  // the site is frozen and must keep serving its last documented year)
  let res
  try {
    res = await db.query(
      `select max(date_part('year', datum))::int as year from event where datum is not null`,
    )
  } catch (error) {
    console.error('query error', error.stack)
  }
  const year = res?.rows?.[0]?.year ?? 2024

  throw redirect(308, `/events/${year}/`)
}
