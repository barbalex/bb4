import { component$ } from '@builder.io/qwik'
import { server$ } from '@builder.io/qwik-city'

import * as db from '../../../../db'

const labelUpdater = server$(async function ({ event, index, label }) {
  let res
  try {
    res = await db.query(
      `SELECT
          *
        FROM
          EVENT
        where
          id = $1`,
      [id],
    )
  } catch (error) {
    console.error('query error', error.stack)
  }

  return res?.rows[0]
})

export default component$(({ event, index, dirty }) => {
  return (
    <div class="flex gap-1">
      <fieldset class="">
        <label for="label" class="sr-only">
          Label
        </label>
        <input
          type="text"
          name="label"
          id="label"
          class="block w-32 rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          value={event.links[index].label}
          onChange$={(event) => {
            dirty.value = true
            // TODO: update event
            labelUpdater({ event, index, label: event.target.value })
          }}
        />
      </fieldset>
      <fieldset class="basis-auto grow">
        <label for="label" class="sr-only">
          Url
        </label>
        <input
          type="text"
          name="url"
          id="url"
          class="block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          value={event.links[index].url}
          onChange$={() => {
            dirty.value = true
            // TODO: update event
          }}
        />
      </fieldset>
    </div>
  )
})
