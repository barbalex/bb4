import { component$, useResource$, Resource } from '@builder.io/qwik'
import { server$, useLocation } from '@builder.io/qwik-city'

import * as db from '../../../../db'

const labelUpdater = server$(async function ({ id, index, label }) {
  try {
    const queryRes = await db.query(
      `SELECT
        links
      FROM
        EVENT
      where
        id = $1`,
      [id],
    )
    const links = queryRes?.rows[0]?.links
    links[index].label = label
    // need to stringify the links array because of pg converts objects but not arrays:
    // https://github.com/brianc/node-postgres/issues/374
    await db.query(
      `update event
          set links = $2
        where
          id = $1`,
      [id, JSON.stringify(links)],
    )
  } catch (error) {
    console.error('query error', { stack: error.stack, message: error.message })
  }
})
const urlUpdater = server$(async function ({ id, index, url }) {
  try {
    const queryRes = await db.query(
      `SELECT
        links
      FROM
        EVENT
      where
        id = $1`,
      [id],
    )
    const links = queryRes?.rows[0]?.links
    links[index].url = url
    // need to stringify the links array because of pg converts objects but not arrays:
    // https://github.com/brianc/node-postgres/issues/374
    await db.query(
      `update event
          set links = $2
        where
          id = $1`,
      [id, JSON.stringify(links)],
    )
  } catch (error) {
    console.error('query error', { stack: error.stack, message: error.message })
  }
})

// example:
// `SELECT
//   links
// FROM
//   EVENT
// where
//   id = 'b9d8ab28-6c86-4696-9efa-292f7b9767df'`
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

export default component$(({ index }) => {
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
                onChange$={(event, currentTarget) =>
                  labelUpdater({
                    id: location.params.event_id,
                    index,
                    label: currentTarget.value,
                  })
                }
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
                onChange$={(event, currentTarget) =>
                  urlUpdater({
                    id: location.params.event_id,
                    index,
                    url: currentTarget.value,
                  })
                }
                // make it one line high but user can enlarge it
                rows="1"
              >
                {link.url}
              </textarea>
            </fieldset>
          </div>
        )
      }}
    />
  )
})
