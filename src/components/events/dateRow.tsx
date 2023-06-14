import { component$ } from '@builder.io/qwik'
import dayjs from 'dayjs'

import Event from './event'

export default component$(({ data }) => {
  const day = dayjs(data.date).format('D')
  const dayWithEvents =
    data.migrationEvents.length > 0 || data.politicEvents.length > 0
  // console.log('dateRow, data:', data)

  return (
    <div class="flex border-t border-solid border-slate-200 hover:background-slate-100">
      {dayWithEvents && (
        <p class="grow-0 shrink-0 basis-14 p-1.5 pr-5 text-right">{day}</p>
      )}
      {!dayWithEvents && (
        <p class="grow-0 shrink-0 basis-14 p-1.5 pr-5 text-right">{day}</p>
      )}
      <div class="grow-0 shrink-0 basis-1/2 pr-2.5 break-words">
        <ul class="px-4">
          {data.migrationEvents.map((event, key) => (
            <Event key={key} event={event} />
          ))}
        </ul>
      </div>
      <div class="grow-0 shrink-0 basis-1/2 pr-2.5 break-words">
        <ul class="px-4">
          {data.politicEvents.map((event, key) => (
            <Event key={key} event={event} />
          ))}
        </ul>
      </div>
    </div>
  )
})
