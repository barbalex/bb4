import { component$ } from '@builder.io/qwik'

export default component$(({ event }) => {
  return (
    <div class="mt-4 space-y-6">
      {(event.links ?? []).map((link) => JSON.stringify(link))}
    </div>
  )
})
