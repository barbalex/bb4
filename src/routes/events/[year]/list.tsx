import { component$ } from '@builder.io/qwik'

import EventRow from './eventRow'
import MonthRow from './monthRow'
import StatisticRow from './statisticRow'

import { useEvents } from '.'

export default component$(() => {
  const data = useEvents()
  // TODO: data updates, but not the view

  // DO NOT use a parent div, use a fragment instead
  // div prevents sticky month row
  return data.value.map((row, index) => (
    <>
      {(row.isLastOfMonth || index === 0) && (
        <MonthRow key={`${row.id}/month`} date={row.date} />
      )}
      {row.isLastOfMonth &&
        (row.migrationStats?.length > 0 || row.politicStats?.length > 0) && (
          <StatisticRow
            key={`${row.id}/stats`}
            migrationStats={row.migrationStats}
            politicStats={row.politicStats}
          />
        )}
      <EventRow
        key={`${row.id}/event`}
        date={row.date}
        migrationEvents={row.migrationEvents}
        politicEvents={row.politicEvents}
      />
    </>
  ))
})
