import { component$, useResource$, Resource } from '@builder.io/qwik'
import { server$, useLocation, $ } from '@builder.io/qwik-city'

import * as db from '../../../../db'

const labelUpdater = server$(async function ({ id, index, label }) {
  console.log('link, labelUpdater', { id, index, label })
  let res
  try {
    res = await db.query(
      `update event
          --set links = jsonb_set(links, $2, to_json($3)::JSONB, true)
          set links = jsonb_set(links, $2::text[], $3::JSONB, true)
        where
          id = $1`,
      [id, `{${index},label}`, label],
    )
  } catch (error) {
    console.error('query error', { stack: error.stack, message: error.message })
  }

  console.log('link, labelUpdater, res:', res)
})

const dataFetcher = server$(async function ({ id, index }) {
  let res
  try {
    res = await db.query(
      `SELECT
          links
        FROM
          EVENT
        where
          id = $1`,
      [id],
    )
  } catch (error) {
    console.error('query error', error.stack)
  }

  return res?.rows[0]?.links?.[index]
})

export default component$(({ index, dirty }) => {
  const location = useLocation()

  const link = useResource$(async ({ track }) => {
    const id = track(() => location.params.event_id)

    return await dataFetcher({ id, index })
  })

  return (
    <Resource
      value={link}
      onPending={() => <div>Loading...</div>}
      onRejected={(reason) => <div>Error: {reason}</div>}
      onResolved={(link) => {
        if (!link) {
          return <div>Link not found</div>
        }

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
                value={link.label}
                onChange$={(event, currentTarget) => {
                  console.log('link, label, onChange', { event, currentTarget })
                  // dirty.value = true // TODO: this is not working
                  console.log('link, label, will call labelUpdater with:', {
                    id: location.params.event_id,
                    index,
                    label: currentTarget.value,
                  })
                  // // TODO: update event
                  labelUpdater({
                    id: location.params.event_id,
                    index,
                    label: currentTarget.value,
                  })
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
                value={link.url}
                onChange$={() => {
                  dirty.value = true
                  // TODO: update event
                }}
              />
            </fieldset>
          </div>
        )
      }}
    />
  )
})
