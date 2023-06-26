import { component$, useResource$, Resource, useSignal } from '@builder.io/qwik'
import { server$, useLocation, useNavigate } from '@builder.io/qwik-city'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

import * as db from '../../../db'
import dateFromInputForDb from '~/utils/dateFromInputForDb'
import Links from './links'
import Calendar from './calendar'

const dataFetcher = server$(async function (id) {
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

const updater = server$(async function ({ field, value, eventId }) {
  try {
    await db.query(
      `update event
        set ${field} = $1
      where
        id = $2`,
      [value, eventId],
    )
  } catch (error) {
    console.error('query error', { stack: error.stack, message: error.message })
  }
  return
})

export default component$(() => {
  const location = useLocation()
  const navigate = useNavigate()

  const event = useResource$(async ({ track }) => {
    const id = track(() => location.params.event_id)

    return await dataFetcher(id)
  })

  const dateIsOpen = useSignal(false)

  return (
    <Resource
      value={event}
      onPending={() => <div>Loading...</div>}
      onRejected={(reason) => <div>Error: {reason}</div>}
      onResolved={(event) => (
        <>
          <form class="space-y-4">
            <div class="flex items-center justify-between gap-x-6 border-b border-gray-900/10 pb-2">
              <h2 class="text-xl font-semibold leading-7">Edit event</h2>
              <button
                type="button"
                class={`rounded-md bg-white px-3 py-2 text-sm text-black font-semibold shadow-sm hover:bg-slate-100 outline outline-1 outline-slate-300`}
                onClick$={() => navigate('/')}
              >
                Close
              </button>
            </div>
            <fieldset class="" role="group">
              <legend class="text-sm font-semibold leading-6">Column</legend>
              <div class="mt-2 space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                <div class="flex items-center">
                  <input
                    id="migration"
                    name="event_type"
                    type="radio"
                    checked={event.event_type === 'migration'}
                    value="migration"
                    onChange$={() =>
                      updater({
                        field: 'event_type',
                        value: 'migration',
                        eventId: event.id,
                      })
                    }
                    class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600 hover:cursor-pointer"
                  />
                  <label
                    for="migration"
                    class="ml-3 block text-sm font-medium leading-6 text-gray-900 hover:cursor-pointer"
                  >
                    maritime events
                  </label>
                </div>
                <div class="flex items-center">
                  <input
                    id="politics"
                    name="event_type"
                    type="radio"
                    checked={event.event_type === 'politics'}
                    value="politics"
                    onChange$={() =>
                      updater({
                        field: 'event_type',
                        value: 'politics',
                        eventId: event.id,
                      })
                    }
                    class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600 hover:cursor-pointer"
                  />
                  <label
                    for="politics"
                    class="ml-3 block text-sm font-medium leading-6 text-gray-900 hover:cursor-pointer"
                  >
                    political events
                  </label>
                </div>
              </div>
            </fieldset>
            <fieldset class="col-span-full" id="title">
              <label for="title" class="block text-sm font-medium leading-6">
                Title
              </label>
              <div class="mt-2">
                <input
                  type="text"
                  name="title"
                  id="title"
                  class="block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  value={event.title}
                  onChange$={(e, currentTarget) =>
                    updater({
                      field: 'title',
                      value: currentTarget.value,
                      eventId: event.id,
                    })
                  }
                />
              </div>
            </fieldset>
            <fieldset
              class="col-span-full"
              onFocusin$={() => {
                dateIsOpen.value = true
              }}
              onFocusout$={() => {
                dateIsOpen.value = false
              }}
            >
              <legend
                for="title"
                class="block text-sm font-medium leading-6 col-span-full"
              >
                Date
              </legend>
              <div class="mt-2">
                <input
                  type="text"
                  name="datum"
                  id="title"
                  class="block w-full rounded-md border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  value={
                    event.datum ? dayjs(event.datum).format('DD.MM.YYYY') : null
                  }
                  onChange$={async (e, currentTarget) => {
                    await updater({
                      field: 'datum',
                      value: dateFromInputForDb(currentTarget.value),
                      eventId: event.id,
                    })
                    navigate()
                  }}
                  required
                />
                <div
                  class={`absolute left-1/2 z-50 flex -translate-x-1/2 px-4 mt-4 ${
                    dateIsOpen.value
                      ? 'transition ease-in opacity-100 translate-y-0'
                      : 'transition duration-200 ease-out opacity-0 translate-y-1 h-0'
                  }`}
                >
                  <Calendar event={event} />
                </div>
              </div>
            </fieldset>
            <fieldset class="select-none">
              <legend class="text-sm font-semibold leading-6">Tag</legend>
              <p class="text-sm text-grey-600">
                The tag replaces the bullet point of the event. Thus only one
                can be choosen.
              </p>
              <div class="flex flex-wrap gap-x-3 gap-y-4 grow shrink-0 mt-4">
                <div class="flex align-center gap-x-3 basis-44">
                  <input
                    id="weather"
                    name="tag"
                    type="radio"
                    class="w-4 rounded border-gray-300 text-blue-800 focus:ring-blue-800 hover:cursor-pointer"
                    checked={event.tag === 'weather'}
                    value="weather"
                    onChange$={() =>
                      updater({
                        field: 'tag',
                        value: 'weather',
                        eventId: event.id,
                      })
                    }
                  />
                  <label
                    for="weather"
                    class="text-sm font-medium relative ml-6 event-weather hover:cursor-pointer"
                  >
                    weather
                  </label>
                </div>
                <div class="flex align-center gap-x-3 basis-44">
                  <input
                    id="victims"
                    name="tag"
                    type="radio"
                    class="w-4 rounded border-gray-300 text-blue-800 focus:ring-blue-800 hover:cursor-pointer"
                    checked={event.tag === 'victims'}
                    value="victims"
                    onChange$={() =>
                      updater({
                        field: 'tag',
                        value: 'victims',
                        eventId: event.id,
                      })
                    }
                  />
                  <label
                    for="victims"
                    class="text-sm font-medium relative ml-6 event-victims hover:cursor-pointer"
                  >
                    victims
                  </label>
                </div>
                <div class="flex align-center gap-x-3 basis-44">
                  <input
                    id="highlighted"
                    name="tag"
                    type="radio"
                    class="w-4 rounded border-gray-300 text-blue-800 focus:ring-blue-800 hover:cursor-pointer"
                    checked={event.tag === 'highlighted'}
                    value="highlighted"
                    onChange$={() =>
                      updater({
                        field: 'tag',
                        value: 'highlighted',
                        eventId: event.id,
                      })
                    }
                  />
                  <label
                    for="highlighted"
                    class="text-sm font-medium relative ml-6 event-highlighted hover:cursor-pointer"
                  >
                    highlighted
                  </label>
                </div>
                <div class="flex align-center gap-x-3 basis-44">
                  <input
                    id="statistics"
                    name="tag"
                    type="radio"
                    class="w-4 rounded border-gray-300 text-blue-800 focus:ring-blue-800 hover:cursor-pointer"
                    checked={event.tag === 'statistics'}
                    value="statistics"
                    onChange$={() =>
                      updater({
                        field: 'tag',
                        value: 'statistics',
                        eventId: event.id,
                      })
                    }
                  />
                  <label
                    for="statistics"
                    class="text-sm font-medium relative ml-6 event-statistics hover:cursor-pointer"
                  >
                    statistics
                  </label>
                </div>
                <div class="flex align-center gap-x-3 basis-44">
                  <input
                    id="monthlyStatistics"
                    name="tag"
                    type="radio"
                    class="w-4 rounded border-gray-300 text-blue-800 focus:ring-blue-800 hover:cursor-pointer"
                    checked={event.tag === 'monthlyStatistics'}
                    value="monthlyStatistics"
                    onChange$={() =>
                      updater({
                        field: 'tag',
                        value: 'monthlyStatistics',
                        eventId: event.id,
                      })
                    }
                  />
                  <label
                    for="monthlyStatistics"
                    class="text-sm font-medium  relative ml-6 event-monthlyStatistics hover:cursor-pointer"
                  >
                    monthly Statistics
                  </label>
                </div>
                <div class="flex align-center gap-x-3 basis-44">
                  <input
                    id="null"
                    name="tag"
                    type="radio"
                    class="w-4 rounded border-gray-300 text-blue-800 focus:ring-blue-800 hover:cursor-pointer"
                    checked={event.tag === null}
                    value="null"
                    onChange$={() =>
                      updater({
                        field: 'tag',
                        value: null,
                        eventId: event.id,
                      })
                    }
                  />
                  <label
                    for="monthlyStatistics"
                    class="text-sm font-medium hover:cursor-pointer"
                  >
                    none
                  </label>
                </div>
              </div>
            </fieldset>
            <fieldset class="mt-3">
              <legend class="text-sm font-semibold leading-6">Links</legend>
              <p class="mt-1 text-sm leading-6 text-gray-600">
                Links will be listet after the title and open in a new tab.
              </p>
              <Links event={event} />
            </fieldset>
            <div class="flex items-center justify-end gap-x-6">
              <button
                type="button"
                class={`rounded-md bg-white px-3 py-2 text-sm text-black font-semibold shadow-sm hover:bg-slate-100 outline outline-1 outline-slate-300`}
                onClick$={() => navigate('/')}
              >
                Close
              </button>
            </div>
          </form>
        </>
      )}
    />
  )
})
