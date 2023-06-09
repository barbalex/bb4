import { component$ } from '@builder.io/qwik'
import type { DocumentHead } from '@builder.io/qwik-city'

export default component$(() => {
  return <div>index</div>
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
