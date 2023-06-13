import { component$ } from '@builder.io/qwik'
import dayjs from 'dayjs'

import Event from './event'

export default component$(({ data }) => {
  const day = dayjs(data.date).format('D')
  const dayWithEvents =
    data.migrationEvents.length > 0 || data.politicsEvents.length > 0
  // console.log('dateRow, data:', data)

  return (
    <div class="flex border-t border-solid border-slate-100 hover:background-slate-100">
      {dayWithEvents && (
        <div class="grow-0 p-1 w-15 max-w-15 pr-5 text-right">
          <p class="mt-2">{day}</p>
        </div>
      )}
      {!dayWithEvents && (
        <div class="grow-0 p-1 w-15 max-w-15 pr-5 text-right">
          <p>{day}</p>
        </div>
      )}
      <div class="grow-0 basis-1/2 pr-2.5 break-words">
        <ul>
          {data.migrationEvents.map((event, key) => (
            <Event key={key} event={event} />
          ))}
        </ul>
      </div>
      <div class="grow-0 basis-1/2 pr-2.5 break-words">
        <ul>
          {data.politicsEvents.map((event, key) => (
            <Event key={key} event={event} />
          ))}
        </ul>
      </div>
    </div>
  )
})
