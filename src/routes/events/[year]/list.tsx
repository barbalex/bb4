import { component$ } from '@builder.io/qwik'
import { useLocation } from '@builder.io/qwik-city'

import EventRow from './eventRow'
import MonthRow from './monthRow'
import StatisticRow from './statisticRow'

import { useEvents } from '.'

export default component$(() => {
  const events = useEvents()
  const location = useLocation()
  // Problem: data updates, but the top of the list does not rerender correctly
  // Solved by adding the year to the keys

  // DO NOT use a parent div, use a fragment instead
  // div prevents sticky month row
  return events.value.map((row, index) => (
    <>
      {(row.isLastOfMonth || index === 0) && (
        <MonthRow
          key={`${row.id}/month/${location.params.year}`}
          date={row.date}
        />
      )}
      {row.isLastOfMonth &&
        (row.migrationStats?.length > 0 || row.politicStats?.length > 0) && (
          <StatisticRow
            key={`${row.id}/stats/${location.params.year}`}
            migrationStats={row.migrationStats}
            politicStats={row.politicStats}
          />
        )}
      <EventRow
        key={`${row.id}/event/${location.params.year}`}
        date={row.date}
        migrationEvents={row.migrationEvents}
        politicEvents={row.politicEvents}
      />
    </>
  ))
})
