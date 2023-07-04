import { component$ } from '@builder.io/qwik'
import { server$, useLocation, useNavigate } from '@builder.io/qwik-city'

import Link from './link'
import * as db from '~/db'

const adder = server$(async function (id) {
  try {
    const queryRes = await db.query(
      `select links
       from event
       where id = $1`,
      [id],
    )
    const links = queryRes?.rows[0]?.links ?? []
    const newLinks = [...links, { url: '', label: '' }]
    console.log('newLinks', { id, newLinks })
    // need to stringify the links array because of pg converts objects but not arrays:
    // https://github.com/brianc/node-postgres/issues/374
    await db.query(
      `update event
        set links = $2
        where id = $1`,
      [id, JSON.stringify(newLinks)],
    )
  } catch (error) {
    console.error('query error', {
      stack: error.stack,
      message: error.message,
    })
  }
  console.log('links, adder will return')
  return true
})

export default component$(({ event }) => {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <>
      <div class="mt-1 flex gap-1 text-sm font-semibold">
        <label class="w-32">Label</label>
        <label class=" ">Url</label>
      </div>
      <div class="space-y-1 w-full">
        {(event.value.links ?? []).map((link, index) => (
          <Link
            key={`${link.label}/${link.url}/${index}`}
            link={link}
            index={index}
          />
        ))}
      </div>
      <button
        class="mt-4 px-3 py-2 text-sm font-semibold text-black bg-white rounded-md outline outline-1 outline-slate-300 shadow-sm hover:bg-slate-100"
        onClick$={async () => {
          await adder(location.params.event_id)
          console.log('adder returned, calling navigate')
          // TODO: does not work :(
          navigate()
        }}
      >
        Add Link
      </button>
    </>
  )
})
