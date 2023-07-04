import { component$ } from '@builder.io/qwik'
import { useLocation } from '@builder.io/qwik-city'

import Years from './years'
import EventHeader from './header'
import Events from './list'

export default component$(() => {
  const location = useLocation()
  const activeYear = +location.params.year
  console.log('activeYear', { activeYear, typeofActiveYear: typeof activeYear })

  return (
    <>
      <p class="hyphens-manual text-center px-7 pt-6 pb-6 font-medium text-lg sm:text-xl">
        Large numbers of migrants and refugees arriving in Europe cross some
        part of the Mediterranean. The purpose of this website is to take a look
        at the most important route, that of the Central Mediterranean, by
        focusing on both maritime and political events.
      </p>
      <Years activeYear={activeYear} />
      <div class="event-grid">
        <EventHeader />
        <div class="event-list">
          <Events />
        </div>
      </div>
    </>
  )
})
