import { component$ } from '@builder.io/qwik'

import Link from './link'

export default component$(({ event }) => {
  return (
    <>
      <div class="mt-4 space-y-1 w-full">
        {(event.links ?? []).map((link, index) => (
          <Link key={`${link.label}/${link.url}/${index}`} index={index} />
        ))}
      </div>
      <button
        class="mt-4 px-3 py-2 text-sm font-semibold text-black bg-white rounded-md outline outline-1 outline-slate-300 shadow-sm hover:bg-slate-100"
        onClick$={() => {
          console.log('TODO: Add link')
        }}
      >
        Add Link
      </button>
    </>
  )
})
