import { component$, useSignal } from '@builder.io/qwik'
import { server$, useLocation, useNavigate } from '@builder.io/qwik-city'

import Link from './link'
import * as db from '~/db'

const adder = server$(async function ({ id, url, label }) {
  try {
    const queryRes = await db.query(
      `select links
       from event
       where id = $1`,
      [id],
    )
    const links = queryRes?.rows[0]?.links ?? []
    const newLinks = [...links, { url, label }]
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

  return true
})

export default component$(({ event }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const newUrl = useSignal()
  const newLabel = useSignal()

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

      <div
        class={`mt-0 text-sm font-semibold ${
          !!event.value.links?.length && 'mt-2'
        }`}
      >
        <label class="w-full text-slate-400" for="new-link">
          Add a new link here:
        </label>
      </div>
      <div class="flex gap-1" id="new-link">
        <fieldset class="">
          <label for="label" class="sr-only">
            Label
          </label>
          <input
            type="text"
            name="label"
            id="label"
            class="block w-32 rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            bind:value={newLabel}
            onChange$={async (event, currentTarget) => {
              if (newUrl.value) {
                await adder({
                  id: location.params.event_id,
                  url: newUrl.value,
                  label: currentTarget.value,
                })
                newLabel.value = undefined
                newUrl.value = undefined
                navigate()
              }
            }}
          />
        </fieldset>
        <fieldset class="basis-auto grow">
          <label for="label" class="sr-only">
            Url
          </label>
          <textarea
            name="url"
            id="url"
            class="block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            bind:value={newUrl}
            onChange$={async (event, currentTarget) => {
              if (newLabel.value) {
                await adder({
                  id: location.params.event_id,
                  url: currentTarget.value,
                  label: newLabel.value,
                })
                newLabel.value = undefined
                newUrl.value = undefined
                navigate()
              }
            }}
            // make it one line high but user can enlarge it
            rows="1"
          />
        </fieldset>
      </div>
    </>
  )
})
