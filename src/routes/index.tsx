import { component$, useSignal } from '@builder.io/qwik'
import type { DocumentHead } from '@builder.io/qwik-city'

import Years from '../components/years'
import EventHeader from '../components/events/header'
import Events from '../components/events'

export default component$(() => {
  const activeYear = useSignal(new Date().getFullYear())

  return (
    <>
      <p class="hyphens-manual text-center px-7 pt-6 pb-6 text-lg">
        Large numbers of migrants and refugees arriving in Europe cross some
        part of the Mediterranean. The purpose of this website is to take a look
        at the most important route, that of the Central Mediterranean, by
        focusing on both maritime and political events.
      </p>
      <Years activeYear={activeYear} />
      <EventHeader />
      <Events activeYear={activeYear} />
    </>
  )
})

export const head: DocumentHead = {
  title: 'mediterranean migration',
  meta: [
    {
      name: 'mediterranean migration',
      content:
        'Overview over migration across the the blue borders of the Me­diterrane­an',
    },
  ],
}
