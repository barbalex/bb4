import { component$ } from '@builder.io/qwik'
import dayjs from 'dayjs'

import Event from './listItem'

export default component$(
  ({ date, migrationEvents, politicEvents, refetcher }) => {
    const day = dayjs(date).format('D')
    const dayWithEvents = migrationEvents.length > 0 || politicEvents.length > 0

    return (
      <div class="border-t border-solid border-slate-200 hover:bg-slate-50 event-row">
        {dayWithEvents && <p class="p-1.5 pr-5 text-right">{day}</p>}
        {!dayWithEvents && <p class="p-1.5 pr-5 text-right">{day}</p>}
        <div class="pr-2.5 break-words">
          <ul class="px-4">
            {migrationEvents.map((event) => (
              <Event key={event.id} event={event} refetcher={refetcher} />
            ))}
          </ul>
        </div>
        <div class="pr-2.5 break-words">
          <ul class="px-4">
            {politicEvents.map((event) => (
              <Event key={event.id} event={event} refetcher={refetcher} />
            ))}
          </ul>
        </div>
      </div>
    )
  },
)
