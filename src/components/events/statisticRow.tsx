import { component$ } from '@builder.io/qwik'

import Event from './event'

export default component$(({ migrationStats = [], politicStats = [] }) => (
  <div class="flex border-t border-solid border-slate-200 bg-slate-100 hover:bg-slate-200">
    <p class="grow-0 shrink-0 basis-14 p-1.5 pr-5 text-right"></p>
    <div class="grow-1 shrink-1 basis-1/2 pr-2.5 break-words">
      <ul class="px-4">
        {migrationStats.map((event) => (
          <Event key={event.id} event={event} />
        ))}
      </ul>
    </div>
    <div class="grow-1 shrink-1 basis-1/2 pr-2.5 break-words">
      <ul class="px-4">
        {politicStats.map((event) => (
          <Event key={event.id} event={event} />
        ))}
      </ul>
    </div>
  </div>
))
