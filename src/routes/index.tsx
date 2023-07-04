import type { DocumentHead } from '@builder.io/qwik-city'

export const onGet = async ({ redirect }: RequestEvent) => {
  throw redirect(308, `/events/${new Date().getFullYear()}/`)
}

// TODO: needed?
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
