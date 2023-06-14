import { component$ } from '@builder.io/qwik'
import dayjs from 'dayjs'

import Event from './event'

export default component$(({ data }) => {
  const day = dayjs(data.date).format('D')
  const dayWithEvents =
    data.migrationEvents.length > 0 || data.politicEvents.length > 0

  return (
    <div class="flex border-t border-solid border-slate-200 hover:bg-slate-50">
      {dayWithEvents && (
        <p class="grow-0 shrink-0 basis-14 p-1.5 pr-5 text-right">{day}</p>
      )}
      {!dayWithEvents && (
        <p class="grow-0 shrink-0 basis-14 p-1.5 pr-5 text-right">{day}</p>
      )}
      <div class="grow-1 shrink-1 basis-1/2 pr-2.5 break-words">
        <ul class="px-4">
          {data.migrationEvents.map((event) => (
            <Event key={event.id} event={event} />
          ))}
        </ul>
      </div>
      <div class="grow-1 shrink-1 basis-1/2 pr-2.5 break-words">
        <ul class="px-4">
          {data.politicEvents.map((event) => (
            <Event key={event.id} event={event} />
          ))}
        </ul>
      </div>
    </div>
  )
})
